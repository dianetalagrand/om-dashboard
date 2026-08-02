# 🛰️ OM Governance Dashboard

> A three-dimensional catalog viewer for Operations Management activities, enabling Value Stream Owners to understand what the OM office delivers and why.

## Recently Updated

This is the **single README** for the project (merged with the former `README_MVP_PLAN.md` on 28 July 2026, to stop the two from drifting out of sync). Each update logs what changed here — **NEW** marks content that's new or just revised; it gets cleared on the next update once it's no longer "new."

**2 August 2026** (Gestione OM brainstorm with Diane — see `conversations/2026-08-02-gestione-om-brainstorm.md`):
- **NEW:** Gestione OM has a **single role**: **Admin** (Diane and Nathan, fully symmetric permissions) — not two separately-defined editors. Sergio Stievano and any `Requester` (Business/Corporate/OM Governance) are Visualizzazione OM users only; they never get write access, even when they're the ones raising the need for a stream
- **NEW:** Added a **Draft/Publish** step ahead of a stream going live: a new `PublishedAt` field (null = draft, hidden from Visualizzazione OM). Admin can build up a stream's data before it's visible on the network, then publish it — one-way, no un-publish
- **NEW:** Added an **Admin Kanban view** (Gestione OM only) — columns by Status (New / In Progress / Paused; Closed is excluded, that stays a form action), drag-and-drop to change status, manual reordering within a column to reflect real-world urgency. Exact interaction between the manual order and the existing `Priority` field (Urgent/Normal) is deferred until the stack/architecture is consolidated
- **NEW:** Explicitly out of scope for now: a UI for editing the cluster/output-type/market taxonomy (stays a config file), and an aggregated cross-stream version-history view (stays per-stream)
- **NEW:** `DetailSections` categories verified directly against the live OM Streams Log Doc (via Claude in Chrome) — matches what was already documented (Context, Need, Legal, Finance & Tax, DPO, a per-stream ancillary category, Conclusion). Confirmed: `Need` is the only mandatory category at CREATE; everything else is legitimately filled in later, and the exploded card view only ever shows categories that actually have content
- **NEW:** Added `Go-live Date` (optional) — distinct from the existing `EndDate`/Effective Date, records when an associated deployment (if any) goes into production, which can happen before the stream itself reaches `Closed`
- **NEW:** Notifications: two directions are being kept in mind but not decided yet — in-app notifications beyond the existing toast, and a date-triggered automatic reminder (e.g. Slack message as `Go-live Date` approaches)
- **NEW:** Admin Access Gate revised: **one single app URL for everyone** (not a separate admin link) — device recognition, not login, gates the editing UI; the recognition marker is still checked server-side on every write request. A "Preview as viewer" button for Admin is kept in mind, not committed. Diane's expectation (to confirm with Nathan): network restriction alone should be enough, no VPN/proxy needed. Recommended recognition mechanism (Claude's proposal, pending Nathan): Google Sign-In restricted to Diane's and Nathan's two `@lastminute.com` addresses, rather than a bespoke token scheme
- **NEW:** Critical review pass on Gestione OM (full findings in `conversations/2026-08-02-gestione-om-brainstorm.md`): a draft that reaches Closed without ever publishing gets no special handling (behaves like any closed stream); "[PUBLISH]" lives directly on the stream's own card/form; mistakes are always fixed via EDIT, never a separate undo; `Init Code` needs no Jira API validation (Diane's own upstream Init census already guarantees it exists); `Completeness %` stays a pure manual field, no computed anchor, confirmed not an MVP concern; notifications will eventually split into two audiences (Admin-facing vs. Slack-for-everyone-else) — shape only, detail deferred
- **NEW:** Working-method note: product-doc changes must be mirrored into `ARCHITECTURE.md` in the same pass, without being asked — Diane wants documentation quality here to match Nathan's own standard of precision
- **NEW:** Removed all OKR references (`docs/OKR_REFERENCE.md` deleted, OKR mentions scrubbed from `PRODUCT_SPEC.md`/`ARCHITECTURE.md`/`config/clusters.json`/README Next Steps). Diane is replacing the categorization taxonomy with exactly 3 labels — **OM Compliance, OM Optimisation, OM Efficiency** — used purely as a "ticket type" tag on each stream, never a dashboard filter. Exact mapping onto the existing `Cluster`/`Strategic Pillar`/`Output Type` fields is still being clarified before `config/clusters.json` and the "3D dashboard" framing get rewritten

