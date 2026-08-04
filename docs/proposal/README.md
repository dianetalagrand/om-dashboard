# Domain reframe — ACCEPTED 3 August 2026

**Status: accepted by Diane. This now supersedes the data model in `docs/ARCHITECTURE.md`, the `Driver` list and `DetailSections` in `docs/PRODUCT_SPEC.md`, the category definitions in `../../config/clusters.json`, the dashboard layout in `PRODUCT_SPEC.md` §2.1, and `../MVP_ROADMAP.md` (replaced by the Map 3 milestone plan). Those files are marked superseded, not deleted — see each for the pointer back here.**

**One correction to the taxonomy on acceptance (Diane, 3 Aug 2026): `OM Compliance` and `OM Governance` are not two separate Drivers — everything Nathan counted as `OM Compliance` (2 streams) is `OM Governance`. The Driver list is 3 values, not 4: OM Governance, OM Market Expansion, OM Efficiency.**

## What is in here

- **`om-maps.html`** — the current version. Open it by double-clicking; it needs no server, no
  install, and works offline. It covers: what the app does and who for, how OM work flows today and
  where it breaks, the vocabulary, a capability-by-release matrix, six releases each with a
  plain-English brief, and the open decisions.
- **`OM_DOMAIN_MAPS.md`** — the earlier markdown version of the same content, before it was
  restructured around the product rather than the data model. Kept because it is the plain-text
  record; `om-maps.html` is the one to read.

## Why it exists

The specs in `docs/` were written from the shape of the OM Streams Log — a flat list of tabs — so
they became one table with a Kanban on top. Reading the four real source documents (Perimeter and
Governance, Streams Log, Decisional Framework, Market Architecture) surfaced three things the specs
have no room for:

1. **What sets a stream off.** Most streams start with a decision taken at another table, or an
   outside authority, and land on OM as something to absorb.
2. **One function's input on one stream.** This is the unit OM actually chases, and it has no
   representation in the current schema.
3. **When the change is actually in force.** A stream is not finished when the decision is taken.

It also found that the four categories already exist, consistently tagged, across the 34 real
streams — and that they are not the four in the current spec.

## What it replaces

The data model in `../ARCHITECTURE.md`; the `Driver` list and `DetailSections` in
`../PRODUCT_SPEC.md`; the category definitions in `../../config/clusters.json`; the dashboard layout
in `../PRODUCT_SPEC.md` §2.1 (already flagged there as needing rework); and `../MVP_ROADMAP.md`.

Everything in `../PRODUCT_SPEC.md` about how the app *behaves* — one Admin role, no login, one-way
publish, the drag board, read-only history, no delete or rollback, two notification audiences —
carries over unchanged.

## Before anything moves

**Accepted 3 Aug 2026 by Diane**, including Nathan's recommended defaults on the open questions in section 8 of `om-maps.html` — except the Driver taxonomy, corrected above (3 values, Governance absorbs Compliance), and the impact facet: filed by function only, no separate impact tag on top (function *is* the impact perspective). All four of Diane's own questions in section 8 are now resolved with her actual answers written inline there, plus two more settled the same day: the function list is closed at 13 (3 fixed + 10 optional, see `config/clusters.json` → `functions`), and Trigger is confirmed exactly as Nathan wrote it (3 origin types + a link to Decision and Forum).

**M1 (seed from evidence) is complete 3 Aug 2026**: all 34 real streams are extracted as structured data in `m1-streams-seed.json`, cross-checked against Diane's own Kanban board for real status where the source doc had none. Still open, tracked in `PROJECT.md` and the 30-July infra questions doc: Nathan's own sign-off items (2-4 in section 8), and the 7 stack/infra questions.
