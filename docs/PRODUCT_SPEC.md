# OM Catalog — Product Specification

## Overview

**Purpose**: Build an app usable by the business (Value Streams Owner) that displays the catalog of OM activities three-dimensionally, showing **what the OM office does** and **what benefit it returns to the company** through cross-functional strategic decisions (legal, tax, DPO, finance).

**Users**:
- **Anyone on the lastminute.com network** → read-only access, no login required
- **Diane (OM PM) and Nathan** → the only editors (create/update)

**Product UI language**: Italian (for the business) — this is about the deployed app's interface, not this document.

---

## 1. LEVEL 1: STREAM MANAGEMENT — Core Functionality

### 1.1 LEVEL 2A: CREATE STREAM

**Description**: Structured form to add a new OM activity to the catalog.

**Input (required + optional fields)**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **ID** | Auto-generated | ✅ | OMG-{incremental} |
| **Name** | Text | ✅ | E.g. "Invoicing in PT", "Opening Newco Romania" |
| **Init Code** | Reference | ❌ | Link to the corresponding Jira ticket (like the OKR bridge and today's OM digest), e.g. INIT-997, INIT-1004 (Evolution only) — not free text |
| **Status** | Dropdown | ✅ | New, In Progress, Paused, Closed (default: New) |
| **Priority** | Dropdown | ✅ | Urgent, Normal |
| **Cluster** | Dropdown | ✅ | OM Compliance-Evolution, OM Compliance-Continuity, OM Compliance-Efficiency |
| **Output Type** | Multi-select | ✅ | Depends on Cluster (see mapping table) — a stream can have more than one |
| **Requester** | Dropdown | ✅ | Business, Corporate, OM Governance |
| **Markets** | Multi-select, or `all` / `NA` | ✅ | UK, FR, DE, IT, ES, (Tier 2) ... — or `all` (applies to every market) or `NA` (no market dimension). Not a filter, just an attribute shown on the card: displayed when `all`/specific markets, hidden when `NA` |
| **Completeness %** | Slider | ✅ | 0-100%, default 0% |
| **Description** | Long text | ❌ | Context, need, conclusion (max 500 chars) |

**Note on Strategic Pillar**: not a separate field to fill in — it's derived automatically from `Cluster` via a fixed mapping (see `config/clusters.json`): Efficiency → Cost Optimisation, Continuity → OM Governance & Compliance, Evolution → Expansion & Growth. This was a deliberate fix: the two fields overlapped, and letting people pick both independently risked inconsistent combinations over time.

**Validation**:
- `Name` required
- At least 1 market selected
- `Cluster` + `Output Type` required
- If `Cluster = Evolution` → `Init Code` recommended (but not required)

**Storage**:
- Saved to the "OM Catalog" Google Sheet
- Log: created_by, created_at, updated_by, updated_at
- The "OM Streams Log" Google Doc is NOT touched again after the initial import — it only served to populate the Sheet once, at project start

**Workflow**:
1. Click "[+ NEW STREAM]"
2. Fill in the form
3. Click "[SAVE]"
4. Client-side validation
5. POST to the Apps Script endpoint
6. Sheet updated
7. Confirmation: "Stream OMG-X created ✅"

---

### 1.2 LEVEL 2B: UPDATE STREAM

**Description**: Edit fields of an existing stream with change tracking.

**Functionality**:
- **Select & Edit**: Click a stream card → side panel with edit form
- **Mutable fields**: All except `ID` (immutable)
- **Version history**: Shows who changed what and when (read-only — no "restore to previous version": a small fixed set of editors, no version conflicts to manage)
- **Notifications**: Alert the team if:
  - Status changes (New → In Progress, In Progress → Closed)
  - Completeness changes by >20% (e.g. 30% → 55%)

**Validation**: Same as CREATE

**Workflow**:
1. Stream card shows "[EDIT] [HISTORY] [...]"
2. Click "[EDIT]"
3. Side panel form (pre-filled)
4. Edit fields
5. Click "[SAVE CHANGES]"
6. Validation
7. PUT to the Apps Script endpoint
8. Log entry created: "Diane changed Status: In Progress → Closed (26 Jul 2026)"
9. Alerts sent to the team (if configured)

---

### 1.3 LEVEL 2C: ACCESS

**Description**: No login. There's no sensitive data in the app, and the priority is staying easy to access without overcomplicating things.

**Model**:
- **Read**: open to anyone on the lastminute.com network — no account, no password
- **Write (create/update)**: reserved to Diane and Nathan, through a separate access path simpler than a classic login (exact mechanism — e.g. a private URL/parameter — to be defined in Sprint 1). There are no other roles (no OM Admin/PM/Contributor/Viewer): editing is always just Diane and Nathan

**Change log**:
- Every change records a timestamp + what changed (`Updated At` field / version history)
- No multi-user audit trail needed: with only Diane and Nathan editing, the log tracks history rather than needing to distinguish between a larger team

**Workflow**:
1. User opens the app from the lastminute network → sees the dashboard immediately, no login
2. Editing: only Diane and Nathan, through their separate access

---

## 2. LEVEL 1: VISUALIZATION — UI/UX

### 2.1 Main Dashboard (ACTIVE Streams)

**Layout**: 3-column Kanban-style view

```
┌─────────────────────────────────────────────────────────────┐
│ FILTER BAR                                                   │
│ Cluster: [OM Compliance-Evolution ▼] OutputType: [...] ... │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TAB: ACTIVE (2026) | ARCHIVE (History)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ CLUSTER: OM Compliance-Evolution | OUTPUT: New Markets      │
│ Completeness: ████░░ 65%                                    │
│                                                               │
│ [Card 1] OMG-12 Invoicing in PT                             │
│ ├─ Status: In Progress | Init: INIT-997                     │
│ ├─ Markets: PT, ES, FR | Completeness: 75%                  │
│ ├─ Requester: Business | Priority: Urgent                   │
│ └─ [📋 Market Details ▼] [🔗 OM Log] [EDIT]                 │
│                                                               │
│ [Card 2] OMG-X Opening Newco Romania                        │
│ ├─ Status: In Progress | Init: INIT-1004                    │
│ ├─ Markets: RO (Tier 2) | Completeness: 40%                │
│ ├─ Requester: Corporate | Priority: Urgent                  │
│ └─ [📋 Market Details ▼] [🔗 OM Log] [EDIT]                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Filters**:
- Cluster: dropdown (all, or one)
- Output Type: multi-select
- Status: checkboxes (New, In Progress, Paused, Closed)
- Completeness range: slider (0-100%)
- Search: text input (stream name)

**Shows**:
- One card per stream
- Status badge (color-coded)
- Completeness bar
- Key info: Markets, Requester, Priority

---

### 2.2 Market Details Panel (Expandable)

**Trigger**: Click "[📋 Market Details]" on a card

**Contains** (for the selected market):

```
┌──────────────────────────────────────┐
│ MARKET DETAILS: FR                   │
├──────────────────────────────────────┤
│                                      │
│ 📊 DISTRIBUTION CHAIN                │
│    [diagram/screenshot from PPT]     │
│                                      │
│ 👤 DATA CONTROLLER                   │
│    Name: BravoNext S.A.              │
│    Role: EU Collecting Entity Lead   │
│                                      │
│ 📋 CONSENT & PROCESSING              │
│    [GDPR compliance matrix]          │
│                                      │
│ 💼 MARKET ARCHITECTURE               │
│    Legal entities: BravoNext S.A...  │
│    VAT regime: EU-standard           │
│    Assets: Technology, IP, ...       │
│                                      │
│ 📄 LINKS                             │
│    • OM Log entry [link]             │
│    • Jira ticket [link]              │
│                                      │
└──────────────────────────────────────┘
```

**Note**: MVP = FR only. Other Tier 1 markets (NL, IT, ES, UK, DE) added per the roadmap.

---

### 2.3 Archive Tab (History View)

**Trigger**: Click the "ARCHIVE (History)" tab

**Shows**: Closed streams (Status=Closed), grouped by year based on the `EndDate` field (set when Status becomes Closed — not `UpdatedAt`, which changes on any edit)

```
┌──────────────────────────────────────────┐
│ TAB: ACTIVE (2026) | ARCHIVE (History)   │
├──────────────────────────────────────────┤
│                                          │
│ 2026 CLOSED STREAMS                      │
│ ─────────────────────────────────────    │
│ OM Compliance-Evolution: 2 completed     │
│ OM Compliance-Continuity: 1 completed    │
│ OM Compliance-Efficiency: 0 completed    │
│                                          │
│ [OMG-7] Acquiring Service Evolution     │
│   Status: Closed | Completed: 26 Jun    │
│   Markets: NL, IT, ES                   │
│   [VIEW DETAILS]                        │
│                                          │
│ 2025 CLOSED STREAMS                      │
│ ─────────────────────────────────────    │
│ [... older streams ...]                 │
│                                          │
└──────────────────────────────────────────┘
```

**Metric**: For each year, count completed streams per cluster + output type

---

## 3. Data Schema

See `ARCHITECTURE.md`

---

## 4. Acceptance Criteria (MVP)

- ✅ CREATE stream form with validation
- ✅ Edit stream + version history (read-only, no restore)
- ✅ Open access on the lastminute network (no login); editing reserved to Diane and Nathan
- ✅ Dashboard filtered by Cluster × OutputType × Completeness
- ✅ Market details panel (FR only)
- ✅ Archive tab with closed items per year (via `EndDate`)
- ✅ Doc → Sheet import (one-time, at project start — not continuous)
- ✅ Notifications on status change + completeness >20%
- ✅ Change log (who/what/when — Diane and Nathan)

---

## 5. Out of Scope

- **Rollback/restore previous version** — removed from scope: a small fixed set of editors, no version conflicts to manage
- **Login/multiple roles** — removed: no accounts, open read access on the lastminute network, editing limited to Diane and Nathan
- **Continuous Doc → Sheet sync** — removed: the Doc is only for the one-time initial import
- Multi-language (Italian for now; English in the future)
- Advanced analytics (trends, forecasting)
- Tier 2/3 market details
- Mobile responsive (desktop first)
- Export to PDF/Excel
