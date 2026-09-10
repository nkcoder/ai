# Sources: what's current, what's dated

Notes from checking each book against how the field talks about it today (2026). The point isn't to worship or dismiss any of these — it's to keep applying the parts that still hold and stop reflexively repeating the parts that don't.

## Clean Code (Robert C. Martin, 2008)

**Still holds:** meaningful names, functions that do one thing, tests as living documentation, the general case for readability over cleverness.

**Dated / contested:**
- "Functions should hardly ever be 20 lines long" and "extract till you can't extract anymore" — this is the most litigated advice in the book. Critics (and Ousterhout's *A Philosophy of Software Design*, written partly in response) argue it produces shallow modules: lots of tiny pieces, each easy to read in isolation, but the overall flow scattered across files, forcing readers to jump around to reconstruct one path. §3 in SKILL.md reconciles this.
- "Comments are almost always a failure" — also contested. A comment that captures a non-obvious *why* (a workaround, a rejected alternative, an invariant that isn't visible in the code) is cheaper than forcing extra decomposition just to avoid writing one sentence.
- Heavy Java/OOP framing (EJB, AspectJ-era examples) — the naming/functions/tests advice generalizes past this, but don't lift the concurrency chapter as current; it predates the concurrency models in Go, Rust, and modern async runtimes.

## The Pragmatic Programmer (Hunt & Thomas, 1999, 20th-anniversary ed. 2019)

Holds up well overall — DRY, orthogonality (≈ low coupling), tracer bullets, "don't repeat yourself" originate or get their clearest statement here. The 2019 edition already re-edited the dated bits (CVS-era tooling references, etc.), so treat it as current.

## Refactoring (Martin Fowler, 1999, 2nd ed. 2018)

Still the reference for *how* to restructure code safely (small, behavior-preserving steps, backed by tests). The 2nd edition modernized examples to JavaScript. Pairs directly with Tidy First's "separate tidying from behavior change."

## The Software Craftsman (Sandro Mancuso, 2014)

Holds up as a professionalism/practice framing (craftsmanship over just "getting it done," technical debt as a business conversation) rather than a source of technical principles — used lightly here.

## Functional Programming in Scala (Chiusano & Bjarnason, 1st ed. 2014, 2nd ed. 2023)

The core ideas (immutability, pure functions, referential transparency) have only become more mainstream since 2014 — they're now baked into mainstream languages (Rust ownership, `const`/`readonly` in JS/TS, Kotlin `val`, React's insistence on immutable state). Treated in SKILL.md as a paradigm-agnostic principle, not Scala-specific.

## A Philosophy of Software Design (John Ousterhout, 2018, 2nd ed. 2021)

Added because it's the most-cited modern counterweight to Clean Code's tactical, many-small-pieces style — "deep modules" (small interface, large functionality behind it), "strategic vs. tactical programming" (invest in design now vs. always taking the fast path), and a defense of comments that Clean Code argues against. Current and widely read as of 2026.

## Tidy First? (Kent Beck, 2023)

Added because it's the most current, well-regarded treatment of a gap the older books don't address cleanly: *when* to restructure relative to behavior changes, and how to keep the two separated so each is easy to review and revert independently. Directly extends Boy Scout Rule and Refactoring.

## Considered and left out

- **Design Patterns (GoF, 1994)** — most of the classic patterns are either language-level features now (iterators, in many languages) or over-applied relative to their actual utility; didn't add a durable, still-current principle beyond what's already covered (composition over inheritance, open/closed).
- **Domain-Driven Design (Eric Evans, 2003)** — valuable, but its core contribution (bounded contexts, ubiquitous language) is about large-system/team boundaries rather than code-shape principles that apply to a single function or module. Out of scope for this skill; worth its own skill if needed.
- **Working Effectively with Legacy Code (Feathers, 2004)** — excellent on introducing seams/characterization tests before refactoring untested code, but that's a testing-strategy skill, not a code-design-principle one. Candidate for a separate skill if refactoring-legacy-code work comes up often.
