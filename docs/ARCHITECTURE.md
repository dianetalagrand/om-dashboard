# OM Catalog — Architecture

## Overview

**Vision**: this app is the **single management center for Operations Management**, replacing the OM Streams Log Doc and the other siloed OM tracking documents — not running alongside them. OM work should be created, updated, and reported on only in the app once it's live.

**Backend (MVP)**: Google Apps Script + Google Sheet
**Frontend (MVP)**: HTML/JS (vanilla, no framework — MVP lean)
**Data Source (MVP)**: OM Streams Log (Google Doc) → OM Catalog (Google Sheet) — the Doc is imported **once** to bootstrap the Sheet; after that, the Doc is never read or updated again. All ongoing operations happen in the app.
**Access (MVP)**: No login. Read access is open to anyone on the lastminute.com network; create/update is reserved to Diane via a separate, simpler access path (not exposed in the public UI).

**Real app backend**: TBD — a real framework + real database, not Apps Script. See "Real App Deployment Requirements" below.

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
| T | Version History | JSON Array | [{user, action, timestamp},...] | Change log (sola lettura, no restore) |
| U | End Date | Datetime | 2026-06-26T00:00:00 | Valorizzato **solo** quando Status passa a Closed. Usato da Archive per raggruppare per anno (non usare `UpdatedAt`, che cambia per qualsiasi modifica) |

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

## Import: Google Doc (OM Streams Log) → Google Sheet (una tantum)

Questo non è un sync continuo: gira **una sola volta**, a inizio progetto, per popolare lo Sheet con i dati già raccolti nel Doc narrativo. Dopo l'import, il Doc non viene più letto né aggiornato — ogni operazione successiva (create/update) avviene direttamente in app, sullo Sheet.

**Flow (una tantum)**:
1. Diane finalizza `OM Streams Log.docx` con tutti gli stream esistenti
2. Si esegue manualmente `importDocToSheet()` (nessun trigger schedulato)
3. Apps Script legge il Doc
4. Estrae metadata dai paragrafi strutturati
5. Crea righe in "OM Catalog" sheet
6. Log di import: success/error

**Metadata extraction** (da Doc):
- Heading level 2 → Stream Name
- Paragrafo con "Init:" → Init code
- Paragrafo con "Status:" → Status
- Paragrafo con "Markets:" → Markets (comma-separated)
- Paragrafo con "Context:" → Description
- Etc.

**Fallback**: Se parsing fallisce, lascia il campo come è (manual edit richiesto, direttamente in app)

---

## Access (no login)

Niente autenticazione, niente ruoli multipli. Motivo: nessun dato sensibile nell'app, priorità a restare facilmente accessibile.

```
User opens /index.html (da rete lastminute.com)
  ↓
Dashboard visibile subito, in sola lettura — nessun redirect, nessun login
```

**Editing (solo Diane)**:
```
Diane apre l'app tramite il suo accesso separato
  ↓
UI di editing (create/update) visibile solo lì — non esposta nella vista pubblica
  ↓
POST a doPost() come sempre
```

Il meccanismo esatto dell'accesso separato di Diane (es. URL/parametro riservato, o altro) è da definire in Sprint 1 — non è un sistema di login/sessione, solo un modo per non esporre i controlli di editing a chiunque altro.

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

## Version History

**Stored in**: Column T (VersionHistory, JSON array)

**Workflow (sola lettura)**:
1. User clicks "[HISTORY]" on card
2. Panel mostra list di versioni (chi, quando, cosa)

Niente restore/rollback: editor unico (Diane), non serve gestire conflitti tra versioni.

---

## Performance & Constraints

- **Sheet row limit**: 1,000 rows (MVP scope). Alert se >80%
- **Query latency**: <2sec per fetch (Google Sheets API è lento; consider caching)
- **Import Doc → Sheet**: una tantum, non ricorrente
- **Concurrent edits**: editor unico (Diane), rischio di conflitto minimo; nessuna gestione dedicata necessaria in MVP

---

## Security

- **HTTPS only**: deployed su Apps Script HTTPS domain
- **Network restriction**: raggiungibile solo dalla rete lastminute.com (nessun login utente)
- **CORS**: Abilitato solo per lastminute.com domain
- **CSRF**: Token-based (set in form hidden field)
- **SQL injection**: N/A (Google Sheet API, not SQL)
- **XSS**: Template sanitization + CSP header
- **Editing**: riservato a Diane tramite accesso separato, non esposto nella vista pubblica
- **Change log**: Ogni modifica loggata con timestamp (editor unico)

---

## Deployment

**Hosting (MVP)**: Google Apps Script (free tier)
**URL (MVP)**: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent/`
**Custom domain** (optional): Via Apps Script → Deploy → New deployment

**Versioning**:
- Version 1: MVP (CREARE, AGGIORNARE, Dashboard, Market panel FR, no login) — Apps Script + Sheet/Doc as bootstrap database
- Version 2: Archive tab, notifiche, market panel per il resto del Tier 1 (IT, ES, UK, DE)
- Version 3: Advanced filtering, export, Tier 2 markets
- **Real app (post-MVP)**: Retire Apps Script and the OM Log Doc/OM Catalog Sheet; the app becomes the single OM management center

### Real App Deployment Requirements

Because the real app replaces the OM Log Doc / OM Catalog Sheet outright (not just wraps them), Apps Script is not the right long-term tool. Deploying the real app needs:

- A backend framework/runtime (TBD)
- A real database (TBD), seeded once from the OM Log Doc / OM Catalog Sheet, then the system of record on its own
- A hosting/cloud environment (company's existing cloud infra — TBD)
- A CI/CD pipeline (build → test → deploy on merge to `main`)
- Environment/secrets management (DB credentials, API keys) — not hardcoded
- Network-level access restriction (lastminute.com network only) — no user login; editing stays Diane-only via a separate, simpler access path
- A custom domain + TLS certificate
- Monitoring, logging, and alerting
- A backup & rollback strategy (previous build/image, DB migration rollback)

---

## Testing Checklist

- [ ] CREARE stream: validazione, storage, ID auto-generate
- [ ] AGGIORNARE stream: edit, version history (sola lettura)
- [ ] Accesso: lettura libera senza login, editing accessibile solo a Diane
- [ ] Filtering: cluster, output type, status, markets, completeness
- [ ] Market panel: FR details load, images render, links work
- [ ] Archive: closed items per year (via EndDate), correct counts
- [ ] Import: Doc → Sheet una tantum completato correttamente
- [ ] Notifiche: Slack/Email inviati on status change + completeness >20%
- [ ] Performance: <2sec query latency
- [ ] Security: HTTPS, CORS, no XSS, network restriction, change log
