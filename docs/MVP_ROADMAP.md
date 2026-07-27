# OM Catalog — MVP Roadmap

## Overview

**Obiettivo**: Lanciare un MVP funzionante in 4 settimane (1 mese) che permetta al business di consultare il catalogo OM in modo tridimensionale (Cluster × OutputType × Completeness).

**Timeline**: Week 1-4 (Inizio: 28 Luglio 2026)

**Release date MVP**: 25 Agosto 2026

---

## Sprint Structure

### **SPRINT 1: Auth + Backend Setup** (Week 1-2: 28 Jul - 10 Aug)

**Tema**: Infrastruttura e autenticazione

**Deliverables**:
- [ ] Auth system: Google OAuth + Email login fallback
- [ ] Role-based access control (OM Admin, PM, Contributor, Viewer)
- [ ] Google Sheet "OM Catalog" creato con colonne strutturate
- [ ] Apps Script endpoint `doGet()` — read catalog
- [ ] Apps Script endpoint `doPost()` — create/update stream (basic)
- [ ] Sync script: Doc → Sheet (first draft)

**Effort**: 8 gg (Diane + 1 dev)

**Success criteria**:
- ✅ Login funziona (SSO + fallback email)
- ✅ Diane può creare 1 stream via form
- ✅ Sheet aggiornato correttamente
- ✅ API risponde in <2sec

**Demo**: Internal demo per OM team (feedback on UX)

---

### **SPRINT 2: CREARE + AGGIORNARE Stream** (Week 2-3: 11 Aug - 18 Aug)

**Tema**: Full CRUD + version history