**30 July 2026** (direction from Nathan Vené — see `conversations/2026-07-30-domain-split-and-stack-pivot.md`):
- Architecture is analyzed as **two separate domains**, not one shared screen: **Gestione OM** (write/workflow — Diane/Nathan create/update streams) and **Visualizzazione OM** (read/discovery — anyone on the network browses the catalog). Each is built as its own vertical rather than starting from a shared data model.
- Stack pivot — the MVP itself is now **TypeScript/Node.js + PostgreSQL**, not Google Apps Script + Sheet. Reason: the goal is to *replace* the OM Streams Log Doc/Sheet, not stage the app inside the same Google Workspace ecosystem before rebuilding it later on a "real" stack. This is the real stack from day one.
- `Code.gs` and `index.html` (the Apps Script prototype) are superseded — kept only as a historical reference for required behavior, not the base for the new build.
- Everything previously listed as "Real App Requirements — TBD, post-MVP" (hosting, CI/CD, DB provisioning, secrets, domain/TLS, monitoring, backup) is now a **Sprint 1 blocker** on the new stack, not a later concern. Effort/timeline in `MVP_ROADMAP.md` were intentionally *not* recalculated yet — those hours assumed Apps Script and are considered stale until redone against the new stack.

**28 July 2026**:
- **NEW:** No login: read access open on the lastminute.com network, editing reserved to Diane and Nathan
- **NEW:** Removed Rollback — Version History is now read-only (a small fixed set of editors, no version conflicts to recover from)
- **NEW:** Doc → Sheet import is one-time (bootstrap only), not a continuous daily sync
- **NEW:** Added `EndDate` field so Archive groups correctly by closing year
- **NEW:** Roadmap phases reordered by market Tier (1 → 2 → 3) instead of mixed calendar phases
- **NEW:** Fixed the GitHub Pages CI failure (broken submodule references from `wu-station`/`wu-station-add-diane-card`)
- **NEW:** Merged `README_MVP_PLAN.md` into this file (see Next Steps and Repository Structure below)
- **NEW:** Fixed clone instructions that pointed to the wrong repo/folder name
- **NEW:** Language policy: everything in English except `conversations/`, which stays in Italian
- **NEW:** Editor list stays hardcoded to Diane and Nathan (no config allow-list needed) — access is by absence-cover, not concurrent use, so there's no need to distinguish who made a given change in the log
- **NEW:** Confirmed the `Requester` field is purely descriptive (labels where the OM engagement came from), no hidden logic
- **NEW:** Notification strategy toward Value Stream Owners is an open decision (see Next Steps) — internal Slack/Email notifications are unaffected
- **NEW:** Removed Delete entirely — streams are never deleted, only transitioned to Closed when obsolete or done
- **NEW:** `Init Code` is a Jira reference/link (like today's OM digest), not free text
- **NEW:** `Strategic Pillar` is now derived automatically from `Cluster` (fixed mapping in `config/clusters.json`) instead of being picked separately — the two fields overlapped and risked inconsistent combinations
- **NEW:** Import maps the Doc's existing "Effective date" field to `EndDate` for closed streams — no historical data gap
- **NEW:** `Output Type` is multi-select — a stream can have more than one
- **NEW:** The OM Streams Log Doc actually uses Google Docs tabs (grouped by Status, one tab per stream), not a flat document — the import needs the Docs API's tab-navigation, and Status is derived from the tab group
- **NEW:** `Description` stays a short manual summary; the Doc's rich Context/Need/Legal/DPO/Finance & Tax content stays in the Doc, linked via `Link to OM Log` (now pointing at the specific tab) rather than replicated in the app
- **NEW:** `Markets` supports `all` and `NA` in addition to specific country codes, and is **not a dashboard filter** — it's a card attribute only, shown when `all`/specific, hidden when `NA`
- **NEW:** Correction — the Doc's full Context/Need/Legal/DPO/Finance & Tax narrative lives **in the app** (new `DetailSections` field), not just linked out to the Doc. Cards "explode" to show it; the edit form offers a structured template for it

## Overview

The **OM Governance Dashboard** (OM Catalog App) transforms the internal catalog of OM Streams into a business-friendly interface that visualizes organizational work across three dimensions:

1. **WHAT we do** (Cluster) — Which type of OM activity
   - OM Compliance-Evolution (new markets, new entities)
   - OM Compliance-Continuity (regulatory compliance, review cycles)
   - OM Compliance-Efficiency (fiscal optimization, cost centralization)

2. **WHAT it enables** (Output Type) — Which business capability we unlock
   - Business Evolution, Market Expansion
   - Corporate Compliance, Business Continuity
   - Operational Efficiency, Cost Optimization

3. **HOW FAR we are** (Completeness) — Progress tracking (0-100%)

### The Problem

Operations Management work is often misunderstood by the business:
- Value Stream Owners don't know what OM does for them
- Legal/Tax/DPO decisions are siloed, not cross-functional
- There's no clear visibility into benefits delivered

### The Solution

A **3D catalog viewer** that answers: *"What is OM doing for my business, and why?"*

---

## Features (MVP)

### Core Functionality

✅ **Create Streams** — Add new OM activities with structured metadata  
✅ **Update Streams** — Edit + track changes (version history, read-only)  
✅ **Open Access** — No login required; read access is open on the lastminute.com network. Editing is reserved to a single Admin role (Diane and Nathan)  
✅ **Draft/Publish** — A stream can be built up before it's visible on the network; publishing is one-way  
✅ **Admin Kanban View** — Drag streams between statuses, reorder by real-world urgency within a column

### Visualization

✅ **Dashboard (3D View)** — Filter by Cluster × OutputType × Completeness  
✅ **Archive** — Historical view of completed activities per year  
✅ **Market Details Panel** — Legal/Tax/DPO context for each market  

### Operations

✅ **One-Time Import** — OM Log (Google Doc) → OM Catalog (Google Sheet), done once at launch to bootstrap real data. The Doc is not touched again afterward  
✅ **Notifications** — Slack/Email alerts on status changes & milestones  
✅ **Change Log** — Timestamped history of edits (single editor: Diane)  

---

## Quick Start

### Prerequisites

- Access to the lastminute.com network (no login/account needed to view)
- Google Drive access (Diane, for the one-time Doc/Sheet import)

### Installation

1. **Clone the repository**

   This project is mirrored on both GitHub (primary, where commits land first) and GitLab (the company's official location, kept in sync via an open merge request until it's merged). Clone from whichever you have access to — note the folder name differs:

   ```bash
   # GitHub
   git clone https://github.com/dianetalagrand/om-dashboard.git
   cd om-dashboard
   ```

   ```bash
   # GitLab
   git clone https://gitlab.lastminute.com/whyus-git/omg/om-governance-dashboard.git
   cd om-governance-dashboard
   ```

2. **Set up and run the app**

   Superseded by the 30 July 2026 stack pivot (Node/TypeScript + PostgreSQL, see Architecture below) — the `clasp`/Apps Script steps that used to live here no longer apply. New setup instructions are TBD until the Open Questions (hosting, DB provisioning, framework choice) are resolved with Nathan.

### First Run

TBD — depends on the new setup once the Open Questions below are resolved.

---

## Architecture

### Vision

The OM Governance Dashboard is being built as the **single management center for Operations Management** — the one place where OM streams are created, tracked, and reported on. The goal is to **eliminate the other OM documents**, not run alongside them: today OM work lives scattered across the OM Streams Log (Google Doc) and siloed legal/tax/DPO trackers; once the app is live, it replaces them as the way OM work is managed.

### Two Domains

The app is analyzed and built as **two separate domains**, not one shared screen (decision from Nathan, 30 July 2026 — see `conversations/2026-07-30-domain-split-and-stack-pivot.md`):

- **Gestione OM (Management)** — write/workflow domain: Diane and Nathan create/update streams, notifications, version history.
- **Visualizzazione OM (Visualization)** — read/discovery domain: anyone on the lastminute.com network browses/filters/explodes the catalog and consults the archive.

See `docs/PRODUCT_SPEC.md` for the functional split and `docs/ARCHITECTURE.md` for how each maps to routes/data.

### Tech Stack

- **Backend**: TypeScript / Node.js — the real stack from the start, not a bootstrap step
- **Database**: PostgreSQL — the system of record from day one
- **Frontend**: TBD (framework not yet chosen)
- **Data source (bootstrap only)**: OM Streams Log (Google Doc) is imported **once** to seed Postgres; after that it's never read or updated again — all OM management moves into the app

**Superseded**: Google Apps Script + Google Sheet was rejected as the MVP foundation — the goal is to *replace* the Docs/Sheet, not stage the app inside the same Google Workspace ecosystem before rebuilding it later on a "real" stack. `Code.gs` and `index.html` (the Apps Script prototype) are kept only as a historical reference for required behavior, not the base for this build.

### Open Questions (blocking Sprint 1)

Since the MVP is now the real app, these are no longer "later" concerns:

- Frontend framework
- Hosting/cloud environment, and who provisions it
- Who provisions and owns the Postgres instance
- CI/CD pipeline ownership
- Environment & secrets management (DB credentials, API keys) — not hardcoded in the repo
- Network-level access restriction (reachable only from the lastminute.com network) — no user login; editing stays reserved to Diane and Nathan through a separate, simpler access path
- Custom domain + TLS certificate
- Monitoring, logging, and alerting
- Backup & rollback strategy (previous build/image, DB migration rollback)

### Data Model

**Postgres table: `om_catalog`**

```
| ID | Name | Init | Status | Cluster | OutputType | 
| Markets | Completeness | DataControllers | MarketAssets | ... |
```

See `docs/ARCHITECTURE.md` for the full schema.

---

## Documentation

- **[PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)** — Functional requirements (Manage Streams, UI/Interaction)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Data schema, API design, security
- **[UI_WIREFRAMES.md](docs/UI_WIREFRAMES.md)** — Layout, interaction flows, design system
- **[MVP_ROADMAP.md](docs/MVP_ROADMAP.md)** — Timeline (4 weeks), sprint planning
- **[conversations/](conversations/)** — Log of planning decisions and why they were made

---

## Repository Structure

```
om-dashboard/
├── README.md (this file — overview, architecture, dev, deployment)
│
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── UI_WIREFRAMES.md
│   └── MVP_ROADMAP.md
│
├── conversations/ (decision log)
│
├── config/
│   ├── clusters.json (3 cluster OM-driven + output type mapping)
│   └── markets.json (Tier 1/2/3 classification)
│
├── Code.gs (superseded — Apps Script prototype, kept as historical reference only)
└── index.html (superseded — Apps Script prototype, kept as historical reference only)
```

---

## Configuration

### Cluster Definitions

See `config/clusters.json`:
- **OM Compliance-Evolution** — Expansion initiatives (with INIT codes)
- **OM Compliance-Continuity** — Regulatory compliance & stability
- **OM Compliance-Efficiency** — Cross-functional optimization

### Market Classification

See `config/markets.json`:
- **Tier 1** (Primary): UK, FR, DE, IT, ES
- **Tier 2** (Secondary): CH, SE, AT, NL, DK, BE, IE, NO, PT, HU, FI, PL, CZ, SK
- **Tier 3** (Residual): US, etc.

---

## Development

> Superseded by the 30 July 2026 stack pivot: the app is now built on TypeScript/Node.js + PostgreSQL from the start, not Apps Script (see [Architecture](#architecture) and [Open Questions](#open-questions-blocking-sprint-1)). The `clasp`/Apps Script instructions that used to live here no longer apply. Local dev setup is TBD until the Open Questions (hosting, DB provisioning, framework choice) are resolved with Nathan.

### Workflow

Currently in **setup phase** (see `PROJECT.md`): `main` is not yet protected, so work happens directly on `main`. Once `main` becomes protected, this switches to one-branch-per-task + merge request (recorded in `PROJECT.md` when that happens).

---

## Deployment

Superseded by the 30 July 2026 stack pivot — there's no more "MVP via Apps Script" vs. "real app later" split; this is the one deployment target, and it's blocked on the Open Questions above. Once those are resolved, deployment needs:

1. Hosting/runtime environment provisioned (container or app-service on the target cloud)
2. Postgres database provisioned and migrated, seeded once from the OM Log Doc
3. CI/CD pipeline building, testing, and deploying automatically on merge to `main`
4. Environment variables/secrets configured in the hosting platform (never in code)
5. Custom domain + TLS certificate pointed at the deployment
6. Monitoring/alerting wired up before go-live
7. A rollback plan: previous build/image kept ready, plus DB migration rollback scripts

Announce go-live via Slack (#om-governance-updates) + Email to OM Team + Value Stream Owners.

---

## Next Steps

1. **Nathan Vené approval** — cluster taxonomy and market scope (blocking Sprint 1)
2. **Notification strategy toward Value Stream Owners** — Diane and Nathan still need to decide if/how notifications extend beyond the internal OM team (not blocking Sprint 1/2)
3. **Resolve the Open Questions on the new stack** — hosting, Postgres provisioning, CI/CD ownership, frontend framework (blocking Sprint 1, see Architecture above)
4. **Re-scope Sprint 1 effort/timeline** — `MVP_ROADMAP.md` hours still assume Apps Script; not recalculated yet, deferred by Diane on 30 July 2026
5. **Start Sprint 1** — backend setup (see `docs/MVP_ROADMAP.md`), once 3 and 4 are resolved

---

## Roadmap

### Phase 1 (Aug 2026) — MVP Launch
- ✅ Create/update streams + version history
- ✅ Open access (no login), editing reserved to Diane and Nathan
- ✅ 3D dashboard view
- ✅ FR market details panel (Tier 1)
- ✅ Archive tab

Priority for everything after launch follows the **market Tier order** (Tier 1 → Tier 2 → Tier 3), not fixed calendar phases:

### Phase 2 — Remaining Tier 1 markets
- Market details for IT, ES, UK, DE (all Tier 1 markets not yet covered)
- Advanced analytics (trends, heatmaps)
- Export to CSV/PDF

### Phase 3 — Tier 2 markets
- Market details for Tier 2 markets (CH, SE, AT, NL, DK, BE, IE, NO, PT, HU, FI, PL, CZ, SK)
- Mobile responsive
- Multi-language (English)

---

## Support

### For Users

- **Documentation**: See `docs/` folder
- **Support Hours**: TBD (OM Team Slack channel)
- **Bug Reports**: Create an Issue in GitLab

### For Developers

- See `PROJECT.md` for project facts and workflow
- See `CLAUDE.md` for Claude Code integration

---

## License

Internal tool — Lastminute.com Group only.

---

## Contact

- **Product Owner**: Diane Mary Talagrand (@dtalagrand)
- **Project**: OM Governance Office
- **Slack**: #om-governance-updates

---

## FAQ

**Q: Why three dimensions?**  
A: Clusters show WHAT we do, Output Types show WHAT we ENABLE, Completeness shows HOW FAR we are. Together, they answer: "What is OM delivering for my business?"

**Q: Can I filter by multiple clusters?**  
A: Yes — use the Cluster dropdown to select one, or leave blank to see all.

**Q: Where is the historical data?**  
A: Switch to the Archive tab to see closed activities per year.

**Q: Can Value Stream Owners edit streams?**  
A: No — the app is read-only for everyone on the lastminute.com network. Only Diane and Nathan can create/edit, through a separate access path.

---

**Last Updated**: 2 August 2026  
**Version**: 0.1 MVP (In Development)  
**Status**: 🔄 In Review with OM Leadership