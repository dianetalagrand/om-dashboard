# OM Catalog — Architecture

## Overview

> ⚠️ **Everything below is the MVP bridge architecture, not the target architecture.** Apps Script, the OM Streams Log (Google Doc), and the OM Catalog (Google Sheet) exist only to prove the product with real data quickly. The production app will be rebuilt on a different framework (TBD) with its own data store, and the dependency on the OM Log Doc / OM Catalog Sheet must be eliminated at that point — they are a temporary DB, not the permanent one.

**Backend (MVP)**: Google Apps Script + Google Sheet
**Frontend (MVP)**: HTML/JS (vanilla, no framework — MVP lean)
**Data Source (MVP)**: OM Streams Log (Google Doc) → OM Catalog (Google Sheet)
**Sync (MVP)**: Continuo via Apps Script trigger
**Target production backend**: TBD (not Apps Script; no dependency on OM Log Doc / OM Catalog Sheet)

---

## Data Model

### Google Sheet: "OM Catalog" (OM Catalog)

**Colonne**:

| # | Nome | Tipo | Esempio | Note |
|---|------|------|---------|------|
| A | ID | String | OMG-7 | Immutable, unique |
| B | Name | String | Acquiring Service Evolution | |
| C | Init | String | LEG-891067 | Optional (null se no INIT) |
| D | Status | String | Closed | Enum: New, In Progress, Paused, Closed |
| E | Priority | String | Urgent | Enum: Urgent, Normal |
| F | Strategic Pillar | String | Governance & Compliance | (vedi config) |
| G | Cluster | String | OM Compliance-Evolution | Enum: OM-CE, OM-CC, OM-CE-EFF |
| H | Output Type | String | Business Evolution | Enum: vedi clusters.json |
| I | Requester | String | Business | Enum: Business, Corporate, OM Governance |
| J | Markets | String (CSV) | FR,NL,IT,ES | Comma-separated market codes |
| K | Completeness % | Number | 100 | 0-100 |
| L | Description | String | Designate entity as EU... | Max 500 chars |
| M | DataControllers | JSON | {FR: "BravoNext S.A."} | JSON: {market: controller_name} |
| N | MarketAssets | JSON | {FR: {dist_chain_url, ...}} | JSON: {market: {asset_type: url}} |
| O | Link to OM Log | String | https://docs.google.com/... | Link al documento narrativo |
| P | Created By | String | diane.talagrand@... | Email creator |
| Q | Created At | Datetime | 2026-07-22T10:24:00 | ISO 8601 |
| R | Updated By | String | diane.talagrand@... | Email last editor |
| S | Updated At | Datetime | 2026-07-27T15:30:00 | ISO 8601 |
| T | Version History | JSON Array | [{user, action, timestamp},...] | Audit trail |

