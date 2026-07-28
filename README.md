# 🛰️ OM Governance Dashboard

> A three-dimensional catalog viewer for Operations Management activities, enabling Value Stream Owners to understand what the OM office delivers and why.

## Recently Updated

This is the **single README** for the project (merged with the former `README_MVP_PLAN.md` on 28 July 2026, to stop the two from drifting out of sync). Each update logs what changed here — **NEW** marks content that's new or just revised; it gets cleared on the next update once it's no longer "new."

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
✅ **Open Access** — No login required; read access is open on the lastminute.com network. Editing is reserved to Diane and Nathan  

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

2. **Deploy to Google Apps Script**
   ```bash
   clasp login
   clasp push
   ```

3. **Open the web app**
   - Navigate to the deployment URL (from `clasp list`) — no login needed to view

### First Run

1. Create a test stream to verify the form
2. Check that data syncs to the OM Catalog Google Sheet
3. Test the 3D filters on the dashboard

---

## Architecture

### Vision

The OM Governance Dashboard is being built as the **single management center for Operations Management** — the one place where OM streams are created, tracked, and reported on. The goal is to **eliminate the other OM documents**, not run alongside them: today OM work lives scattered across the OM Streams Log (Google Doc) and siloed legal/tax/DPO trackers; once the app is live, it replaces them as the way OM work is managed.

### Tech Stack (MVP)

- **Backend**: Google Apps Script — used to bootstrap the MVP with real data
- **Frontend**: HTML/Vanilla JS (no framework — MVP lean)
- **Data**: Google Sheet ("OM Catalog") + Google Doc ("OM Streams Log") act as the **database** for the MVP. Once the real app is deployed, these documents are no longer used or managed directly — all OM management moves into the app.

### Real App Requirements (post-MVP)

Since the target is a real, standalone management app — not a Google Workspace script — Apps Script won't be needed once the real app exists. Deploying a real app requires:

- A backend framework/runtime (TBD)
- A real database (TBD) replacing the OM Log Doc / OM Catalog Sheet as the system of record
- A hosting/cloud environment (e.g., the company's existing Azure/AWS/GCP setup — TBD)
- A CI/CD pipeline (build → test → deploy on merge to main)
- Environment & secrets management (DB credentials, API keys) — not hardcoded in the repo
- Network-level access restriction (reachable only from the lastminute.com network) — no user login; editing stays reserved to Diane and Nathan through a separate, simpler access path (not exposed in the public UI)
- A custom domain + TLS certificate
- Monitoring, logging, and alerting (uptime, errors)
- A backup & rollback strategy (previous build/image, DB migration rollback)

### Key Components (MVP)

| Component | Purpose | File |
|-----------|---------|------|
| **doGet()** | Serve frontend, read catalog | `Code.gs` |
| **doPost()** | Create/update streams | `Code.gs` |
| **importDocToSheet()** | One-time import: OM Log → Sheet | `Code.gs` |
| **Dashboard UI** | 3D filter & view | `index.html` |
| **Market Panel** | Legal/Tax context | `index.html` |

### Data Model

**Google Sheet: OM Catalog**

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
- **[OKR_REFERENCE.md](docs/OKR_REFERENCE.md)** — Company OKR reference material for the stream-to-OKR bridge
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
│   ├── MVP_ROADMAP.md
│   └── OKR_REFERENCE.md
│
├── conversations/ (decision log)
│
├── config/
│   ├── clusters.json (3 cluster OM-driven + output type mapping)
│   └── markets.json (Tier 1/2/3 classification)
│
├── Code.gs (Apps Script backend — CREARE, AGGIORNARE, IMPORT)
└── index.html (Frontend — Dashboard, filters, market panel, archive)
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

> The clasp/Apps Script workflow below is for the MVP only — it validates the product with real OM data before the real app is built. The real app will use its own framework, its own database, and its own CI/CD instead of Apps Script and the OM Log Doc/OM Catalog Sheet (see [Real App Requirements](#real-app-requirements-post-mvp)).

### Prerequisites (MVP)

- Node.js 18+ (for local tooling)
- `clasp` CLI (`npm install -g @google/clasp`)

### Local Development (MVP)

```bash
# Deploy changes to Apps Script
npm run deploy

# Run tests
npm run test

# View logs
npm run logs
```

### Workflow

Currently in **setup phase** (see `PROJECT.md`): `main` is not yet protected, so work happens directly on `main`. Once `main` becomes protected, this switches to one-branch-per-task + merge request (recorded in `PROJECT.md` when that happens).

---

## Deployment

### MVP (Testing/Staging via Apps Script)

```bash
clasp deploy --description "Test deployment"
```

Test the staging app:
- Create a test stream
- Verify filters work
- Check market details panel loads

```bash
clasp deploy --description "v0.1 MVP Launch"
```

Announce to users:
- Slack: #om-governance-updates
- Email: OM Team + Value Stream Owners

**Rollback (MVP)**:
```bash
clasp deployments
clasp undeploy <DEPLOYMENT_ID>
```

### Real App Deployment (post-MVP)

Once the real app is built on the target framework, deploying it requires:

1. Hosting/runtime environment provisioned (container or app-service on the target cloud)
2. Real database provisioned and migrated (replacing the OM Log Doc / OM Catalog Sheet)
3. CI/CD pipeline building, testing, and deploying automatically on merge to `main`
4. Environment variables/secrets configured in the hosting platform (never in code)
5. Custom domain + TLS certificate pointed at the deployment
6. Monitoring/alerting wired up before go-live
7. A rollback plan: previous build/image kept ready, plus DB migration rollback scripts

Announce go-live the same way as the MVP (Slack + Email to OM Team + Value Stream Owners).

---

## Next Steps

1. **Nathan Vené approval** — cluster taxonomy and market scope (blocking Sprint 1)
2. **OKR granularity decision** — Objective-level (4 options) vs. Key Result-level (16 options); asked, awaiting answer
3. **Reorganize the Google Sheet** — once approved, split it functionally (Manage Streams) × visually (Dashboard/Archive/Market Panel)
4. **Start Sprint 1** — backend setup (see `docs/MVP_ROADMAP.md`)

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

**Last Updated**: 28 July 2026  
**Version**: 0.1 MVP (In Development)  
**Status**: 🔄 In Review with OM Leadership