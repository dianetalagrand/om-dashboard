# Domain split (Visualizzazione OM / Gestione OM) + stack pivot a Node/Postgres

_Sessione del 30 luglio 2026. Decisioni comunicate da Nathan Vené a Diane, che le riporta a Claude per aggiornare i doc._

## Decisione 1: architettura per dominio, non per schema condiviso

Nathan segnala che l'analisi finora è partita dallo schema dati condiviso (un Sheet, un set di endpoint, una index.html) e solo dopo si è chiesto chi lo usa — approccio "orizzontale". Corretto: **Visualizzazione OM** e **Gestione OM** sono due entità/domini distinti nella stessa app, da analizzare e costruire verticalmente ciascuno per sé:

- **Visualizzazione OM** — dominio di lettura: chiunque in rete lastminute naviga/filtra/esplode il catalogo, consulta l'archivio. Obiettivo: aiutare le persone a orientarsi nell'OM.
- **Gestione OM** — dominio di scrittura/workflow: Diane e Nathan creano/aggiornano gli stream, notifiche, version history, stato. Obiettivo: governare gli stream progettuali.

L'analisi (PRODUCT_SPEC, poi ARCHITECTURE) riparte da qui, a scendere — prima i due domini separati, poi l'implementazione tecnica condivisa dove ha senso.

## Decisione 2: stack reale da subito — TypeScript/Node + PostgreSQL

Nathan giudica sbagliata la soluzione Apps Script + Google Sheet come base dell'MVP: lo scopo dichiarato è **sostituire** i Doc/Sheet Google, non affiancarli temporaneamente. Costruire l'MVP su Apps Script significa lavorare dentro l'ecosistema che si vuole eliminare e poi ricostruire tutto sullo stack reale.

**Nuova direzione**: l'MVP stesso è basato su TypeScript/Node (backend) + PostgreSQL (database) — non più un MVP-ponte su Apps Script seguito da un "real app" TBD in futuro. Questo è ora lo stack reale, non una fase intermedia.

Conseguenza pratica: tutta la lista che in `ARCHITECTURE.md`/`README.md` era segnata "Real App — TBD, post-MVP" (hosting/cloud, pipeline CI/CD, gestione secrets, dominio+TLS, monitoring, backup, provisioning del DB) diventa un blocco per Sprint 1, non più roba da dopo. Restano domande aperte per Nathan: dove si hosta, chi provisiona Postgres, chi possiede CI/CD e secrets.

`Code.gs` e `index.html` (prototipo Apps Script) sono superati da questa decisione — non sono la base di partenza per il nuovo build, restano solo come riferimento storico di cosa doveva fare l'app.

## Effort/timeline: non ricalcolati ora

Diane ha chiesto esplicitamente di lasciare da parte il ricalcolo di effort/timeline in questa sessione — le stime in `MVP_ROADMAP.md` (37h Sprint 1, go-live 25 Aug) restano quelle vecchie, basate su Apps Script, e sono da considerare superate finché non si ridiscute lo sforzo reale con il nuovo stack. Va fatto, ma non ora.

## Documenti aggiornati di conseguenza

`README.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT_SPEC.md` — riorganizzati per riflettere i due domini e il nuovo stack. `docs/MVP_ROADMAP.md` lasciato con una nota di superamento in testa, senza toccare le stime.
