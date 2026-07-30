# OM Catalog — Architecture

## Overview

**Vision**: this app is the **single management center for Operations Management**, replacing the OM Streams Log Doc and the other siloed OM tracking documents — not running alongside them. OM work should be created, updated, and reported on only in the app once it's live.

**Backend (MVP)**: Google Apps Script + Google Sheet
**Frontend (MVP)**: HTML/JS (vanilla, no framework — MVP lean)
**Data Source (MVP)**: OM Streams Log (Google Doc) → OM Catalog (Google Sheet) — the Doc is imported **once** to bootstrap the Sheet; after that, the Doc is never read or updated again. All ongoing operations happen in the app.
**Access (MVP)**: No login. Read access is open to anyone on the lastminute.com network; create/update is reserved to Diane and Nathan via a separate, simpler access path (not exposed in the public UI).

**Real app backend**: TBD — a real framework + real database, not Apps Script. See "Real App Deployment Requirements" below.

---

## Data Model

### Google Sheet: "OM Catalog"

**Columns**:

| # | Name | Type | Example | Notes |
|---|------|------|---------|------|
| A | ID | String | OMG-7 | Immutable, unique |
| B | Name | String | Acquiring Service Evolution | |
| C | Init | String (Jira reference) | LEG-891067 | Optional (null if no INIT). A link to the corresponding Jira ticket, like the OKR bridge and today's OM digest — not free text |
| D | Status | String | Closed | Enum: New, In Progress, Paused, Closed |
| E | Priority | String | Urgent | Enum: Urgent, Normal |
| F | Strategic Pillar | String | Governance & Compliance | **Derived** from Cluster (fixed mapping in `config/clusters.json`), not entered independently — the two fields overlapped, so only Cluster is picked manually |
| G | Cluster | String | OM Compliance-Evolution | Enum: OM-CE, OM-CC, OM-CE-EFF |
| H | Output Type | String (CSV) | Business Evolution,Market Expansion | Multi-select, comma-separated — a stream can have more than one Output Type. Enum: see clusters.json |
| I | Requester | String | Business | Enum: Business, Corporate, OM Governance |
| J | Markets | String (CSV, or `all`/`NA`) | FR,NL,IT,ES | Comma-separated market codes, or `all` (every market) or `NA` (no market dimension). Not a filter — a card attribute, shown when `all`/specific markets, hidden when `NA` |
| K | Completeness % | Number | 100 | 0-100 |
| L | Description | String | Designate entity as EU... | Max 500 chars |
| M | DataControllers | JSON | {FR: "BravoNext S.A."} | JSON: {market: controller_name} |
| N | MarketAssets | JSON | {FR: {dist_chain_url, ...}} | JSON: {market: {asset_type: url}} |
| O | Link to OM Log | String | https://docs.google.com/... | Link to the narrative document |
| P | Created By | String | diane.talagrand@... | Creator email |
| Q | Created At | Datetime | 2026-07-22T10:24:00 | ISO 8601 |
| R | Updated By | String | diane.talagrand@... | Last editor email |
| S | Updated At | Datetime | 2026-07-27T15:30:00 | ISO 8601 |
| T | Version History | JSON Array | [{user, action, timestamp},...] | Change log (read-only, no restore) |
| U | End Date | Datetime | 2026-06-26T00:00:00 | Set **only** when Status becomes Closed. Used by Archive to group by year (don't use `UpdatedAt`, which changes on any edit) |

**JSON schema (columns M, N, T)**:

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

## API Endpoints (Apps Script)

### doGet(e) — Read catalog (filter + search)

**Request**:
```
GET /exec?...
  ?cluster=OM-CE
  &outputType=Business Evolution,Market Expansion
  &status=New,In Progress
  &completeness_min=50
  &completeness_max=100
  &search=invoicing
  &callback=jsonpCallback (optional, for CORS)
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

### doPost(e) — Create/Update stream

Streams are never deleted — they transition through statuses (New, In Progress, Paused) and end at Closed if they become obsolete or are done. There's no DELETE action.

**Request (CREATE)**:
```json
POST /exec
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
POST /exec
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

---

## Import: Google Doc (OM Streams Log) → Google Sheet (one-time)

This is not a continuous sync: it runs **once**, at project start, to populate the Sheet with the data already collected in the narrative Doc. After the import, the Doc is never read or updated again — every subsequent operation (create/update) happens directly in the app, on the Sheet.

**Real Doc structure** (confirmed 2026-07-28 — not a flat document): the OM Streams Log is a Google Doc using native **tabs**, organized in groups by Status (e.g. PAUSED, DONE), with **one tab per stream** nested under its status group. This means:
- `Status` is derived from which tab-group a stream sits under — not from a "Status:" paragraph in the text
- Each stream is its own Doc tab, not a heading within one continuous document
- The import needs the **Google Docs API's tab-navigation capability** (tabs are a distinct part of the API), not plain paragraph/heading parsing

Each stream tab contains a Category/Description table. Common rows include Context, Need, Legal, DPO, Finance & Tax — plus variable "ancillary" categories added only when the specific stream needs them (e.g. "IT & Platform" for a decommissioning stream), and usually a closing "Conclusion". These sections can each run to several paragraphs — this is a rich narrative, not a short form.

**Decision (confirmed 2026-07-28): this rich content is not replicated into the app.** The Sheet's `Description` column stays a **short, manually-written summary** (as originally designed, ~500 chars) — not an automatic dump of the Doc's Context/Need/Legal/DPO/Finance & Tax sections, which vary too much in length and structure to import reliably. The full detail stays in the Doc; the app links out to it via the existing "Link to OM Log" column, updated to point at the stream's specific tab. For historical streams, Diane (or whoever runs the import) writes a short summary by hand as part of the one-time import prep — there's no reliable way to auto-generate one from content this variable.

**Flow (one-time)**:
1. Diane finalizes `OM Streams Log` with all existing streams (one tab per stream, under its status group), and prepares a short summary per stream for the `Description` column
2. `importDocToSheet()` is run manually (no scheduled trigger)
3. Apps Script walks the Doc's tabs via the Google Docs API
4. For each stream tab: derives Status from the tab group, pulls Name/Init/Markets/EndDate, and takes the manually-prepared summary for Description
5. Creates rows in the "OM Catalog" sheet, with `Link to OM Log` pointing at the specific tab
6. Import log: success/error

**Metadata extraction** (per stream tab):
- Tab group (PAUSED, DONE, etc.) → Status
- Tab title → Stream Name
- "Init:" reference → Init code
- "Markets:" → Markets (comma-separated, or `all`/`NA`)
- "Effective date" (present for closed streams) → `EndDate` column (only when Status = Closed)
- Manually-prepared short summary → Description
- Tab URL → `Link to OM Log`

**Fallback**: If parsing fails, leave the field as-is (manual edit required, directly in the app)

---

## Access (no login)

No authentication, no multiple roles. Reason: no sensitive data in the app, priority on staying easy to access.

```
User opens /index.html (from the lastminute.com network)
  ↓
Dashboard visible immediately, read-only — no redirect, no login
```

**Editing (Diane and Nathan only)**:
```
Diane or Nathan opens the app through their separate access
  ↓
The editing UI (create/update) is visible only there — not exposed in the public view
  ↓
POST to doPost() as usual
```

The exact mechanism for Diane and Nathan's separate access (e.g. a private URL/parameter, or something else) is to be defined in Sprint 1 — it's not a login/session system, just a way to avoid exposing editing controls to anyone else.

---

## Notifications

**Trigger events**:
1. `status_change`: Status changed (New → In Progress, etc.)
2. `completeness_jump`: Completeness changed by >20%

**Channels**:
- Slack: #om-governance-updates
- Email: OM Team (configured in the "Settings" sheet)
- In-app: Toast notification

**Message template**:
```
[OMG-12] Invoicing in PT
Status: In Progress → Closed (26 Jul 2026)
Updated by: Diane Mary T.

See more: [link to catalog]
```

---

## Version History

**Stored in**: Column T (VersionHistory, JSON array)

**Workflow (read-only)**:
1. User clicks "[HISTORY]" on a card
2. Panel shows a list of versions (who, when, what)

No restore/rollback: a small fixed set of editors (Diane and Nathan), no version conflicts to manage.

---

## Performance & Constraints

- **Sheet row limit**: 1,000 rows (MVP scope). Alert if >80%
- **Query latency**: <2sec per fetch (the Google Sheets API is slow; consider caching)
- **Import Doc → Sheet**: one-time, not recurring
- **Concurrent edits**: a small fixed set of editors, low conflict risk; no dedicated handling needed in the MVP

---

## Security

- **HTTPS only**: deployed on the Apps Script HTTPS domain
- **Network restriction**: reachable only from the lastminute.com network (no user login)
- **CORS**: enabled only for the lastminute.com domain
- **CSRF**: token-based (set in a hidden form field)
- **SQL injection**: N/A (Google Sheet API, not SQL)
- **XSS**: template sanitization + CSP header
- **Editing**: reserved to Diane and Nathan via separate access, not exposed in the public view
- **Change log**: every change logged with a timestamp

---

## Deployment

**Hosting (MVP)**: Google Apps Script (free tier)
**URL (MVP)**: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent/`
**Custom domain** (optional): via Apps Script → Deploy → New deployment

**Versioning**:
- Version 1: MVP (CREATE, UPDATE, Dashboard, Market panel FR, no login) — Apps Script + Sheet/Doc as bootstrap database
- Version 2: Archive tab, notifications, market panel for the rest of Tier 1 (IT, ES, UK, DE)
- Version 3: Advanced filtering, export, Tier 2 markets
- **Real app (post-MVP)**: retire Apps Script and the OM Log Doc/OM Catalog Sheet; the app becomes the single OM management center

### Real App Deployment Requirements

Because the real app replaces the OM Log Doc / OM Catalog Sheet outright (not just wraps them), Apps Script is not the right long-term tool. Deploying the real app needs:

- A backend framework/runtime (TBD)
- A real database (TBD), seeded once from the OM Log Doc / OM Catalog Sheet, then the system of record on its own
- A hosting/cloud environment (company's existing cloud infra — TBD)
- A CI/CD pipeline (build → test → deploy on merge to `main`)
- Environment/secrets management (DB credentials, API keys) — not hardcoded
- Network-level access restriction (lastminute.com network only) — no user login; editing stays reserved to Diane and Nathan via a separate, simpler access path
- A custom domain + TLS certificate
- Monitoring, logging, and alerting
- A backup & rollback strategy (previous build/image, DB migration rollback)

---

## Testing Checklist

- [ ] CREATE stream: validation, storage, ID auto-generate
- [ ] UPDATE stream: edit, version history (read-only)
- [ ] Access: open read access with no login, editing accessible only to Diane and Nathan
- [ ] Filtering: cluster, output type, status, markets, completeness
- [ ] Market panel: FR details load, images render, links work
- [ ] Archive: closed items per year (via EndDate), correct counts
- [ ] Import: one-time Doc → Sheet import completes correctly
- [ ] Notifications: Slack/Email sent on status change + completeness >20%
- [ ] Performance: <2sec query latency
- [ ] Security: HTTPS, CORS, no XSS, network restriction, change log