**Deliverables**:
- [ ] Form CREARE stream (complete, con validazione)
- [ ] Form AGGIORNARE stream (edit in-place + side panel)
- [ ] Version history: log every change (user, timestamp, before/after)
- [ ] Rollback functionality (restore to previous version)
- [ ] Notifiche su status change + completeness >20%
- [ ] Slack integration (send alerts to #om-governance-updates)

**Effort**: 8 gg (Diane + 1 dev)

**Success criteria**:
- ✅ Form validazione non permette submit se fields mancano
- ✅ Edit stream salva changes + crea version log
- ✅ Rollback ripristina valori corretti
- ✅ Slack notification inviato on status change

**Demo**: Show create/edit flow, version history, rollback

---

### **SPRINT 3: Dashboard + Filtri + Archive** (Week 3-4: 19 Aug - 25 Aug)

**Tema**: Frontend, UX, visualization

**Deliverables**:
- [ ] Dashboard principale: Cluster × OutputType × Completeness 3D view
- [ ] Filtri: Cluster dropdown, OutputType dropdown, Status checkboxes, Markets multi-select, Completeness range
- [ ] Search: Full-text search su Name
- [ ] Archive tab: Closed items raggruppati per year
- [ ] Market details panel: FR only (Distribution Chain, Consent & Processing, Data Ownership, Market Architecture)
- [ ] Responsive UI (desktop-first)
- [ ] Empty states, loading indicators, error messages

**Effort**: 10 gg (Diane + 1 dev + 1 designer)

**Success criteria**:
- ✅ Dashboard carica in <2sec
- ✅ Filtri funzionano correttamente (AND logic)
- ✅ Search trova streams per nome
- ✅ Archive mostra closed items ordinati per year
- ✅ Market panel mostra FR details (images render, links work)
- ✅ UI non è buggy (no console errors)

**Demo**: Live demo per Value Streams Owner — show them how to use catalog

---

## Sprint Breakdown (Detailed)

### **SPRINT 1: Week 1**

**Monday 28 Jul - Friday 1 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Setup Google Sheet "OM Catalog" | Diane | 2h | |
| Apps Script auth endpoint | Dev | 4h | |
| Google OAuth integration | Dev | 3h | |
| Email login fallback | Dev | 2h | |
| Session management (cookies) | Dev | 2h | |
| Roles & permissions schema | Diane | 2h | |
| doGet() endpoint (read) | Dev | 3h | |
| doPost() endpoint (create, basic) | Dev | 4h | |
| Doc parser script (first draft) | Dev | 4h | |
| Testing auth flow | Dev + Diane | 3h | |

**Total Week 1**: 29h

### **SPRINT 1: Week 2**

**Monday 4 Aug - Friday 8 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Refine doPost() (validation) | Dev | 3h | |
| Version history schema | Diane | 2h | |
| Sync Doc → Sheet (complete) | Dev | 5h | |
| Testing sync (manual test cases) | Diane | 2h | |
| Deployment to Apps Script | Dev | 2h | |
| Documentation: Schema | Diane | 2h | |
| Internal demo prep | Diane | 1h | |
| **Internal Demo** (OM Team) | Diane | 1h | |

**Total Week 2**: 18h
**Sprint 1 Total**: 47h (≈ 1 dev full-time + Diane 50%)

---

### **SPRINT 2: Week 2-3**

**Friday 8 Aug - Sunday 18 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Form CREARE (HTML + JS) | Dev | 6h | |
| Form validation (client + server) | Dev | 4h | |
| Form AGGIORNARE (side panel) | Dev | 5h | |
| Version history UI | Dev | 4h | |
| Rollback logic | Dev | 3h | |
| Notifiche Slack integration | Dev | 4h | |
| Email notifications | Dev | 2h | |
| Testing create/update flow | Dev + Diane | 4h | |
| Documentation: CRUD API | Diane | 2h | |

**Total Sprint 2**: 34h

---

### **SPRINT 3: Week 3-4**

**Monday 19 Aug - Monday 25 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Dashboard layout (HTML/CSS) | Designer + Dev | 6h | |
| Filtri (cluster, outputtype, status, markets, completeness) | Dev | 6h | |
| Search functionality | Dev | 3h | |
| Archive tab (history view) | Dev | 5h | |
| Market details panel (FR) | Dev | 6h | |
| Images/assets loading | Dev | 2h | |
| Responsive design | Designer | 4h | |
| Empty states, loading, errors | Dev | 3h | |
| Performance optimization | Dev | 3h | |
| End-to-end testing | Dev + Diane | 4h | |
| User acceptance testing (Value Streams Owner) | Diane | 2h | |
| Documentation: UI/UX | Diane | 2h | |
| Go-live prep | Diane + Dev | 2h | |

**Total Sprint 3**: 48h

---

## Resource Plan

| Role | Week 1-2 | Week 3-4 | Notes |
|------|----------|----------|-------|
| **Diane (OM PM)** | 50% | 60% | Owner, coordination, UAT |
| **Developer** | 100% | 100% | Backend + Frontend |
| **Designer** | 0% | 40% | UI/UX, responsive |
| **QA/Tester** | 20% | 40% | Validation, UAT |

**Total effort**: ~150 hours (4 weeks, 1-2 people)

---

## Launch Checklist

**Week of 18 Aug** (final prep):
- [ ] All AC (acceptance criteria) met
- [ ] No critical bugs in QA
- [ ] Documentation complete (PRODUCT_SPEC, ARCHITECTURE)
- [ ] Value Streams Owner trained (short walkthrough)
- [ ] Backup & disaster recovery plan in place
- [ ] Monitoring setup (error tracking, usage analytics)
- [ ] Announcement email drafted

**Go-live: 25 Ago 2026**
- [ ] Deploy to production (Apps Script)
- [ ] Send announcement to OM Team + Value Streams Owners
- [ ] Set up office hours (Q&A, feedback)

---

## Post-MVP Roadmap (Future)

### **Phase 2 (September - October)**

**Scope**: 
- Market details panel per NL, IT (oltre a FR)
- Advanced analytics (streams per cluster trend, completeness heatmap)
- Export to CSV/PDF
- Tier 2 market support

**Effort**: 4-5 weeks

### **Phase 3 (November - December)**

**Scope**:
- Market details per tutti Tier 1 (UK, ES, DE) 
- Mobile responsive
- Multi-language (English)
- Integration con Jira/GitHub
- Real-time sync (Doc → Sheet, not just daily)

**Effort**: 6-8 weeks

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Google Sheet API rate limit | Medium | High | Cache results, batch requests |
| Doc parse failures | Medium | Medium | Manual fallback, error logging |
| Sync delays (daily) | Low | Medium | User can manual refresh, async processing |
| User adoption (VS Owners) | Medium | High | Training, clear UX, support hours |
| Scope creep | High | High | Strict MVP scope, defer post-launch |

---

## Success Metrics (Post-Launch)

- Daily active users: >50% of Value Streams Owners
- Average session duration: >10 minutes
- Feature usage: 80%+ use at least one filter
- Support tickets: <2/week (after training)
- NPS (Net Promoter Score): >50
- Zero critical bugs after first month
