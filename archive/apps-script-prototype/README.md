# Apps Script prototype — kept for reference, not in use

These three files were the first working prototype of the OM catalog, built on Google Apps Script
with a Google Sheet as the data store:

- `Code.gs` — the Apps Script backend
- `index.html` — the single-page frontend
- `.clasp.json` — the `clasp` config that pushed the above to Google

## Why it is here and not deleted

Superseded by Nathan's decision of **30 July 2026** (see
`conversations/2026-07-30-domain-split-and-stack-pivot.md`): the goal is to *replace* the Google
Docs and Sheets, not to build the app inside the same ecosystem and then rebuild it later. The real
stack is TypeScript/Node plus PostgreSQL, from the start.

The prototype is kept because it is the only place where some of the intended behaviour was actually
expressed as working code — card layout, filters, the market details panel. It is a **reference for
what the app should do**, not a starting point for the build.

## Do not

- Do not `clasp push` from here. The Apps Script deployment is no longer maintained, and the
  deploy workflow was deliberately disabled (commit `6cc2f14`).
- Do not copy code from here into `app/` without checking it against the current model in
  `docs/proposal/`. The data model has changed substantially since this was written.
