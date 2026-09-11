# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`dstack` is a Claude Code **plugin marketplace** (`.claude-plugin/marketplace.json`) publishing two plugins:

- **`dan-coding`** (`plugins/dan-coding/`) — software engineering skills, agents, and principles. Everything most work in this repo touches.
- **`dan-financial`** (`plugins/dan-financial/`) — a single skill, Warren Buffett-style investment analysis (`skills/investment-buffett/`).

There is no application to build or run; the "product" is Markdown skill/agent definitions plus a small TypeScript/Bun toolchain that backs a few `dan-coding` skills. Users install via Claude Code itself, not a local script:

```
/plugin marketplace add nkcoder/dstack
/plugin install dan-coding@dstack
/plugin install dan-financial@dstack
```

(There is no `install.sh` — that symlink-based installer was removed when the repo converted to a marketplace. Don't recreate it; plugin install/update is Claude Code's job now.)

## Validating changes to skills/agents

No test suite for the Markdown content; validation is structural, via scripts under `plugins/dan-coding/skills/dan-mode/scripts/`:

```bash
node plugins/dan-coding/skills/dan-mode/scripts/check-skills.mjs        # lint all skills/agents in dan-coding
node plugins/dan-coding/skills/dan-mode/scripts/check-plan.mjs <plan.md>  # validate a dan-mode multi-phase plan file
```

`check-skills.mjs` resolves its own plugin root relative to its own path (three levels up from the script), so it always lints whichever `plugins/<name>/{skills,agents}` it lives under — it does not need to be pointed at the repo root. It checks that every skill has valid frontmatter (`name` matching its directory, non-empty `description`), and that every in-prose reference to another **bold-skill-name**, a `/slash-command`, or a `subagent_type` resolves to something real (or an explicit allowlist entry in the script for deliberately-external skills/commands). Run it after adding, renaming, or moving any skill/agent, or after editing cross-references between them, and fix every line it prints.

### The `dan-mode` TypeScript tooling

`plugins/dan-coding/skills/dan-mode/scripts/orch/` and `.../scripts/watch-pr/` are Bun/TypeScript projects with their own tests, run via the sibling `package.json`:

```bash
cd plugins/dan-coding/skills/dan-mode/scripts
bun install
bun run test         # bun test orch watch-pr
bun run typecheck    # tsc --noEmit --strict for both projects
```

Single test file: `bun test orch/orch.test.ts` or `bun test watch-pr/cli.test.ts` from that `scripts/` directory.

## Architecture

### Marketplace layout

`.claude-plugin/marketplace.json` lists each plugin's `name` and `source` (a relative path to a directory containing its own `.claude-plugin/plugin.json`). Adding a new plugin means creating `plugins/<name>/.claude-plugin/plugin.json` plus its `skills/`/`agents/` and registering it in the marketplace manifest's `plugins` array.

### Skills (`plugins/<plugin>/skills/*/SKILL.md`)

Each skill is a directory with a `SKILL.md` (YAML frontmatter: `name`, `description`, optionally `disable-model-invocation: true` to make it callable only by explicit `/name` and never auto-triggered) plus optional `references/`, `scripts/`, or `playbooks/` subdirectories. `description` is load-bearing: it's what a future Claude session matches against to decide whether to load the skill, so it must state concretely when to use it, not just what it is.

Within `dan-coding`, skills fall into a few families:

- **`dan-mode`** is the umbrella "agent style" skill (`skills/dan-mode/SKILL.md`) — the routing table `dan-agent` reads before doing any work. It maps triggers (an architecture decision, a contested design, "before commit", a PR-status request, ...) to other skills, and indexes every `principle-*` skill under short thematic headings (Core, Architecture, Verification, Delegation, Meta). Its step-by-step procedures live in `skills/dan-mode/playbooks/*.md` — one file per task shape (feature, bug-fix, refactoring, hillclimb, shipping, orchestrate, ...). dan-mode's reply-writing rules delegate to the `unslop` skill.
- **`principle-*` skills** are single-concept leaves (e.g. `principle-fix-root-causes`, `principle-boundary-discipline`). They're referenced by name from `dan-mode` and elsewhere rather than duplicated; read the leaf skill in full before applying the principle it names.
- **Routed workflow skills** (`how`, `why`, `arena`, `swarm`, `architect`, `interrogate`, `reflect`) spawn one or more subagents on specific models for a specific shape of work (parallel design exploration, adversarial review, N-way races, etc.).
- **`setup-dstack`** writes `~/.claude/rules/dstack-models.md`, a per-role model register the routed workflow skills and dan-mode playbooks read to decide which model each spawned subagent runs on. Nothing loads this file automatically — each reader opens it by an exact role label and falls back to its own hardcoded default if the label is absent, so the label spelling in `setup-dstack`'s SKILL.md and in the reading skill must match exactly. A role that exists in a skill but isn't in that table is a bug in `setup-dstack`, fixed in the same PR that needs it.
- Everything else (`unslop`, `technical-writing`, `no-comments`, `tdd`, `recall`, `show-me-your-work`, etc.) is standalone.

`dan-financial` currently has one skill, `investment-buffett`, and no `dan-mode`-style routing layer.

### Agents (`plugins/<plugin>/agents/*.md`)

Standalone subagent definitions, same frontmatter shape as skills (`name`, `description`, optionally `is_background: true`). `dan-agent.md` is the routing target for `/dan-mode`: a thin pointer telling the subagent to read `dan-mode`'s `SKILL.md` in full (including the Principles index) before acting — substituting a generic subagent type for it causes drift because the routing logic lives entirely in that SKILL.md, not in the agent file.

### Cross-referencing convention

Skill/agent prose refers to other skills as **bold-skill-name** (matching the skill's `name:` frontmatter) and to slash commands as `/command`. `check-skills.mjs` validates these, so keep new skill names and their prose mentions consistent, and update the script's allowlist in the same PR when intentionally referencing something outside the plugin (e.g. `loop`, `run`, `security-review`, `simplify`, `skill-creator`, which ship with Claude Code itself).
