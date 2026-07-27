# 🛰️ OM Governance Dashboard

> A three-dimensional catalog viewer for Operations Management activities, enabling Value Stream Owners to understand what the OM office delivers and why.

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
✅ **Update Streams** — Edit, track changes, rollback to previous versions  
✅ **Authenticate** — Google OAuth + Email login, role-based access control  

### Visualization

✅ **Dashboard (3D View)** — Filter by Cluster × OutputType × Completeness  
✅ **Archive** — Historical view of completed activities per year  
✅ **Market Details Panel** — Legal/Tax/DPO context for each market  

### Operations

✅ **Continuous Sync** — OM Log (Google Doc) → OM Catalog (Google Sheet)  
✅ **Notifications** — Slack/Email alerts on status changes & milestones  
✅ **Audit Trail** — Complete change log with user attribution  

---

## Quick Start

### Prerequisites

- Google Account (lastminute.com domain)
- Access to OM Governance Team
- Google Drive (for sync source)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://gitlab.lastminute.com/whyus-git/omg/om-governance-dashboard.git
   cd om-governance-dashboard
   ```

2. **Deploy to Google Apps Script**
   ```bash
   clasp login
   clasp push
   ```

3. **Open the web app**
   - Navigate to the deployment URL (from `clasp list`)
   - Sign in with your lastminute.com Google account

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
- Environment & secrets management (DB credentials, OAuth client secrets, API keys) — not hardcoded in the repo
- Authentication/SSO integration (Google Workspace SSO for the lastminute.com domain)
- A custom domain + TLS certificate
- Monitoring, logging, and alerting (uptime, errors)
- A backup & rollback strategy (previous build/image, DB migration rollback)

### Key Components (MVP)

| Component | Purpose | File |
|-----------|---------|------|
| **doGet()** | Serve frontend, read catalog | `Code.gs` |
| **doPost()** | Create/update streams | `Code.gs` |
| **syncDocToSheet()** | Sync OM Log → Sheet | `Code.gs` |
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
- **[README_MVP_PLAN.md](README_MVP_PLAN.md)** — Formalized scope & success criteria

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

### Branching Model

- `main` — Production-ready code
- `develop` — Integration branch
- `feature/*` — Feature branches
- `bugfix/*` — Bug fix branches

See `CONTRIBUTING.md` for full guidelines.

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

## Roadmap

### Phase 1 (Aug 2026) — MVP Launch
- ✅ CRUD streams (Create, Read, Update, Delete)
- ✅ Auth & roles
- ✅ 3D dashboard view
- ✅ FR market details panel
- ✅ Archive tab

### Phase 2 (Sep-Oct 2026)
- Market details for NL, IT, ES
- Advanced analytics (trends, heatmaps)
- Export to CSV/PDF

### Phase 3 (Nov-Dec 2026)
- All Tier 1 market details (UK, DE)
- Mobile responsive
- Multi-language (English)
- Real-time sync (not daily)

---

## Support

### For Users

- **Documentation**: See `docs/` folder
- **Support Hours**: TBD (OM Team Slack channel)
- **Bug Reports**: Create an Issue in GitLab

### For Developers

- See `CONTRIBUTING.md` for contribution guidelines
- See `PROJECT.md` for architecture decisions
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
A: No — they have read-only access (Viewer role). Only OM team can create/edit.

---

**Last Updated**: 27 July 2026  
**Version**: 0.1 MVP (In Development)  
**Status**: 🔄 In Review with OM Leadership