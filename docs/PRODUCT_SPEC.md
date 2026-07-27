# OM Catalog — Product Specification

## Overview

**Scopo**: Creare una app fruibile per il business (Value Streams Owner) che visualizza il catalogo di attività OM in modo tridimensionale, mostrando **cosa fa l'OM office** e **quale beneficio restituisce all'azienda** attraverso decisioni strategiche cross-funzionali (legal, tax, DPO, finance).

**Utenti**:
- **Value Streams Owner** (Hotel, Flight, Packages, Partnership) → Viewers
- **OM PM** (Diane) → Admin/Editor
- **OM Team** → Contributors

**Lingua**: Italiano (per il business)

---

## 1. LIVELLO 1: GESTIONE STREAM — Funzionalità Principali

### 1.1 LIVELLO 2A: CREARE STREAM

**Descrizione**: Form strutturato per inserire una nuova attività OM nel catalogo.

**Input (campi obbligatori + optional)**:

| Campo | Tipo | Obbligatorio | Note |
|-------|------|--------------|------|
| **ID** | Auto-generated | ✅ | OMG-{incrementale} |
| **Name** | Testo | ✅ | Es. "Invoicing in PT", "Apertura Newco Romania" |
| **Init Code** | Testo | ❌ | Se INIT presente, es. INIT-997, INIT-1004 (solo per Evolution) |
| **Status** | Dropdown | ✅ | New, In Progress, Paused, Closed (default: New) |
| **Priority** | Dropdown | ✅ | Urgent, Normal |
| **Strategic Pillar** | Dropdown | ✅ | Governance & Compliance, Cost Optimisation, Expansion & Growth, OM Maintenance & Review |
| **Cluster** | Dropdown | ✅ | OM Compliance-Evolution, OM Compliance-Continuity, OM Compliance-Efficiency |
| **Output Type** | Dropdown | ✅ | Dipende da Cluster (vedi tabella mapping) |
| **Requester** | Dropdown | ✅ | Business, Corporate, OM Governance |
| **Markets** | Multi-select | ✅ | UK, FR, DE, IT, ES, (Tier 2) ... |
| **Completeness %** | Slider | ✅ | 0-100%, default 0% |
| **Description** | Long text | ❌ | Context, need, conclusion (max 500 chars) |

**Validazione**:
- `Name` required
- At least 1 market selected
- `Cluster` + `Output Type` required
- Se `Cluster = Evolution` → `Init Code` consigliato (ma non obbligatorio)

**Storage**:
- Salva in Google Sheet "OM Catalog"
- Log: created_by, created_at, updated_by, updated_at
- Sync automatico con OM Streams Log (Google Doc)

**Workflow**:
1. Click "[+ NEW STREAM]"
2. Compila form
3. Click "[SAVE]"
4. Validazione lato client
5. POST a Apps Script endpoint
6. Sheet aggiornato
7. Confirmation: "Stream OMG-X creato ✅"

---

### 1.2 LIVELLO 2B: AGGIORNARE STREAM

**Descrizione**: Modificare campi di uno stream esistente con traccia delle modifiche.

**Funzionalità**:
- **Select & Edit**: Clicca su card stream → side panel con form edit
- **Fields mutabili**: Tutti tranne `ID` (immutable)
- **Version history**: Mostra chi ha modificato cosa e quando
- **Rollback**: Possibilità di tornare a versione precedente
- **Notifiche**: Alert team se:
  - Status cambia (New → In Progress, In Progress → Closed)
  - Completeness cambia >20% (es. 30% → 55%)

**Validazione**: Stessa di CREARE

**Workflow**:
1. Stream card mostra "[EDIT] [HISTORY] [...]"
2. Click "[EDIT]"
3. Side panel form (pre-filled)
4. Modifica campi
5. Click "[SAVE CHANGES]"
6. Validazione
7. PUT a Apps Script endpoint
8. Log creato: "Diane modificato Status: In Progress → Closed (26 Jul 2026)"
9. Alert inviati a team (se configurato)

---

### 1.3 LIVELLO 2C: AUTENTICARE

**Descrizione**: Autenticazione basata su account (email) con roles & permissions.

