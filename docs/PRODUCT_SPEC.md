# OM Catalog — Product Specification

## Overview

**Purpose**: Build an app usable by the business (Value Streams Owner) that displays the catalog of OM activities three-dimensionally, showing **what the OM office does** and **what benefit it returns to the company** through cross-functional strategic decisions (legal, tax, DPO, finance).

**Users**:
- **Anyone on the lastminute.com network** (including reviewers like Sergio Stievano) → read-only access via Visualizzazione OM, no login required
- **Admin** — a single role, held by Diane (OM PM) and Nathan with fully symmetric permissions → the only ones who create/update streams, in Gestione OM

**Product UI language**: Italian (for the business) — this is about the deployed app's interface, not this document.

---

## Two Domains, Analyzed Separately

The app is not one shared screen with a data model behind it — it's **two distinct domains** with different users and goals, analyzed and built as verticals rather than as layers of one shared architecture (decision from Nathan, 30 July 2026 — see `conversations/2026-07-30-domain-split-and-stack-pivot.md`):

- **Domain A — Gestione OM (Management)**: the write/workflow side. A single **Admin** role (Diane and Nathan, symmetric permissions) creates and updates streams, tracks status/version history, triggers notifications. Goal: govern the OM project streams.
- **Domain B — Visualizzazione OM (Visualization)**: the read/discovery side. Anyone on the lastminute.com network browses, filters, and explodes the catalog, and consults the archive. Goal: help people understand and navigate what OM does.

Both sections below are kept functionally separate for this reason, even where they end up sharing the same underlying data store.

**Confirmed 2 August 2026** (see `conversations/2026-08-02-gestione-om-brainstorm.md`): Gestione OM is not a multi-role domain. Sergio Stievano — who reviews OM streams — and any `Requester` (Business/Corporate/OM Governance) never get write access; if a stream needs deeper input from them, Admin gathers it outside the app (Slack/meeting) and makes the update themselves. There is no in-app approval/review gate before a stream reaches `Closed`.

---

## 1. DOMAIN A — GESTIONE OM (Management) — Core Functionality

### 1.1 LEVEL 2A: CREATE STREAM

**Description**: Structured form to add a new OM activity to the catalog.

