# OM Catalog — Architecture

## Overview

**Vision**: this app is the **single management center for Operations Management**, replacing the OM Streams Log Doc and the other siloed OM tracking documents — not running alongside them. OM work should be created, updated, and reported on only in the app once it's live.

**Two domains, analyzed and built separately** (decision from Nathan, 30 July 2026 — see `conversations/2026-07-30-domain-split-and-stack-pivot.md`): this document describes a shared data store and API because both domains currently sit on the same Postgres schema for the MVP, but the two are distinct verticals, not one screen:

- **Gestione OM (Management)** — write/workflow domain: Diane and Nathan create/update streams, notifications, version history. See `PRODUCT_SPEC.md` §1.
- **Visualizzazione OM (Visualization)** — read/discovery domain: anyone on the lastminute.com network browses/filters/explodes the catalog. See `PRODUCT_SPEC.md` §2.

**Backend**: TypeScript / Node.js — this is the real stack from the start, not a bootstrap step. Apps Script was rejected as the MVP foundation precisely because the goal is to replace the Google Docs/Sheet, not stage the app inside the same Google Workspace ecosystem before rebuilding it later.
**Database**: PostgreSQL — the system of record from day one. No separate "MVP database" vs "real database": this is it.
**Frontend**: TBD (framework choice not yet made — see Open Questions below).
**Data Source (bootstrap only)**: OM Streams Log (Google Doc) → OM Catalog (Postgres) — the Doc is imported **once** to seed the database; after that, the Doc is never read or updated again. All ongoing operations happen in the app.
**Access**: No login. Read access is open to anyone on the lastminute.com network; create/update is reserved to Diane and Nathan via a separate, simpler access path (not exposed in the public UI).

**Superseded**: `Code.gs` and `index.html` (the Apps Script prototype) are not the base for this build — they're kept only as a historical reference for what the app needs to do. See "Open Questions" for what's still unresolved before Sprint 1 can start on the new stack.

---

## Data Model

### Postgres table: `om_catalog`

The column list below carries over unchanged from the original Sheet-based design — only the storage engine changed. `JSON` / `JSON Array` columns map to native Postgres `JSONB`; everything else maps to a plain typed column (`TEXT`, `NUMERIC`, `TIMESTAMPTZ`).

**Columns**:

