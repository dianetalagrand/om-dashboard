# Project facts (Claude: fill in on first session, keep updated)

<!-- RULES for this file:
- Max 15 lines of facts (this comment block doesn't count). To add, condense or delete something first.
- Only durable facts — true next month, not just today.
- NEVER: session summaries, changelogs, bug history, to-dos, code. Git remembers those.
- Telegraphic style: "Runs: npm run dev, port 3000" — no full sentences. -->

- What this app does: single management center for OM work — coordinates operating-model changes, records decisions, answers lookups. Replaces OM Streams Log Doc + OM Decisional Framework
- Stack: TypeScript/Node + PostgreSQL, real stack from day one (Nathan, 30 Jul 2026). Frontend framework: undecided
- Owner: Diane Talagrand (OM PM); approver: Nathan Vené
- Remote: `origin` = GitHub (dianetalagrand/om-dashboard). No GitLab remote configured in this clone — GitLab is `whyus-git/omg/om-governance-dashboard` on gitlab.lastminute.com, main protected, MR-only. CLI push to GitLab hits an OAuth wall here (Git Credential Manager); push from where Diane's login already works
- Workflow: branch + MR into main; only maintainers merge on GitLab
- Layout: `app/` = the application (scaffold, no deps yet). `docs/proposal/` = domain reframe, ACCEPTED 3 Aug 2026 — supersedes Driver/DetailSections in `docs/ARCHITECTURE.md` + `docs/PRODUCT_SPEC.md` + `config/clusters.json`. `archive/` = superseded, kept
- Apps Script + Google Sheet: superseded 30 Jul 2026, prototype kept in `archive/apps-script-prototype/`
- Driver = 3 values (Governance absorbs Compliance): OM Governance 26, OM Market Expansion 5, OM Efficiency 3 — real counts from the 34 streams
- Assessment functions = 13, closed list: 3 fixed (Legal, Fiscal, DPO) + 10 optional, added by need. See `config/clusters.json` → `functions`
- Trigger = 3 origin types (decision elsewhere / outside authority / OM spots a risk) + link to Decision+Forum. See `config/clusters.json` → `trigger`
- M1 complete 3 Aug 2026: all 34 real streams seeded as structured data in `docs/proposal/m1-streams-seed.json`
- Blocked on Nathan: 7 infra questions (`conversations/2026-07-30-domande-per-nathan-stack-infra.md`) + agree words/3 categories (`om-maps.html` §5/§9) + Admin recognition mechanism + merge GitLab MR !8
- `.claude/launch.json`: empty until `app/` runs (stale wu-station entry removed 3 Aug 2026)
