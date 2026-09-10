# AI

A personal collection of AI resources — skills, agents, MCP servers, etc. This is a living collection; more categories will be added as they're picked up.

## Installing

[`install.sh`](install.sh) symlinks every skill in `skills/` and every agent in `agents/` into `~/.claude/skills/` and `~/.claude/agents/`, overriding anything already installed under the same name.

```bash
./install.sh
```

## Agents

- [`agents/dan-agent.md`](agents/dan-agent.md) — routing target for `/dan-mode`; reads the `dan-mode` skill in full before any work.
- [`agents/comment-sicko.md`](agents/comment-sicko.md) — deranged comment-hater that hunts down and deletes narration, banners, and workaround comments.

## Skills

- [`skills/architect/`](skills/architect/SKILL.md) — sketch types, signatures, and module structure before code, then stay in the loop while implementation fills in.
- [`skills/arena/`](skills/arena/SKILL.md) — spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it.
- [`skills/automate-me/`](skills/automate-me/SKILL.md) — draft or revise a personal "-mode" skill capturing how the user works, via skill-creator + unslop.
- [`skills/blast-radius/`](skills/blast-radius/SKILL.md) — find what a change could break beyond the diff, and prove the one fact that makes it safe by running real code.
- [`skills/bro/`](skills/bro/SKILL.md) — restate the last message in plain human language, no jargon.
- [`skills/coding-best-practice/`](skills/coding-best-practice/SKILL.md) — language-agnostic coding guidelines covering restraint and design, distilled from classic engineering literature plus common LLM failure modes.
- [`skills/create-verification-skill/`](skills/create-verification-skill/SKILL.md) — generate a project-local verification skill that drives an app the way a user does.
- [`skills/dan-mode/`](skills/dan-mode/SKILL.md) — Dan's agent style: concise responses, deliberate subagents, unslopped prose, simple code, verified work.
- [`skills/figure-it-out/`](skills/figure-it-out/SKILL.md) — auditable playbook for large migrations or ambitious multi-part changes with no narrower playbook.
- [`skills/grilling/`](skills/grilling/SKILL.md) — grill the user relentlessly about a plan, decision, or idea to stress-test their thinking.
- [`skills/how/`](skills/how/SKILL.md) — explain subsystem architecture, runtime flow, and placement/ownership questions.
- [`skills/interrogate/`](skills/interrogate/SKILL.md) — multiple LLM reviewers challenge a change from independent angles.
- [`skills/investment-buffett/`](skills/investment-buffett/SKILL.md) — Warren Buffett's investment thinking system for stock/company analysis and capital allocation.
- [`skills/maintain-verification-skill/`](skills/maintain-verification-skill/SKILL.md) — periodic audit that keeps a project's verification skill and feature map honest.
- [`skills/make-bot-ui/`](skills/make-bot-ui/SKILL.md) — build a custom UI that wakes a Grok Bot over a webhook, optionally exposed on Tailscale.
- [`skills/no-comments/`](skills/no-comments/SKILL.md) — spawn Comment Sicko, fix accepted findings, and encode claimed constraints instead of commenting them.
- [`skills/principle-attack-the-premise/`](skills/principle-attack-the-premise/SKILL.md) — question a shared premise once two or more fixes assuming it have failed the same gate.
- [`skills/principle-boundary-discipline/`](skills/principle-boundary-discipline/SKILL.md) — concentrate validation and error handling at system boundaries; keep internal logic pure.
- [`skills/principle-build-the-lever/`](skills/principle-build-the-lever/SKILL.md) — build the tool that does or proves the work (codemod, script, generator) instead of doing it by hand.
- [`skills/principle-encode-lessons-in-structure/`](skills/principle-encode-lessons-in-structure/SKILL.md) — encode a recurring correction as a lint, flag, or check instead of repeating the instruction.
- [`skills/principle-exhaust-the-design-space/`](skills/principle-exhaust-the-design-space/SKILL.md) — build 2-3 competing prototypes before committing to a novel UI or architectural decision.
- [`skills/principle-experience-first/`](skills/principle-experience-first/SKILL.md) — choose user delight over implementation convenience; fewer polished features over more rough ones.
- [`skills/principle-fix-root-causes/`](skills/principle-fix-root-causes/SKILL.md) — trace each symptom to its root cause and fix it there, not with a guard that silences it.
- [`skills/principle-foundational-thinking/`](skills/principle-foundational-thinking/SKILL.md) — get core data structures right first so downstream code becomes obvious.
- [`skills/principle-guard-the-context-window/`](skills/principle-guard-the-context-window/SKILL.md) — route bulk work to subagents; keep summaries, not raw payloads, in the main thread.
- [`skills/principle-laziness-protocol/`](skills/principle-laziness-protocol/SKILL.md) — bias toward deletion and the smallest change that solves the problem.
- [`skills/principle-make-operations-idempotent/`](skills/principle-make-operations-idempotent/SKILL.md) — design commands and lifecycle steps to converge to the same end state despite crashes and retries.
- [`skills/principle-migrate-callers-then-delete-legacy-apis/`](skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) — migrate callers and delete the old API in the same wave, no compatibility layer.
- [`skills/principle-minimize-reader-load/`](skills/principle-minimize-reader-load/SKILL.md) — collapse one-caller wrappers and shrink mutable scope to reduce hidden state a reader must track.
- [`skills/principle-model-the-domain/`](skills/principle-model-the-domain/SKILL.md) — encode the domain in a structure instead of scattered conditionals.
- [`skills/principle-never-block-on-the-human/`](skills/principle-never-block-on-the-human/SKILL.md) — proceed on reversible work and let the human course-correct after; reserve confirmation for irreversible actions.
- [`skills/principle-outcome-oriented-execution/`](skills/principle-outcome-oriented-execution/SKILL.md) — converge on the target architecture during a migration instead of preserving throwaway compatibility code.
- [`skills/principle-prove-it-works/`](skills/principle-prove-it-works/SKILL.md) — verify against the real artifact before declaring done, not a proxy or self-report.
- [`skills/principle-redesign-from-first-principles/`](skills/principle-redesign-from-first-principles/SKILL.md) — redesign as if a new requirement had been foundational from day one, instead of bolting it on.
- [`skills/principle-separate-before-serializing-shared-state/`](skills/principle-separate-before-serializing-shared-state/SKILL.md) — eliminate sharing between concurrent writers first; serialize only when one shared writer is a real invariant.
- [`skills/principle-sequence-verifiable-units/`](skills/principle-sequence-verifiable-units/SKILL.md) — break multi-step work into small units that each end in a verifiable state.
- [`skills/principle-subtract-before-you-add/`](skills/principle-subtract-before-you-add/SKILL.md) — remove dead code and redundant validators before building on top.
- [`skills/principle-test-behavior-not-implementation/`](skills/principle-test-behavior-not-implementation/SKILL.md) — call code the way its users do and assert the result they observe.
- [`skills/principle-type-system-discipline/`](skills/principle-type-system-discipline/SKILL.md) — make illegal states unrepresentable; brand primitives, parse at boundaries, exhaust variants.
- [`skills/recall/`](skills/recall/SKILL.md) — reconstruct recent working context from chat history and shared state into a tight current-state brief.
- [`skills/reflect/`](skills/reflect/SKILL.md) — spawn three parallel review subagents over the active transcript and route learnings to concrete skill edits.
- [`skills/show-me-your-work/`](skills/show-me-your-work/SKILL.md) — keep a reviewable decision trail (TSV log) for long-running or unattended work.
- [`skills/swarm/`](skills/swarm/SKILL.md) — fan out N parallel workers, drain them, return one report.
- [`skills/tdd/`](skills/tdd/SKILL.md) — write a failing test then make it pass, when explicitly requested or the bug has an obvious cheap test target.
- [`skills/teach/`](skills/teach/SKILL.md) — explain a body of work plainly by running `how` and `why` and weaving the results together.
- [`skills/technical-writing/`](skills/technical-writing/SKILL.md) — Diátaxis structure, Google developer style, and STE instruction rules for docs, RFCs, and PR descriptions.
- [`skills/typescript-best-practices/`](skills/typescript-best-practices/SKILL.md) — TypeScript best practices for any `.ts`/`.tsx` file.
- [`skills/unslop/`](skills/unslop/SKILL.md) — cut AI tells from any writing.
- [`skills/why/`](skills/why/SKILL.md) — discover available MCPs and query each evidence source in parallel for a cited read on design rationale and decisions.

# References

## Skills

- [agi-now/buffett-skills](https://github.com/agi-now/buffett-skills) — Warren Buffett-style investment analysis via structured stock-analysis templates and reference material.
- [mukul975/Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) — 818 structured cybersecurity skills mapped to MITRE ATT&CK and NIST CSF 2.0 for security workflows.

## Plugins

- [NeoLabHQ/ddd](https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/ddd) — Bakes Clean Architecture, SOLID, and Domain-Driven Design patterns into the dev workflow via automated rules.

## Stack

- [Cursor PStack](https://github.com/cursor/plugins/tree/main/pstack)