**Input (required + optional fields)**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **ID** | Auto-generated | ✅ | OMG-{incremental} |
| **Name** | Text | ✅ | E.g. "Invoicing in PT", "Opening Newco Romania" |
| **Init Code** | Reference | ❌ | Link to the corresponding Jira ticket (like today's OM digest), e.g. INIT-997, INIT-1004 (Evolution only) — not free text. **Confirmed 2 Aug 2026: no Jira API validation needed.** Diane runs the Init census/budget-request process for OM Inits herself, upstream of this app — by the time a code is entered here, its existence is already guaranteed. Format-only, no integration dependency |
| **Status** | Dropdown | ✅ | New, In Progress, Paused, Closed (default: New) |
| **Priority** | Dropdown | ✅ | Urgent, Normal |
| **Cluster** | Dropdown | ✅ | OM Compliance-Evolution, OM Compliance-Continuity, OM Compliance-Efficiency |
| **Output Type** | Multi-select | ✅ | Depends on Cluster (see mapping table) — a stream can have more than one |
| **Requester** | Dropdown | ✅ | Business, Corporate, OM Governance |
| **Markets** | Multi-select, or `all` / `NA` | ✅ | UK, FR, DE, IT, ES, (Tier 2) ... — or `all` (applies to every market) or `NA` (no market dimension). Not a filter, just an attribute shown on the card: displayed when `all`/specific markets, hidden when `NA` |
| **Completeness %** | Slider | ✅ | 0-100%, default 0%. Purely subjective, set by Admin's own judgment — confirmed 2 Aug 2026 not to need any computed anchor (e.g. tying it to how many `DetailSections` categories are filled). Not an MVP concern |
| **Description** | Long text | ❌ | Context, need, conclusion (max 500 chars) |
| **DetailSections → Need** | Long text | ✅ | The one `DetailSections` category required from the start — confirmed 2 Aug 2026 (see `conversations/2026-08-02-gestione-om-brainstorm.md`): Admin always knows the Need when a stream is first identified, even before Legal/Finance/DPO analysis exists |
| **DetailSections → Context, Legal, Finance & Tax, DPO, Conclusion, ancillary** | Long text | ❌ | Same structured template as Need, but genuinely optional at CREATE — a stream is routinely censito with only a subset of these filled in; the rest are added later via UPDATE as the analysis comes in |
| **Go-live Date** | Date | ❌ | Added 2 Aug 2026. Records when an associated deployment (if any) goes into production — distinct from `EndDate`/Effective Date, which marks when the *stream itself* closes. A stream can go live before it's fully closed |

**Note on Strategic Pillar**: not a separate field to fill in — it's derived automatically from `Cluster` via a fixed mapping (see `config/clusters.json`): Efficiency → Cost Optimisation, Continuity → OM Governance & Compliance, Evolution → Expansion & Growth. This was a deliberate fix: the two fields overlapped, and letting people pick both independently risked inconsistent combinations over time.

**Validation**:
- `Name` required
- At least 1 market selected
- `Cluster` + `Output Type` required
- If `Cluster = Evolution` → `Init Code` recommended (but not required)
- `DetailSections → Need` required — the only mandatory narrative category; every other category (Context, Legal, Finance & Tax, DPO, Conclusion, ancillary) is optional at CREATE and filled in over time via UPDATE

**Storage**:
- Saved to the `om_catalog` Postgres table
- Log: created_by, created_at, updated_by, updated_at
- The "OM Streams Log" Google Doc is NOT touched again after the initial import — it only served to seed the database once, at project start

**Workflow**:
1. Click "[+ NEW STREAM]"
2. Fill in the form
3. Click "[SAVE]"
4. Client-side validation
5. `POST /streams`
6. Database updated
7. Confirmation: "Stream OMG-X created ✅"

---

### 1.2 LEVEL 2B: UPDATE STREAM

**Description**: Edit fields of an existing stream with change tracking.

**Functionality**:
- **Select & Edit**: Click a stream card → side panel with edit form
- **Structured detail template**: the form includes fields for the common categories (Context, Need, Legal, DPO, Finance & Tax) plus the ability to add extra ancillary category rows — this is `DetailSections`, see `ARCHITECTURE.md`
- **Partial completeness is the norm** (confirmed 2 Aug 2026): a stream almost never has every `DetailSections` category filled in at once — only `Need` is guaranteed from the start. The card's "exploded" view (§2.1) only renders categories that actually have content; a category with no content yet is simply absent, never shown as an empty placeholder
- **Mutable fields**: All except `ID` (immutable)
- **Status changes via two equivalent paths**: editing the `Status` field on this form, or dragging the card between columns on the Admin Kanban view (§1.5) — both hit the same `PATCH /streams/{id}`, produce the same version history entry and notifications
- **Version history**: Shows who changed what and when (read-only — no "restore to previous version": a small fixed set of editors, no version conflicts to manage)
- **Notifications**: Alert the team if:
  - Status changes (New → In Progress, In Progress → Closed)
  - Completeness changes by >20% (e.g. 30% → 55%)
  - **Structural shape confirmed 2 Aug 2026, detail deliberately deferred**: two audiences, not one — (1) Admin-facing notifications (2 types, still TBD which) and (2) Slack notifications for everyone else (the wider team/company, beyond Admin). Keep this two-audience split in mind whenever notifications get designed further; which exact events map to which audience is not decided yet
  - Also under consideration, not decided: date-triggered automatic reminders — e.g. a Slack message fired automatically as `Go-live Date` approaches, independent of any manual status/completeness edit

**Validation**: Same as CREATE

**Workflow**:
1. Stream card shows "[EDIT] [HISTORY] [...]"
2. Click "[EDIT]"
3. Side panel form (pre-filled)
4. Edit fields
5. Click "[SAVE CHANGES]"
6. Validation
7. `PATCH /streams/{id}`
8. Log entry created: "Diane changed Status: In Progress → Closed (26 Jul 2026)"
9. Alerts sent to the team (if configured)

---

### 1.3 LEVEL 2C: ACCESS

**Description**: No login. There's no sensitive data in the app, and the priority is staying easy to access without overcomplicating things.

**Model**:
- **Read**: open to anyone on the lastminute.com network — no account, no password. Diane's expectation (2 Aug 2026, based on other internal apps she's seen work this way): network-level restriction alone should be enough, no VPN/proxy needed on top — still to be confirmed by Nathan (see below)
- **Write (create/update)**: reserved to Admin (Diane and Nathan, symmetric — same recognition for both, no per-user accounts). There are no other roles (no OM Admin/PM/Contributor/Viewer): editing is always just Admin