**Schema JSON (per colonne M, N, T)**:

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
  &outputType=Business Evolution
  &status=New,In Progress
  &market=FR
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
      "outputType": "Business Evolution",
      "markets": ["PT", "ES", "FR"],
      "completeness": 75,
      "dataControllers": {"PT": "LMNext PT"},
      "updatedAt": "2026-07-27T15:30:00",
      "updatedBy": "diane.talagrand@lastminute.com"
    }
  ]
}
```

### doPost(e) — Create/Update/Delete stream

**Request (CREATE)**:
```json
POST /exec
{
  "action": "CREATE",
  "data": {
    "name": "Nuova attività",
    "init": null,
    "status": "New",
    "cluster": "OM-CC",
    "outputType": "Corporate Compliance",
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
  "message": "Stream creato con successo"
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
  "message": "Stream aggiornato",
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

## Sync: Google Doc (OM Streams Log) → Google Sheet

**Flow**:
1. Diane aggiorna `OM Streams Log.docx` manualmente (add/edit stream info)
2. Trigger schedulato ogni mattina (6 AM) esegue `syncDocToSheet()`
3. Apps Script legge il Doc
4. Estrae metadata dai paragrafi strutturati
5. Aggiorna/crea righe in "OM Catalog" sheet
6. Log di sync: success/error

**Metadata extraction** (da Doc):
- Heading level 2 → Stream Name
- Paragrafo con "Init:" → Init code
- Paragrafo con "Status:" → Status
- Paragrafo con "Markets:" → Markets (comma-separated)
- Paragrafo con "Context:" → Description
- Etc.

**Fallback**: Se parsing fallisce, lascia il campo come è (manual edit richiesto)

---

## Authentication Flow

**Login**:
```
User opens /index.html
  ↓
Redirect → /auth?redirect=/dashboard
  ↓
Try SSO (Google OAuth for lastminute.com)
  ↓
If fails, fallback → Email + Password form
  ↓
Validate user in AppScript (check email domain + password hash)
  ↓
Set session cookie (HttpOnly, SameSite=Strict)
  ↓
Redirect → /dashboard
```

**Session check** (ogni page load):
```javascript
async function checkAuth() {
  const response = await fetch('/exec?action=checkAuth');
  const result = await response.json();
  if (!result.authenticated) {
    window.location.href = '/auth?redirect=' + window.location.pathname;
  }
  return result.user; // {email, role, name}
}
```

**Roles mapping**:
- Email ends with `@lastminute.com` + in sheet "Users" with role → OM Admin / OM PM / OM Contributor
- Viewer role → auto per VS Owner (read-only access)

---

## Notifications

**Trigger events**:
1. `status_change`: Status cambiato (New → In Progress, etc.)
2. `completeness_jump`: Completeness cambiato >20%

**Channels**:
- Slack: #om-governance-updates
- Email: OM Team (config in sheet "Settings")
- In-app: Toast notification

**Message template**:
```
[OMG-12] Invoicing in PT
Status: In Progress → Closed (26 Jul 2026)
Updated by: Diane Mary T.

See more: [link to catalog]
```

---

## Version History & Rollback

**Stored in**: Column T (VersionHistory, JSON array)

**Rollback workflow**:
1. User clicks "[HISTORY]" on card
2. Panel mostra list di versioni (chi, quando, cosa)
3. Click "[RESTORE TO THIS VERSION]"
4. Apps Script ripristina i valori
5. Nuova entry aggiunta a VersionHistory con action="ROLLBACK"

---

## Performance & Constraints

- **Sheet row limit**: 1,000 rows (MVP scope). Alert se >80%
- **Query latency**: <2sec per fetch (Google Sheets API è lento; consider caching)
- **Sync frequency**: 1x/day (6 AM) — non real-time
- **Concurrent edits**: Sheet locking potrebbe causare conflict; manual merge se occorre

---

## Security

- **HTTPS only**: deployed su Apps Script HTTPS domain
- **CORS**: Abilitato solo per lastminute.com domain
- **CSRF**: Token-based (set in form hidden field)
- **SQL injection**: N/A (Google Sheet API, not SQL)
- **XSS**: Template sanitization + CSP header
- **Auth**: Email-based, no password in URL
- **Audit trail**: Ogni action logged con user + timestamp

---

## Deployment

> ⚠️ **MVP hosting only.** Apps Script hosting below is for the MVP prototype. Production hosting/framework is TBD and will not carry forward the OM Log Doc / OM Catalog Sheet dependency.

**Hosting (MVP)**: Google Apps Script (free tier)
**URL (MVP)**: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent/`
**Custom domain** (optional): Via Apps Script → Deploy → New deployment

**Versioning**:
- Version 1: MVP (CREARE, AGGIORNARE, AUTH, Dashboard, Market panel FR) — Apps Script + Sheet/Doc bridge
- Version 2: Archive tab, notifiche, market panel NL/IT
- Version 3: Advanced filtering, export, tier 2 markets
- **Production (post-MVP)**: Migrate off Apps Script + OM Log Doc/OM Catalog Sheet onto the target framework (TBD) and its own data store

---

## Testing Checklist

- [ ] CREARE stream: validazione, storage, ID auto-generate
- [ ] AGGIORNARE stream: edit, version history, rollback
- [ ] AUTH: login/logout, role-based access, session persistence
- [ ] Filtering: cluster, output type, status, markets, completeness
- [ ] Market panel: FR details load, images render, links work
- [ ] Archive: closed items per year, correct counts
- [ ] Sync: Doc → Sheet aggiorna correttamente
- [ ] Notifiche: Slack/Email inviati on status change + completeness >20%
- [ ] Performance: <2sec query latency
- [ ] Security: HTTPS, CORS, no XSS, audit trail logged
