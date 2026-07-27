# 🛰️ OM Catalog App — MVP Plan

## SCOPO (Formalizzato)

**Trasformare il catalogo di attività OM Streams in un'app fruibile per il business (Value Streams Owner) che visualizza il lavoro dell'OM office in modo tridimensionale, mostrando QUA Fa il business OM (Cluster), CHE COSA restituisce (Output Type), e A CHE PUNTO siamo (Completeness).**

### Problema attuale
- Catalogo OM è **bidimensionale** (Excel B2C) — non è chiaro al business che beneficio ricevono dalle decisioni OM
- Value Streams Owner non conoscono OM e non vedono il valore
- Informazioni legali/tax/DPO sono siloed — non cross-funzionali

### Soluzione
**OM Catalog App** = consultazione tridimensionale del lavoro OM:
- **Dimensione 1: CHE COSA (Cluster)** — quale tipo di attività fa il business OM
  - OM Compliance-Evolution (nuovi mercati, nuove entità)
  - OM Compliance-Continuity (osservanza leggi, cicli revisione)
  - OM Compliance-Efficiency (analisi miglioramento fiscale, accentramenti)
  
- **Dimensione 2: CHE COSA ABILITA (Output Type)** — quale beneficio aziendale garantisce
  - Business Evolution, Market Expansion
  - Corporate Compliance, Business Continuity
  - Operational Efficiency, Cost Optimization
  
- **Dimensione 3: QUANTO FATTO (Completeness)** — grado di avanzamento

### Utenti finali
- **Value Streams Owner** (Hotel, Flight, Packages, Partnership) → VIEWERS
  - Vogliono capire: "Cosa fa l'OM per me?"
  
- **OM PM** (Diane) → ADMIN/EDITOR
  - Gestisce il catalogo, traccia progress, notifica team
  
- **OM Team** → CONTRIBUTORS
  - Collaborano su attività

---

## MVP SCOPE (4 settimane)

### Livello 1: Gestione Stream
- ✅ **CREARE stream** (form input, validazione, storage)
- ✅ **AGGIORNARE stream** (edit, version history, rollback)
- ✅ **AUTENTICARE** (Google OAuth + Email login, role-based access)

### Livello 2: Visualizzazione
- ✅ **Dashboard principale** (Cluster × OutputType × Completeness, filtri, search)
- ✅ **Archive tab** (closed items per year)
- ✅ **Market details panel** (FR only — Distribution Chain, Data Controller, Consent & Processing, Market Architecture)

### Livello 3: Operazioni
- ✅ **Sync continuo**: OM Log (Google Doc) → OM Catalog (Google Sheet)
- ✅ **Notifiche**: Slack/Email su status change + completeness >20%
- ✅ **Audit trail**: Log completo di chi ha fatto cosa quando

---

## File Struttura

```
om-dashboard/
├── README_MVP_PLAN.md (questo file — scopo formalizzato)
│
├── docs/
│   ├── PRODUCT_SPEC.md (requisiti funzionali dettagliati per CREARE/AGGIORNARE/AUTENTICARE)
│   ├── ARCHITECTURE.md (schema dati, API endpoints, backend flow, security)
│   ├── UI_WIREFRAMES.md (layout, interaction, design system, responsive)
│   └── MVP_ROADMAP.md (timeline, sprint planning, resource allocation)
│
├── config/
│   ├── clusters.json (3 cluster OM-driven + output type mapping)
│   └── markets.json (Tier 1/2/3 classification)
│
├── Code.gs (Apps Script backend — CREARE, AGGIORNARE, AUTH, SYNC)
├── index.html (Frontend — Dashboard, filters, market panel, archive)
│
└── [Future implementations...]
    ├── Sync script (Doc → Sheet continuo)
    ├── Notification engine (Slack/Email)
    └── Frontend framework (Vanilla JS → React/Vue in Phase 2)
```

---

## Timeline

| Fase | Sprint | Settimane | Deliverable |
|------|--------|-----------|-------------|
| **Infrastruttura** | Sprint 1 | 1-2 | Auth, doGet(), doPost(), Sync (draft), Google Sheet schema |
| **CRUD Completo** | Sprint 2 | 2-3 | CREARE, AGGIORNARE, version history, rollback, notifiche |
| **UI & Launch** | Sprint 3 | 3-4 | Dashboard, filtri, archive, market panel (FR), go-live |

**Go-live**: 25 Agosto 2026

---

## Prossimi Step

1. **Approva il piano MVP** con Nathan
2. **Confirma Cluster & Output Type** definitivi
3. **Reorganizza Google Sheet** (esplodi OM Log funzionale × visualizzazione in riga)
4. **Avvia implementazione** (Sprint 1)

---

## Documenti di riferimento

- `docs/PRODUCT_SPEC.md` — Leggi per dettagli sui 3 livelli (CREARE/AGGIORNARE/AUTENTICARE)
- `docs/ARCHITECTURE.md` — Leggi per schema dati e API design
- `docs/UI_WIREFRAMES.md` — Leggi per layout e interaction
- `docs/MVP_ROADMAP.md` — Leggi per timeline dettagliata e resource plan

---

## Success Criteria (MVP Launch)

- ✅ Diane può creare/aggiornare stream via form
- ✅ Value Streams Owner possono consultare catalogo in 3 dimensioni
- ✅ Dashboard carica in <2sec
- ✅ Version history tracked per ogni change
- ✅ Notifiche Slack/Email funzionano
- ✅ Zero critical bugs dopo UAT
- ✅ Documentazione completa

---

**Autore**: Diane Mary Talagrand (OM PM)  
**Data**: 27 Luglio 2026  
**Status**: ⏳ In review con Nathan