**Auth method**: 
- **Primary**: Google OAuth (lastminute.com domain)
- **Fallback**: Email + Password (gestito da Apps Script)

**Roles & Permissions**:

| Role | CREATE | UPDATE | DELETE | VIEW ALL | ADMIN |
|------|--------|--------|--------|----------|-------|
| **OM Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **OM PM** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **OM Contributor** | ✅ | ✅ Own | ❌ | Own | ❌ |
| **Viewer** (VS Owner) | ❌ | ❌ | ❌ | ✅ | ❌ |

**Audit Trail**:
- Every action logged: user, action (CREATE/UPDATE/DELETE), timestamp, field changes
- Compliance-ready per legal/DPO

**Workflow**:
1. Utente accede a `/catalog`
2. Se no session → redirect LOGIN
3. Email + SSO button
4. Post-login → Dashboard
5. Header mostra: "👤 Diane Mary T. | Role: OM PM"

---

## 2. LIVELLO 1: VISUALIZZAZIONE — UI/UX

### 2.1 Dashboard Principale (ACTIVE Streams)

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
│ CLUSTER: OM Compliance-Evolution | OUTPUT: Nuovi Mercati    │
│ Completeness: ████░░ 65%                                    │
│                                                               │
│ [Card 1] OMG-12 Invoicing in PT                             │
│ ├─ Status: In Progress | Init: INIT-997                     │
│ ├─ Markets: PT, ES, FR | Completeness: 75%                  │
│ ├─ Requester: Business | Priority: Urgent                   │
│ └─ [📋 Market Details ▼] [🔗 OM Log] [EDIT]                 │
│                                                               │
│ [Card 2] OMG-X Apertura Newco Romania                       │
│ ├─ Status: In Progress | Init: INIT-1004                    │
│ ├─ Markets: RO (Tier 2) | Completeness: 40%                │
│ ├─ Requester: Corporate | Priority: Urgent                  │
│ └─ [📋 Market Details ▼] [🔗 OM Log] [EDIT]                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Filtri**:
- Cluster: dropdown (tutti, o singolo)
- Output Type: dropdown
- Status: checkboxes (New, In Progress, Paused, Closed)
- Markets: multi-select o search
- Completeness range: slider (0-100%)
- Search: text input (nome stream)

**Mostra**: 
- Card per stream
- Status badge (color-coded)
- Completeness bar
- Key info: Markets, Requester, Priority

---

### 2.2 Market Details Panel (Expandibile)

**Trigger**: Click "[📋 Market Details]" su card

**Contiene** (per mercato selezionato):

```
┌──────────────────────────────────────┐
│ MARKET DETAILS: FR                   │
├──────────────────────────────────────┤
│                                      │
│ 📊 DISTRIBUTION CHAIN                │
│    [diagram/screenshot da PPT]       │
│                                      │
│ 👤 DATA CONTROLLER                   │
│    Name: BravoNext S.A.              │
│    Role: EU Collecting Entity Lead   │
│                                      │
│ 📋 CONSENT & PROCESSING              │
│    [matrix compliance GDPR]          │
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

**Nota**: MVP = solo FR. Altri Tier 1 (NL, IT, ES, UK, DE) aggiunti in roadmap.

---

### 2.3 Archive Tab (History View)

**Trigger**: Click "ARCHIVE (History)" tab

**Mostra**: Stream chiusi (Status=Closed), raggruppati per year

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

**Metrica**: Per ogni year, conta stream completed per cluster + output type

---

## 3. Data Schema

Vedi `ARCHITECTURE.md`

---

## 4. Acceptance Criteria (MVP)

- ✅ Form CREARE stream con validazione
- ✅ Edit stream + version history
- ✅ Auth account-based + roles
- ✅ Dashboard Cluster × OutputType × Completeness filtrato
- ✅ Market details panel (FR only)
- ✅ Archive tab con closed items per year
- ✅ Sync Doc → Sheet continuo
- ✅ Notifiche status change + completeness >20%
- ✅ Audit trail (log action)

---

## 5. Non in scope (post-MVP)

- Multi-language (ora italiano, future: inglese)
- Advanced analytics (trend, forecasting)
- Tier 2/3 market details
- Mobile responsive (desktop first)
- Export PDF/Excel
