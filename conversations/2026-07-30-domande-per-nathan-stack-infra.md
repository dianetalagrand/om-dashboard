# Domande per Nathan — stack e infrastruttura (post stack pivot)

_Preparato il 30 luglio 2026, a valle della decisione di Nathan su architettura per dominio (Gestione OM / Visualizzazione OM) e stack TypeScript/Node + PostgreSQL. Vedi `conversations/2026-07-30-domain-split-and-stack-pivot.md` per il contesto completo. Ogni punto è scomposto in sotto-domande puntuali su cui Nathan può decidere direttamente._

## 1. Granularità dello split per dominio

- **1a.** "Sviscerare verticalmente" Gestione OM e Visualizzazione OM significa due **servizi separati** (deploy, repo o almeno moduli backend indipendenti), o due aree **funzionalmente distinte dentro la stessa app** (stesso servizio Node, stesso schema Postgres, ma API/UI separate per dominio)? `ARCHITECTURE.md` oggi assume la seconda opzione per l'MVP — da confermare.
- **1b.** Se in futuro serve separazione più netta (es. scaling diverso, team diversi), è un problema da risolvere ora o si può migrare più avanti senza costi eccessivi?

## 2. Hosting / infrastruttura

- **2a.** Esiste già un ambiente cloud aziendale (Azure/AWS/GCP o altro) da usare, o va richiesto ad hoc per questo progetto?
- **2b.** Chi si occupa del provisioning: un team IT/Platform interno, un DevOps dedicato, o il developer del progetto stesso?

## 3. Database PostgreSQL

- **3a.** Chi provisiona l'istanza Postgres — lo stesso team dell'hosting, un DBA/team dati separato, o un servizio managed (es. RDS/Cloud SQL) a cui il team ha già accesso?
- **3b.** Esiste uno standard aziendale (versione Postgres, managed vs self-hosted, policy di backup) da seguire, o è libera scelta per questo progetto?

## 4. CI/CD e secrets

- **4a.** Esiste già una pipeline/template CI/CD aziendale da riusare (build → test → deploy su merge a `main`), o va costruita da zero per questo repo?
- **4b.** Dove si gestiscono le credenziali (DB, eventuali API key): un vault aziendale, variabili d'ambiente della piattaforma di hosting, o altro?

## 5. Frontend

- **5a.** C'è un framework frontend standard/preferito in azienda per progetti come questo (React, Vue, altro), o è libera scelta del team?

## 6. Dominio, rete, monitoring

- **6a.** Dominio custom + certificato TLS: chi lo richiede e lo configura?
- **6b.** La restrizione "solo rete lastminute.com, nessun login" resta valida com'è sul nuovo stack, o il meccanismo cambia (es. serve una VPN/proxy diverso da quello che copriva Apps Script)?
- **6c.** Serve collegarsi a un sistema di monitoring/alerting aziendale già esistente, o va scelto/configurato ad hoc per questo progetto?

## 7. Backup & rollback

- **7a.** Esiste una policy aziendale di backup/rollback per database Postgres da seguire, o va definita specificamente per questo progetto?

---

Queste risposte bloccano l'inizio di Sprint 1 sul nuovo stack (vedi nota "Superseded" in cima a `docs/MVP_ROADMAP.md`) — effort e timeline restano da ricalcolare una volta chiuse.

Contesto completo delle decisioni già prese (non richiedono input di Nathan): vedi `README.md` sezione "Recently Updated" e `docs/ARCHITECTURE.md`.
