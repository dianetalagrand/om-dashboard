# Recap pianificazione MVP — OM Governance Dashboard

_Ricapitolazione delle decisioni prese nelle conversazioni precedenti, portata avanti in sessione il 28 luglio 2026._

## Obiettivo generale

Trasformare il catalogo interno di OM Streams in un'app fruibile per il business (Value Stream Owner) che visualizza il lavoro dell'OM office in modo tridimensionale, rispondendo alla domanda: "Cosa fa l'OM per il mio business, e perché?"

## Problema riscontrato

- Catalogo OM attualmente bidimensionale (Excel B2C)
- Value Stream Owner non comprendono il valore delle decisioni OM
- Informazioni legali/tax/DPO sono siloed, non cross-funzionali
- Mancanza di visibilità sui benefici delivered

## Decisioni prese

### 1. Cluster OM — 3 tipologie definitive (matrice 2×3)

- Driver esterno (sempre): Compliance (conformità legale + richieste autorità)
- Driver interno (uno tra tre):
  - Efficienza → OM Compliance-Efficiency (cost optimization, process automation)
  - Continuity → OM Compliance-Continuity (risk mitigation, business stability)
  - Evolution → OM Compliance-Evolution (growth, market entry, new capability)

### 2. Classificazione mercati — tier system

- Tier 1 (Primary): UK, FR, DE, IT, ES
- Tier 2 (Secondary): CH, SE, AT, NL, DK, BE, IE, NO, PT, HU, FI, PL, CZ, SK
- Tier 3 (Residual): US, etc.
- Nota: i mercati sono attributi, non dimensione primaria. Le decisioni si prendono a cascata per tutti; la granularità per mercato è per context (Data Controller, Market Architecture).

### 3. Output types (variabili per cluster)

- OM Compliance-Evolution: Business Evolution, Market Expansion
- OM Compliance-Continuity: Corporate Compliance, Business Continuity
- OM Compliance-Efficiency: Operational Efficiency, Cost Optimization

### 4. Scope MVP — 4 settimane (28 lug – 25 ago 2026)

**Livello 1 — Gestione stream**: creare, aggiornare, autenticare (Google OAuth + email fallback, role-based access).

**Livello 2 — Visualizzazione**: dashboard 3D (Cluster × OutputType × Completeness), archive tab, market details panel (FR only per MVP).

**Livello 3 — Operazioni**: sync continuo (OM Log Doc → OM Catalog Sheet, daily 6 AM), notifiche (Slack/Email), audit trail.

### 5. Stack tecnologico (MVP)

Backend: Google Apps Script + Google Sheets. Frontend: HTML/Vanilla JS. Data store: Google Sheet "OM Catalog" (20 colonne). Source of truth: Google Doc (OM Streams Log narrativo). Auth: Google OAuth + email fallback. Notifiche: Slack + Email. Deployment: Apps Script (free tier).

> Vedi [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) per lo schema dati completo e i requisiti dell'app reale post-MVP.

### 6. Ruoli e accesso

- OM Admin: full access
- OM PM (Diane): admin + create/update/delete
- OM Contributor: create/update own streams
- Viewer (Value Stream Owner): read-only

## Deliverable di documentazione completati

README.md, README_MVP_PLAN.md, docs/PRODUCT_SPEC.md, docs/ARCHITECTURE.md, docs/UI_WIREFRAMES.md, docs/MVP_ROADMAP.md, config/clusters.json, config/markets.json.

## Status a fine luglio 2026

**Fatto**: pianificazione MVP e documentazione completa; gerarchia cluster/output type finalizzata; schema Google Sheet progettato; endpoint API specificati; timeline sprint documentata.

**In sospeso**:
- Review di Nathan Vené — approvazione scope cluster/mercati prima dello Sprint 1
- Riorganizzazione Google Sheet dopo l'approvazione
- Sprint 1: Auth + Backend API + sync Google Sheet
- Sprint 2: CRUD forms + version history + notifiche
- Sprint 3: Dashboard UI + filtri + archive + market panel

## Design system snapshot

Colori per cluster: Evolution (teal) #2ABEB9, Continuity (pink) #F2007D, Efficiency (blue) #4a86e8. Breakpoint responsive: desktop ≥1024px, tablet 768–1023px, mobile <768px. Target performance: dashboard load <2sec, query latency <2sec, alert a 80% del limite di 1.000 righe.

## Key insights

- Dimensione Cluster è primaria — risponde a "Cosa fa OM?" (driver compliance-based)
- Dimensione OutputType è secondaria — risponde a "Che valore crea?" (business benefit)
- Dimensione Completeness è terziaria — risponde a "A che punto siamo?" (progress)
- Mercati sono attributi, non dimensione — ogni stream incide su uno o più mercati, ma non è il driver di classificazione
- Sync è giornaliero, non real-time — la fonte di verità (OM Log Doc) è narrativa e manuale
- MVP scope è stretto ma credibile — 4 settimane, 1-2 persone, focus su CRUD + 3D view + FR market details