| # | Name | Type | Example | Notes |
|---|------|------|---------|------|
| A | ID | String | OMG-7 | Immutable, unique |
| B | Name | String | Acquiring Service Evolution | |
| C | Init | String (Jira reference) | LEG-891067 | Optional (null if no INIT). A link to the corresponding Jira ticket, like today's OM digest — not free text. **Confirmed 2 Aug 2026: no Jira API call to validate this.** Diane's own upstream Init census/budget-request process guarantees the code already exists before it's ever entered here — store and display as a plain string/link, no Jira integration or credentials needed |
| D | Status | String | Closed | Enum: New, In Progress, Paused, Closed |
| E | Priority | String | Urgent | Enum: Urgent, Normal |
| F | Strategic Pillar | String | Governance & Compliance | **Derived** from Cluster (fixed mapping in `config/clusters.json`), not entered independently — the two fields overlapped, so only Cluster is picked manually |
| G | Cluster | String | OM Compliance-Evolution | Enum: OM-CE, OM-CC, OM-CE-EFF |
| H | Output Type | String (CSV) | Business Evolution,Market Expansion | Multi-select, comma-separated — a stream can have more than one Output Type. Enum: see clusters.json |
| I | Requester | String | Business | Enum: Business, Corporate, OM Governance |
| J | Markets | String (CSV, or `all`/`NA`) | FR,NL,IT,ES | Comma-separated market codes, or `all` (every market) or `NA` (no market dimension). Not a filter — a card attribute, shown when `all`/specific markets, hidden when `NA` |
| K | Completeness % | Number | 100 | 0-100. Purely manual/subjective — confirmed 2 Aug 2026 not to need any computed anchor (e.g. derived from how many `DetailSections` categories are filled). Not an MVP concern, no backend logic beyond storing the number |
| L | Description | String | Designate entity as EU... | Short one-line blurb for the collapsed card. No hard character limit, but kept short by convention — the full narrative lives in `DetailSections` |
| M | DataControllers | JSONB | {FR: "BravoNext S.A."} | JSON: {market: controller_name} |
| N | MarketAssets | JSONB | {FR: {dist_chain_url, ...}} | JSON: {market: {asset_type: url}} |
| O | Link to OM Log | String | https://docs.google.com/... | Link to the stream's specific tab in the OM Streams Log Doc (secondary reference back to source) |
| P | Created By | String | diane.talagrand@... | Creator email |
| Q | Created At | Datetime | 2026-07-22T10:24:00 | ISO 8601 |
| R | Updated By | String | diane.talagrand@... | Last editor email |
| S | Updated At | Datetime | 2026-07-27T15:30:00 | ISO 8601 |
| T | Version History | JSONB Array | [{user, action, timestamp},...] | Change log (read-only, no restore) |
| U | End Date | Datetime | 2026-06-26T00:00:00 | Set **only** when Status becomes Closed. Used by Archive to group by year (don't use `UpdatedAt`, which changes on any edit) |
| V | DetailSections | JSONB Array | [{category: "Context", description: "..."}, ...] | Full narrative, copied verbatim from the Doc's Category/Description table. No fixed set of categories (Context, Need, Legal, DPO, Finance & Tax are common; ancillary ones vary per stream) and no length limit. Shown when a stream's card is expanded ("exploded") on the frontend; edited via a structured template (common categories + add-ancillary) on the CREATE/UPDATE form. **Confirmed 2 Aug 2026, verified against the live OM Streams Log Doc**: `Need` is the only category required to have content at CREATE — every other category (Context, Legal, Finance & Tax, DPO, Conclusion, ancillary) is legitimately empty at first and filled in later via UPDATE. The array only ever holds entries for categories that have content — there's no placeholder entry for an empty category |
| W | Published At | Datetime (nullable) | 2026-08-02T09:00:00 | Added 2 Aug 2026 (see `conversations/2026-08-02-gestione-om-brainstorm.md`). Null = draft — the stream exists in Gestione OM but is filtered out of every Visualizzazione OM query. Set once, on publish; never cleared again (no un-publish, consistent with no delete / no version rollback) |
| X | Go-live Date | Datetime (nullable) | 2027-01-31T00:00:00 | Added 2 Aug 2026. Optional — records when an associated deployment (if any) goes into production. Distinct from `EndDate` (column U): a stream can go live before the stream itself is fully `Closed` |

**JSON schema (columns M, N, T, V)**:

```json
{
  "DataControllers": {
    "FR": "BravoNext S.A.",
    "NL": "LMNext NV",
    "IT": "LMNext S.r.l."
  },
  "MarketAssets": {
    "FR": {
      "distributionChain": "https://drive.google.com/...",
      "consentProcessing": "https://docs.google.com/...",
      "dataOwnership": "https://docs.google.com/...",
      "marketArchitecture": "https://docs.google.com/..."
    }
  },
  "DetailSections": [
    {
      "category": "Context",
      "description": "The cross-analysis aims to identify all the legal and DPO constraints for the decommissioning of the Cruises business..."
    },
    {
      "category": "Need",
      "description": "- To establish clear rules and guidelines for the management and deletion/retention of data...\n- To define a guideline for similar scenarios..."
    },
    {
      "category": "Legal",
      "description": "From a contractual standpoint, the team is analysing whether it is possible to early terminate customer contracts with 2027 departures..."
    },
    {
      "category": "DPO",
      "description": "Data minimisation priority: each department head must risk-assess their data blocks to justify retention under GDPR..."
    },
    {
      "category": "Finance & Tax",
      "description": "All accounting documents already in Business Central — 10-year retention requirement met, no action needed."
    },
    {
      "category": "IT & Platform",
      "description": "CRM (VTE) & Supplier Management — Output: the supplier will officially dismiss the entire Cruise architecture..."
    },
    {
      "category": "Conclusion",
      "description": "The Cruise Tools decommissioning project has finalised its strategy to mitigate security risks and achieve compliance..."
    }
  ],
  "VersionHistory": [
    {
      "action": "CREATE",
      "user": "diane.talagrand@lastminute.com",
      "timestamp": "2026-07-22T10:24:00",
      "changes": null
    },
    {
      "action": "UPDATE",
      "user": "diane.talagrand@lastminute.com",
      "timestamp": "2026-07-27T15:30:00",
      "changes": {
        "Status": "New → In Progress",
        "Completeness %": "30 → 75"
      }
    }
  ]
}
```

---

## API Endpoints (Node/REST)

Framework not yet chosen (see Open Questions), but the two routes below belong to different domains and should stay separable even if they end up in the same service for the MVP: `GET /streams` is **Visualizzazione OM** (read/discovery), `POST`/`PATCH /streams` is **Gestione OM** (write/workflow). Request/response shapes carry over from the original Apps Script design — only the transport changed (plain REST instead of `doGet`/`doPost` + JSONP).

### `GET /streams` — Read catalog (filter + search) — Visualizzazione OM

Always implicitly filtered to `WHERE PublishedAt IS NOT NULL` — draft streams (column W) never appear in this route's results, regardless of the other filters passed.

**Archive nice-to-have** (§2.3 in `PRODUCT_SPEC.md`, low priority): the most-recently-closed stream gets a visual highlight on the frontend. No backend support needed beyond `ORDER BY EndDate DESC` — the frontend just flags whichever row sorts first among `status=Closed` results.

**Request**:
```
GET /streams?
    cluster=OM-CE
  & outputType=Business Evolution,Market Expansion
  & status=New,In Progress
  & completeness_min=50
  & completeness_max=100
  & search=invoicing
```

**Response**:
```json
{
  "success": true,
  "count": 3,
  "streams": [
    {
      "id": "OMG-12",
      "name": "Invoicing in PT",
      "init": "INIT-997",
      "status": "In Progress",
      "priority": "Urgent",
      "cluster": "OM-CE",
      "outputTypes": ["Business Evolution", "Market Expansion"],
      "markets": ["PT", "ES", "FR"],
      "completeness": 75,
      "dataControllers": {"PT": "LMNext PT"},
      "updatedAt": "2026-07-27T15:30:00",
      "updatedBy": "diane.talagrand@lastminute.com"
    }
  ]
}
```

### `POST` / `PATCH /streams` — Create/Update stream — Gestione OM

Streams are never deleted — they transition through statuses (New, In Progress, Paused) and end at Closed if they become obsolete or are done. There's no DELETE action.

**Request (CREATE)**:
```json
POST /streams
{
  "action": "CREATE",
  "data": {
    "name": "New activity",
    "init": null,
    "status": "New",
    "cluster": "OM-CC",
    "outputTypes": ["Corporate Compliance"],
    "markets": ["FR", "IT"],
    "completeness": 0
  }
}
```

**Response**:
```json
{
  "success": true,
  "id": "OMG-999",
  "message": "Stream created successfully"
}
```

**Request (UPDATE)**:
```json
PATCH /streams/OMG-12
{
  "action": "UPDATE",
  "id": "OMG-12",
  "data": {
    "status": "Closed",
    "completeness": 100
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Stream updated",
  "versionLog": {
    "user": "diane@...",
    "timestamp": "2026-07-27T16:00:00",
    "changes": {
      "Status": "In Progress → Closed",
      "Completeness": "75 → 100"
    }
  },
  "notificationsSent": ["OMG Slack Channel", "Nathan Email"]
}
```

### `PATCH /streams/{id}/publish` — Publish a draft — Gestione OM

Added 2 Aug 2026 (see `conversations/2026-08-02-gestione-om-brainstorm.md`). Sets `PublishedAt` to now; no request body needed beyond the id. One-way — there's no corresponding un-publish route.

**Confirmed 2 Aug 2026**: `PATCH /streams/{id}` (Status → Closed) does not require `PublishedAt` to be set first — no server-side rule blocks or auto-triggers publish on close. A stream can legitimately go `Closed` while `PublishedAt` is still null; this is intentionally not special-cased. There is likewise no separate "discard draft"/"undo create" route — a mistakenly-created stream is corrected via this same `PATCH`, same as any other edit.

**Admin Kanban view** (§1.5 in `PRODUCT_SPEC.md`) is a frontend-only concept on top of these same routes: dragging a card between Status columns is just a `PATCH /streams/{id}` with a new `status`, same as editing the field on the form. Manual reorder-within-column doesn't have a backend field yet — deferred along with the Priority-vs-drag-order product question until the stack is consolidated.

---

## Import: Google Doc (OM Streams Log) → Postgres (one-time)

**Doc**: https://docs.google.com/document/d/1UmdVojpEnd4OQ1p8pFJ7lgJt5XzCWs8a4rLnelg66Us/edit?tab=t.z15lnqcv4msc#heading=h.jogd841g1suc

This is not a continuous sync: it runs **once**, at project start, to seed the database with the data already collected in the narrative Doc. After the import, the Doc is never read or updated again — every subsequent operation (create/update) happens directly in the app, against Postgres.

**Real Doc structure** (confirmed 2026-07-28 — not a flat document): the OM Streams Log is a Google Doc using native **tabs**, organized in groups by Status (e.g. PAUSED, DONE), with **one tab per stream** nested under its status group. This means:
- `Status` is derived from which tab-group a stream sits under — not from a "Status:" paragraph in the text
- Each stream is its own Doc tab, not a heading within one continuous document
- The import needs the **Google Docs API's tab-navigation capability** (tabs are a distinct part of the API), not plain paragraph/heading parsing

Each stream tab contains a Category/Description table. Common rows include Context, Need, Legal, DPO, Finance & Tax — plus variable "ancillary" categories added only when the specific stream needs them (e.g. "IT & Platform" for a decommissioning stream), and usually a closing "Conclusion". These sections can each run to several paragraphs — this is a rich narrative, not a short form.

**Decision (corrected 2026-07-28): this content lives in the app, not just in the Doc.** The full Category/Description table is copied — category by category, verbatim — into a new `DetailSections` column (JSON array of `{category, description}`, same pattern as `VersionHistory`: no fixed length, no fixed set of categories, since these vary per stream). This is a mechanical 1:1 extraction, not a summary, so it *can* be automated reliably during import. On the frontend, a stream's card shows the essentials collapsed (Status, Completeness, Markets, Requester, Priority) and **explodes** to show the full `DetailSections` content when opened. On the editing side (Diane/Nathan), the CREATE/UPDATE form offers a structured template with fields for the common categories (Context, Need, Legal, DPO, Finance & Tax) plus the ability to add extra ancillary category rows as needed. `Description` (the existing short field) stays as an optional one-line blurb for quick scanning — it doesn't replace `DetailSections`, it's the short version next to the full one. `Link to OM Log` still points at the stream's Doc tab, kept as a secondary reference back to the original source.

**Flow (one-time)**:
1. Diane finalizes `OM Streams Log` with all existing streams (one tab per stream, under its status group)
2. A one-off import script is run manually (no scheduled trigger)
3. The script walks the Doc's tabs via the Google Docs API
4. For each stream tab: derives Status from the tab group, pulls Name/Init/Markets/EndDate, and copies every Category/Description row into `DetailSections`
5. Inserts rows into the `om_catalog` Postgres table, with `Link to OM Log` pointing at the specific tab
6. Import log: success/error

**Metadata extraction** (per stream tab):
- Tab group (PAUSED, DONE, etc.) → Status
- Tab title → Stream Name
- "Init:" reference → Init code
- "Markets:" → Markets (comma-separated, or `all`/`NA`)
- "Effective date" (present for closed streams) → `EndDate` column (only when Status = Closed)
- Every Category/Description row → `DetailSections` (JSON array, verbatim)
- Tab URL → `Link to OM Log`

**Fallback**: If parsing fails, leave the field as-is (manual edit required, directly in the app)

---

## Access (no login)

No authentication, no multiple roles. Reason: no sensitive data in the app, priority on staying easy to access.

```
User opens the app (from the lastminute.com network)
  ↓
Dashboard visible immediately, read-only — no redirect, no login
```

**Editing (Admin only — Diane and Nathan, symmetric)**:

**Revised 2 Aug 2026** (see `conversations/2026-08-02-gestione-om-brainstorm.md`): one single app URL for everyone — no separate admin URL to remember/re-share. Recognition, not a login/session system, is what gates the editing UI.

```
Admin does a one-time recognition step
  ↓
Recognition marker stored client-side (e.g. cookie) — persists across visits
  ↓
Admin opens the SAME public app URL as everyone else
  ↓
Server recognizes the marker → editing UI (CREATE/UPDATE/Kanban/Publish) shown automatically
  ↓
Every POST/PATCH to /streams* carries the marker, checked server-side
  ↓
Server rejects any write request missing/mismatching it — the hidden UI is not itself the security boundary
```

Revocable per-device: resetting one Admin's recognition doesn't affect the other's.

**Recommended recognition mechanism (Claude's recommendation, Diane to confirm with Nathan)**: Google Sign-In (OAuth) restricted server-side to an allow-list of exactly two `@lastminute.com` addresses (Diane's and Nathan's). Rationale: both already carry an active Google session in their normal browser (confirmed while reading the OM Streams Log Doc via Claude in Chrome), so this needs no new secret to generate, store, or distribute — it rides on infrastructure that already exists. Persistence across devices comes for free from the existing Google session; revocation is just removing an email from the allow-list. This avoids inventing a bespoke token-issuance flow, which would otherwise become its own small infra project.

**Kept in mind, not committed**: an admin-only "Preview" mode/button — see the stream's data exactly as a non-admin visitor would, without losing Admin's own recognized state.

**Still blocked on Nathan** (see `conversations/2026-07-30-domande-per-nathan-stack-infra.md` §6b): whether the lastminute.com-only network restriction needs a VPN/proxy on the new stack — Diane's expectation, based on other internal apps, is that network-level restriction alone is enough — and whether Google Sign-In (above) is acceptable given the company's actual infra/identity setup. Decided here is the *model* (one URL, device recognition) plus a recommended default, not a final answer on the infra underneath it.

---

## Notifications

**Two-audience structure confirmed 2 Aug 2026, event-to-audience mapping deliberately deferred**: notifications split into (1) Admin-facing notifications and (2) Slack notifications for everyone else (the wider team/company, beyond Admin). This is the shape to design future notification work around — which specific events/channels belong to which audience isn't decided yet.

**Trigger events** (audience mapping TBD per above):
1. `status_change`: Status changed (New → In Progress, etc.)
2. `completeness_jump`: Completeness changed by >20%

**Channels**:
- Slack: #om-governance-updates
- Email: OM Team (configured in a settings table)
- In-app: Toast notification

**Message template**:
```
[OMG-12] Invoicing in PT
Status: In Progress → Closed (26 Jul 2026)
Updated by: Diane Mary T.

See more: [link to catalog]
```

**Under consideration, not decided** (2 Aug 2026, see `conversations/2026-08-02-gestione-om-brainstorm.md`): a date-triggered notification, separate from the event-triggered ones above — e.g. an automatic Slack message as a stream's `Go-live Date` (column X) approaches, fired by a schedule rather than by an Admin edit. Needs a scheduler/cron piece not otherwise required by this app; not scoped further until decided.

---

## Version History

**Stored in**: `VersionHistory` column (JSONB array)

**Workflow (read-only)**:
1. User clicks "[HISTORY]" on a card
2. Panel shows a list of versions (who, when, what)

No restore/rollback: a small fixed set of editors (Diane and Nathan), no version conflicts to manage.

---

## Performance & Constraints

- **Query latency**: <2sec per fetch
- **Import Doc → Postgres**: one-time, not recurring
- **Concurrent edits**: a small fixed set of editors, low conflict risk; no dedicated handling needed in the MVP

---

## Security

- **HTTPS only**
- **Network restriction**: reachable only from the lastminute.com network (no user login)
- **CORS**: enabled only for the lastminute.com domain
- **CSRF**: token-based (set in a hidden form field)
- **SQL injection**: parameterized queries / ORM only, no raw string interpolation
- **XSS**: template sanitization + CSP header
- **Editing**: reserved to Admin (Diane and Nathan) via device recognition on the single app URL (see Access above) — enforced server-side on every write request, not just hidden in the public UI
- **Change log**: every change logged with a timestamp

---

## Deployment

**Versioning**:
- Version 1: MVP (CREATE, UPDATE, Dashboard, Market panel FR, no login) — Node/Postgres from the start, OM Log Doc used only as one-time bootstrap source
- Version 2: Archive tab, notifications, market panel for the rest of Tier 1 (IT, ES, UK, DE)
- Version 3: Advanced filtering, export, Tier 2 markets

### Open Questions (blocking Sprint 1 on the new stack)

Since the MVP is now the real app (Node/Postgres from day one, not a Google Apps Script bootstrap), these are no longer "post-MVP, TBD later" — they need answers before Sprint 1 can start:

- Frontend framework (not yet chosen)
- Hosting/cloud environment — which of the company's existing cloud setups, and who provisions it
- Who provisions and owns the Postgres instance
- A CI/CD pipeline (build → test → deploy on merge to `main`) — who owns it
- Environment/secrets management (DB credentials, API keys) — not hardcoded
- A custom domain + TLS certificate
- Monitoring, logging, and alerting
- A backup & rollback strategy (previous build/image, DB migration rollback)

---

## Testing Checklist

- [ ] CREATE stream: validation, storage, ID auto-generate
- [ ] UPDATE stream: edit, version history (read-only)
- [ ] Draft/Publish: draft stream invisible on `GET /streams`, visible after `PATCH /streams/{id}/publish`, publish is one-way
- [ ] Admin Kanban: drag between Status columns updates `status` correctly, Closed not draggable, draft streams appear alongside published ones
- [ ] Access: open read access with no login, editing accessible only to a single Admin role (Diane and Nathan)
- [ ] Filtering: cluster, output type, status, markets, completeness
- [ ] Market panel: FR details load, images render, links work
- [ ] Archive: closed items per year (via EndDate), correct counts
- [ ] Import: one-time Doc → Postgres import completes correctly
- [ ] Notifications: Slack/Email sent on status change + completeness >20%
- [ ] Performance: <2sec query latency
- [ ] Security: HTTPS, CORS, no XSS, network restriction, change log
