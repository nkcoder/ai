#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const EXTERNAL_SKILLS = ["loop", "run", "simplify", "skill-creator"];
const NON_SKILL_COMMANDS = ["goal"];
const BUILTIN_AGENTS = ["general-purpose", "Explore"];
const SKILL_RELATIVE_PREFIXES = ["references", "scripts", "playbooks"];

const root = process.argv[2]
	? path.resolve(process.argv[2])
	: path.resolve(import.meta.dirname, "../../..");
const skillsDir = path.join(root, "skills");
const agentsDir = path.join(root, "agents");

if (!fs.existsSync(skillsDir)) {
	console.error(`no skills directory at ${skillsDir}`);
	process.exit(2);
}

const problems = [];
const fail = (file, line, message) => {
	const entry = `${path.relative(root, file)}:${line}: ${message}`;
	if (!problems.includes(entry)) problems.push(entry);
};

const readLines = (file) => fs.readFileSync(file, "utf8").split(/\r?\n/);

function frontmatter(file, lines) {
	if (lines[0] !== "---") {
		fail(file, 1, "no frontmatter");
		return null;
	}
	const end = lines.indexOf("---", 1);
	if (end === -1) {
		fail(file, 1, "frontmatter is not closed");
		return null;
	}
	const body = lines.slice(1, end);
	const name = body.find((l) => l.startsWith("name:"));
	const description = body.find((l) => l.startsWith("description:"));
	if (!name) fail(file, 1, "frontmatter has no name");
	if (!description) fail(file, 1, "frontmatter has no description");
	else if (description.slice("description:".length).trim() === "") {
		const continued = body[body.indexOf(description) + 1];
		if (!continued || continued.trim() === "") fail(file, 1, "description is empty");
	}
	return { name: name ? name.slice("name:".length).trim() : null, end };
}

function markdownFiles(dir) {
	const found = [];
	const walk = (current) => {
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			if (entry.name === "node_modules") continue;
			const full = path.join(current, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name.endsWith(".md")) found.push(full);
		}
	};
	walk(dir);
	return found;
}

const skillNames = fs
	.readdirSync(skillsDir, { withFileTypes: true })
	.filter((e) => e.isDirectory())
	.map((e) => e.name)
	.sort();

const agentNames = [];
if (fs.existsSync(agentsDir)) {
	for (const entry of fs.readdirSync(agentsDir).sort()) {
		if (!entry.endsWith(".md")) continue;
		const file = path.join(agentsDir, entry);
		const meta = frontmatter(file, readLines(file));
		if (meta?.name) agentNames.push(meta.name);
	}
}

const knownSkills = new Set([...skillNames, ...EXTERNAL_SKILLS]);
const knownCommands = new Set([...knownSkills, ...NON_SKILL_COMMANDS]);
const knownAgents = new Set([...agentNames, ...BUILTIN_AGENTS]);

const REPO_PATH = /(?:dstack\/)?skills\/[A-Za-z0-9_./-]+/g;
const SKILL_PATH = new RegExp(`(?:${SKILL_RELATIVE_PREFIXES.join("|")})/[A-Za-z0-9_./-]+`, "g");
const BOLD_SKILL = /\*\*([a-z][a-z0-9-]*)\*\* skill/g;
const BOLD_PRINCIPLE = /\*\*([a-z][a-z0-9-]*)\*\* principle skill/g;
const BARE_PRINCIPLE = /\*\*(principle-[a-z0-9-]+)\*\*/g;
const SLASH_COMMAND = /`\/([a-z][a-z0-9-]+)`/g;
const SUBAGENT = /subagent_type`? *: *(?:"([^"]+)"|`([A-Za-z0-9_-]+)`|([A-Za-z0-9_-]+))/g;

function matches(regex, text) {
	const out = [];
	for (const m of text.matchAll(regex)) {
		const value = m.slice(1).find((g) => g !== undefined);
		out.push({ value, index: m.index, match: m[0] });
	}
	return out;
}

function isPartialPath(text, hit) {
	if (hit.match.includes("<") || hit.match.includes("*")) return true;
	if (text[hit.index + hit.match.length] === "<") return true;
	return /[A-Za-z0-9_/-]/.test(text[hit.index - 1] ?? "");
}

function checkFile(file, skillRoot) {
	const lines = readLines(file);
	let fence = false;
	for (let i = 0; i < lines.length; i++) {
		const text = lines[i];
		const n = i + 1;
		if (/^\s*`{3,}/.test(text)) {
			fence = !fence;
			continue;
		}

		for (const hit of matches(REPO_PATH, text)) {
			if (isPartialPath(text, hit)) continue;
			const target = hit.match.replace(/[.,]$/, "").replace(/\/$/, "");
			if (!fs.existsSync(path.join(root, target))) fail(file, n, `path does not resolve: ${target}`);
		}

		if (fence) continue;

		for (const hit of matches(SKILL_PATH, text)) {
			if (isPartialPath(text, hit)) continue;
			const target = hit.match.replace(/[.,]$/, "");
			if (fs.existsSync(path.join(skillRoot, target))) continue;
			if (fs.existsSync(path.join(path.dirname(file), target))) continue;
			fail(file, n, `path does not resolve: ${target}`);
		}

		const principles = new Set(matches(BOLD_PRINCIPLE, text).map((h) => h.value));
		for (const name of principles) {
			if (!knownSkills.has(`principle-${name}`)) fail(file, n, `unknown principle skill: ${name}`);
		}
		for (const hit of matches(BOLD_SKILL, text)) {
			if (principles.has(hit.value)) continue;
			if (!knownSkills.has(hit.value)) fail(file, n, `unknown skill: ${hit.value}`);
		}
		for (const hit of matches(BARE_PRINCIPLE, text)) {
			if (!knownSkills.has(hit.value)) fail(file, n, `unknown skill: ${hit.value}`);
		}
		for (const hit of matches(SLASH_COMMAND, text)) {
			if (!knownCommands.has(hit.value)) fail(file, n, `unknown command: /${hit.value}`);
		}
		for (const hit of matches(SUBAGENT, `${text} `)) {
			if (!knownAgents.has(hit.value)) fail(file, n, `unknown subagent_type: ${hit.value}`);
		}
	}
}

let checked = 0;
for (const name of skillNames) {
	const skillRoot = path.join(skillsDir, name);
	const entry = path.join(skillRoot, "SKILL.md");
	if (!fs.existsSync(entry)) {
		fail(skillRoot, 1, "no SKILL.md, so install.sh skips this directory");
		continue;
	}
	const meta = frontmatter(entry, readLines(entry));
	if (meta?.name && meta.name !== name) {
		fail(entry, 1, `frontmatter name is ${meta.name}, expected ${name}`);
	}
	for (const file of markdownFiles(skillRoot)) checkFile(file, skillRoot);
	checked += 1;
}

console.log(`${checked} skills, ${agentNames.length} agents, ${problems.length} problems`);
for (const p of problems) console.error(p);
process.exit(problems.length ? 1 : 0);
