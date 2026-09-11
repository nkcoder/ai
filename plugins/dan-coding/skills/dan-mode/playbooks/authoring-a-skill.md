### Authoring or modifying a skill

**You own the skill's voice.**

1. Use the **skill-creator** skill for authoring SKILL.md files.
2. Run `node plugins/dan-coding/skills/dan-mode/scripts/check-skills.mjs` and fix every line it prints (the **encode-lessons-in-structure** principle skill). It checks frontmatter, that `name` matches the directory, that referenced files resolve, and that cross-skill links, slash commands, and `subagent_type` values name something real. A new external skill or command the repo deliberately does not ship gets an entry in the script's allowlist, in the same PR.
3. Test cases if structural. Skip if subjective.
4. Run **Opening a PR**.

When in doubt, delete. Keep only prose that changes a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config) per the **encode-lessons-in-structure** principle skill. Delegate to other skills by path. Don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
