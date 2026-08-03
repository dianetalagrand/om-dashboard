# Project facts (Claude: fill in on first session, keep updated)

<!-- RULES for this file:
- Max 15 lines of facts (this comment block doesn't count). To add, condense or delete something first.
- Only durable facts — true next month, not just today.
- NEVER: session summaries, changelogs, bug history, to-dos, code. Git remembers those.
- Telegraphic style: "Runs: npm run dev, port 3000" — no full sentences. -->

- What this app does: single management center for OM work — coordinates operating-model changes, records decisions, answers lookups. Replaces OM Streams Log Doc + OM Decisional Framework
- Stack: TypeScript/Node + PostgreSQL, real stack from day one (Nathan, 30 Jul 2026). Frontend framework: undecided
- Owner: Diane Talagrand (OM PM); approver: Nathan Vené
- Remote: GitLab `origin` only. No GitHub remote in this clone (README's GitHub-primary claim is stale). Stale `diane-github/*` refs present locally
- Workflow: branch + MR into main; every recent main commit is a merge from a branch. Only maintainers merge
- Layout: `app/` = the application (scaffold, no deps yet). `docs/` = agreed spec. `docs/proposal/` = reframe, NOT yet agreed. `archive/` = superseded, kept
- Apps Script + Google Sheet: superseded 30 Jul 2026, prototype kept in `archive/apps-script-prototype/`
- Blocked on Nathan: 7 infra questions (`conversations/2026-07-30-domande-per-nathan-stack-infra.md`) + agreement on vocabulary and the 4 categories
- Blocked on Diane, decides the central table: is a function's input filed by function, or by kind of impact?
- Real driver tags, counted from the 34 streams in the Log: OM Governance 24, OM Market Expansion 5, OM Efficiency 3, OM Compliance 2. `OM Optimisation` in config/clusters.json does not exist in the real material
- Stale in repo, not fixed: `.claude/launch.json` points at a `wu-station` project that isn't here
