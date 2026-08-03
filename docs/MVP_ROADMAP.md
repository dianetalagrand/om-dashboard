# OM Catalog — MVP Roadmap

> **Superseded (30 July 2026, then fully replaced 3 August 2026)**: this roadmap's sprints, deliverables, and hours below still assume the Google Apps Script + Sheet stack, and were never recalculated. **As of 3 Aug 2026 this entire file is replaced by the Map 3 milestone plan** in `docs/proposal/OM_DOMAIN_MAPS.md` §3 (M0 Unblock → M1 Seed from evidence → M2 Coordination core → M3 Decisions → M4 Read surface → M5 Digest → M6 As-Is registry), accepted by Diane — see `docs/proposal/README.md`. Do not plan against this file; use the milestone plan instead. Kept only for historical reference.

## Overview

**Goal**: Launch a working MVP in 4 weeks (1 month) that lets the business consult the OM catalog three-dimensionally (Cluster × OutputType × Completeness).

**Timeline**: Week 1-4 (Start: 28 July 2026)

**MVP release date**: 25 August 2026

---

## Sprint Structure

### **SPRINT 1: Backend Setup** (Week 1-2: 28 Jul - 10 Aug)

**Theme**: Infrastructure. No auth to build — open read access with no login, editing reserved to Diane and Nathan through a separate access path (simpler than a real login/roles system).

**Deliverables**:
- [ ] Separate, simple access path for Diane and Nathan's editing (not login/session)
- [ ] "OM Catalog" Google Sheet created with structured columns (including `EndDate`)
- [ ] Apps Script endpoint `doGet()` — read catalog
- [ ] Apps Script endpoint `doPost()` — create/update stream (basic)
- [ ] Import script: Doc → Sheet (one-time)

**Effort**: 5 days (Diane + 1 dev) — reduced from 8 days by removing the auth/roles system

**Success criteria**:
- ✅ Diane can create 1 stream via the form (from her reserved access)
- ✅ Anyone on the lastminute network sees the dashboard with no login
- ✅ Sheet updates correctly
- ✅ API responds in <2sec

**Demo**: Internal demo for the OM team (feedback on UX)

---

### **SPRINT 2: CREATE + UPDATE Stream** (Week 2-3: 11 Aug - 18 Aug)

**Theme**: Full CRUD + version history

**Deliverables**:
- [ ] CREATE stream form (complete, with validation)
- [ ] UPDATE stream form (edit in-place + side panel)
- [ ] Version history: log every change (timestamp, before/after) — read-only, no restore
- [ ] Notifications on status change + completeness >20%
- [ ] Slack integration (send alerts to #om-governance-updates)

**Effort**: 6 days (Diane + 1 dev) — reduced from 8 days by removing rollback

**Success criteria**:
- ✅ Form validation blocks submit if fields are missing
- ✅ Editing a stream saves changes + creates a version log entry
- ✅ Slack notification sent on status change

**Demo**: Show create/edit flow, version history

---

### **SPRINT 3: Dashboard + Filters + Archive** (Week 3-4: 19 Aug - 25 Aug)

**Theme**: Frontend, UX, visualization

**Deliverables**:
- [ ] Main dashboard: Cluster × OutputType × Completeness 3D view
- [ ] Filters: Cluster dropdown, OutputType multi-select, Status checkboxes, Completeness range (Markets is a card attribute, not a filter)
- [ ] Search: full-text search on Name
- [ ] Archive tab: closed items grouped by year
- [ ] Market details panel: FR only (Distribution Chain, Consent & Processing, Data Ownership, Market Architecture)
- [ ] Responsive UI (desktop-first)
- [ ] Empty states, loading indicators, error messages

**Effort**: 10 days (Diane + 1 dev + 1 designer)

**Success criteria**:
- ✅ Dashboard loads in <2sec
- ✅ Filters work correctly (AND logic)
- ✅ Search finds streams by name
- ✅ Archive shows closed items ordered by year
- ✅ Market panel shows FR details (images render, links work)
- ✅ UI isn't buggy (no console errors)

**Demo**: Live demo for Value Streams Owners — show them how to use the catalog

---

## Sprint Breakdown (Detailed)

### **SPRINT 1: Week 1**

**Monday 28 Jul - Friday 1 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Setup "OM Catalog" Google Sheet (incl. EndDate) | Diane | 2h | |
| Separate access path for Diane/Nathan editing (no login/session) | Dev | 3h | |
| doGet() endpoint (read) | Dev | 3h | |
| doPost() endpoint (create, basic) | Dev | 4h | |
| Doc parser script (one-time import, first draft) | Dev | 4h | |
| Testing public access + Diane/Nathan editing | Dev + Diane | 3h | |

**Total Week 1**: 19h

### **SPRINT 1: Week 2**

**Monday 4 Aug - Friday 8 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Refine doPost() (validation) | Dev | 3h | |
| Version history schema (read-only) | Diane | 2h | |
| Import Doc → Sheet (complete, one-time) | Dev | 5h | |
| Testing import (manual test cases) | Diane | 2h | |
| Deployment to Apps Script | Dev | 2h | |
| Documentation: Schema | Diane | 2h | |
| Internal demo prep | Diane | 1h | |
| **Internal Demo** (OM Team) | Diane | 1h | |

**Total Week 2**: 18h
**Sprint 1 Total**: 37h (≈ 1 dev full-time + Diane 50%) — reduced from the original plan by removing the auth/roles system

---

### **SPRINT 2: Week 2-3**

**Friday 8 Aug - Sunday 18 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| CREATE form (HTML + JS) | Dev | 6h | |
| Form validation (client + server) | Dev | 4h | |
| UPDATE form (side panel) | Dev | 5h | |
| Version history UI (read-only) | Dev | 4h | |
| Slack notification integration | Dev | 4h | |
| Email notifications | Dev | 2h | |
| Testing create/update flow | Dev + Diane | 4h | |
| Documentation: CRUD API | Diane | 2h | |

**Total Sprint 2**: 31h

---

### **SPRINT 3: Week 3-4**

**Monday 19 Aug - Monday 25 Aug**

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Dashboard layout (HTML/CSS) | Designer + Dev | 6h | |
| Filters (cluster, output type, status, markets, completeness) | Dev | 6h | |
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
- [ ] Value Streams Owners trained (short walkthrough)
- [ ] Backup & disaster recovery plan in place
- [ ] Monitoring setup (error tracking, usage analytics)
- [ ] Announcement email drafted

**Go-live: 25 Aug 2026**
- [ ] Deploy to production (Apps Script)
- [ ] Send announcement to OM Team + Value Streams Owners
- [ ] Set up office hours (Q&A, feedback)

---

## Post-MVP Roadmap (Future)

Priority follows **market Tier** (Tier 1 → Tier 2 → Tier 3), not fixed calendar phases — FR is already covered in the MVP (Tier 1).

### **Phase 2 — Remaining Tier 1**

**Scope**:
- Market details panel for IT, ES, UK, DE (all of Tier 1 not yet covered)
- Advanced analytics (streams per cluster trend, completeness heatmap)
- Export to CSV/PDF

**Effort**: 4-5 weeks

### **Phase 3 — Tier 2**

**Scope**:
- Market details for Tier 2 markets (CH, SE, AT, NL, DK, BE, IE, NO, PT, HU, FI, PL, CZ, SK)
- Mobile responsive
- Multi-language (English)
- Jira/GitHub integration

**Effort**: 6-8 weeks

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Google Sheet API rate limit | Medium | High | Cache results, batch requests |
| Doc parse failures (one-time import) | Medium | Medium | Manual fallback, error logging |
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