**Admin Access Gate** (revised 2 Aug 2026, see `conversations/2026-08-02-gestione-om-brainstorm.md`): **one single app URL for everyone** — not a separate admin URL to remember or re-share. A one-time recognition step marks Admin's own device/browser as recognized (stored client-side, e.g. a cookie); after that, the *same* public URL shows the editing UI automatically to that recognized device, with no login prompt and nothing to type again.
- The recognition marker travels with every write request and is checked **server-side** on `POST`/`PATCH /streams*` — the UI hiding edit buttons is not itself the security boundary
- Revocable: if a device's recognition leaks/needs resetting, it can be invalidated without touching anyone else's access
- **Recommended mechanism (Claude's recommendation, Diane to confirm with Nathan)**: Google Sign-In restricted to Diane's and Nathan's two `@lastminute.com` addresses, rather than a bespoke token/cookie scheme built from scratch. Both already authenticate to Google in their normal browser session (confirmed while reading the OM Streams Log Doc), so this needs no new credential to distribute, persists naturally across devices via the existing Google session, and revoking access is just removing an email from the allow-list
- **Kept in mind, not committed** (2 Aug 2026): an admin-only "[PREVIEW]" button that lets Admin see exactly what a non-admin visitor sees, without losing their own recognized/admin state — useful for checking what's actually public, may or may not make the cut
- **Still open, blocked on Nathan** (see `conversations/2026-07-30-domande-per-nathan-stack-infra.md` §6b): whether the lastminute.com-only network restriction needs a VPN/proxy on the new stack (Diane's expectation is no), and whether Google Sign-In is an acceptable recognition mechanism given the company's infra. What's decided here is the *model* (one URL, device recognition, no separate admin link) and a recommended default — not a final answer on the infra underneath it

**Change log**:
- Every change records a timestamp + what changed (`Updated At` field / version history)
- No multi-user audit trail needed: with only Diane and Nathan editing, the log tracks history rather than needing to distinguish between a larger team

**Workflow**:
1. User opens the app from the lastminute network → sees the dashboard immediately, no login
2. Editing: only Diane and Nathan, through their separate access

---

### 1.4 LEVEL 2D: DRAFT / PUBLISH

**Description**: Lets Admin build up a new stream's data before it's visible to anyone on Visualizzazione OM.

**Model**:
- A new stream can be created and edited while unpublished — none of its fields are validated any stricter than a normal CREATE, it's just not shown outside Gestione OM yet
- `PublishedAt` (null = draft) is separate from `Status`: a draft stream still starts life at `Status = New`, `PublishedAt` only controls visibility, not workflow stage
- Publishing is **one-way** — once published, a stream can't be pulled back into draft (consistent with no delete/no version rollback elsewhere in the app)
- **The "[PUBLISH]" button lives on the stream's own CREATE/EDIT form/card itself** (confirmed 2 Aug 2026) — not a detached action Admin has to remember to come back for later. It's right there alongside "[SAVE]" every time the card is open, whether at creation or on any later edit
- **A stream created by mistake (wrong data) is fixed via normal EDIT** — deliberately no separate "discard draft" or "undo create" mechanism. Same principle as everywhere else in the app: correction happens through UPDATE, not through a parallel undo/delete structure
- **No special handling if a draft reaches `Closed` without ever being published** (confirmed 2 Aug 2026) — closing works exactly the same regardless of publish state; this is intentionally not over-engineered as a separate edge case. In practice Admin publishes before or as part of closing out real work; a stream that stays draft-and-closed is simply treated like any other closed stream

**Workflow**:
1. Admin creates a stream as usual — it's saved but stays invisible on Visualizzazione OM
2. Admin keeps editing it (fields, `DetailSections`) until it's ready
3. Click "[PUBLISH]" (on the same card) → `PublishedAt` is set → the stream now appears on Visualizzazione OM

---

### 1.5 LEVEL 2E: ADMIN KANBAN VIEW

**Description**: A Gestione OM–only working view of everything Admin still has to manage — separate from the public Cluster × OutputType dashboard.

**Layout**: Kanban board, columns = `Status` — **New**, **In Progress**, **Paused** only. `Closed` is not a column here: closing a stream stays an explicit action on the UPDATE form (§1.2), not a drag target, and once closed a stream leaves this view entirely (it shows up in the Archive on Visualizzazione OM instead).

**Interactions**:
- **Drag between columns** → changes `Status` (same effect as editing the Status field on the UPDATE form — logged to version history, notifications fire same as any status change)
- **Drag to reorder within a column** → manual ordering reflecting Admin's own read of real-world urgency (which events are pressing right now), not an automated heuristic on dates or a fixed Urgent/Normal split
- Draft (unpublished, §1.4) streams appear in this view too — Admin needs to see and act on them even though they're invisible elsewhere

**Deferred**: exactly how the manual drag order relates to the existing `Priority` field (Urgent/Normal) — whether they coexist, or the drag order replaces it — is a product-design detail to settle once the backend architecture (Sprint 1 Open Questions) is consolidated, not before.

---

## 2. DOMAIN B — VISUALIZZAZIONE OM (Visualization) — UI/UX

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
- One card per stream, collapsed by default with the essentials (Status badge, Completeness bar, Markets, Requester, Priority)
- **Explode on open**: clicking a card expands it to show the full `DetailSections` narrative (Context, Need, Legal, DPO, Finance & Tax, plus any ancillary categories)

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

**Nice-to-have, low priority** (2 Aug 2026): the single most-recently-closed stream (highest `EndDate`) gets a subtle visual accent (e.g. a light yellow highlight) so it reads as "just landed here" among older closed entries. Purely a display detail — derived by sorting on `EndDate`, no new data needed.

---

## 3. Data Schema

See `ARCHITECTURE.md`

---

## 4. Acceptance Criteria (MVP)

- ✅ CREATE stream form with validation
- ✅ Edit stream + version history (read-only, no restore)
- ✅ Open access on the lastminute network (no login); editing reserved to a single Admin role (Diane and Nathan)
- ✅ Draft/Publish: a stream can be created and edited before it's visible on Visualizzazione OM
- ✅ Admin Kanban view: drag streams between Status columns (New/In Progress/Paused), manual reorder within a column
- ✅ Dashboard filtered by Cluster × OutputType × Completeness
- ✅ Market details panel (FR only)
- ✅ Archive tab with closed items per year (via `EndDate`)
- ✅ Doc → Sheet import (one-time, at project start — not continuous)
- ✅ Notifications on status change + completeness >20%
- ✅ Change log (who/what/when — Diane and Nathan)

---

## 5. Out of Scope

- **Rollback/restore previous version** — removed from scope: a small fixed set of editors, no version conflicts to manage
- **Login/multiple roles** — removed: no accounts, open read access on the lastminute network, editing limited to a single Admin role (Diane and Nathan)
- **Continuous Doc → Sheet sync** — removed: the Doc is only for the one-time initial import
- **In-app review/approval gate** (e.g. for Sergio Stievano) — removed: Admin gathers any needed input outside the app and closes the stream themselves; no blocking review state
- **Taxonomy management UI** (Cluster→Pillar mapping, Output Type list, Market list) — stays a config file (`config/clusters.json`, `config/markets.json`), not an in-app editing screen
- **Aggregated/cross-stream version history view** — stays per-stream (§1.2), no catalog-wide change log screen
- Multi-language (Italian for now; English in the future)
- Advanced analytics (trends, forecasting)
- Tier 2/3 market details
- Mobile responsive (desktop first)
- Export to PDF/Excel
