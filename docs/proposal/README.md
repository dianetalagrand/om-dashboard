# Proposal — a reframe of the model, not yet agreed

**Status: proposal. Nothing here has replaced anything in `docs/`.**

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

## What it would replace, if agreed

The data model in `../ARCHITECTURE.md`; the `Driver` list and `DetailSections` in
`../PRODUCT_SPEC.md`; the category definitions in `../../config/clusters.json`; the dashboard layout
in `../PRODUCT_SPEC.md` §2.1 (already flagged there as needing rework); and `../MVP_ROADMAP.md`.

Everything in `../PRODUCT_SPEC.md` about how the app *behaves* — one Admin role, no login, one-way
publish, the drag board, read-only history, no delete or rollback, two notification audiences —
carries over unchanged.

## Before anything moves

Two decisions, both listed in section 8 of `om-maps.html`:

- **Diane** — is a function's input filed by function or by kind of impact? This shapes everything
  else.
- **Nathan** — agreement on the vocabulary and the four categories.
