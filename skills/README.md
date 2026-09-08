# AI

A personal collection of AI resources — skills, agents, MCP servers, etc. This is a living collection; more categories will be added as they're picked up.

## Contents

- [`coding-discipline/`](coding-discipline/SKILL.md) — behavioral guidelines for coding with an LLM (think before coding, simplicity first, surgical changes, goal-driven execution). Adapted from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/).
- [`awesome-skills.md`](awesome-skills.md) — curated list of third-party Claude skills worth knowing about, grouped by category, with a short description of what each one does.

## Installing the skills

[`../scripts/install-skills.sh`](../scripts/install-skills.sh) installs every skill listed in [`../scripts/manifest.txt`](../scripts/manifest.txt) — `coding-discipline` plus the third-party skills from `awesome-skills.md` — into `~/.claude/skills/<skill-name>/`. GitHub Copilot CLI also auto-discovers skills from that same directory, so this one location covers both tools.

```bash
./scripts/install-skills.sh          # install everything
./scripts/install-skills.sh --force  # overwrite already-installed skills
```

`coding-discipline` is symlinked (so local edits apply immediately); everything else is fetched from its source repo and copied in. A few entries from `awesome-skills.md` are intentionally left out of the manifest — see the comment at the top of `manifest.txt` for why (a Claude Code plugin, an 818-skill collection meant for manual browsing, and two non-skill references).
