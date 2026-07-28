# Architettura come unico centro di gestione OM + sync GitLab

_Sessione del 28 luglio 2026._

## Decisione: requisito, non stato temporaneo

L'app va costruita come **unico centro di gestione per l'Operations Management**, con l'obiettivo di eliminare gli altri documenti OM (OM Streams Log Doc, tracker legal/tax/DPO sparsi) — non di affiancarli. Per questo:

- Il Google Sheet ("OM Catalog") e il Google Doc ("OM Streams Log") fanno da **database** durante l'MVP, ma una volta live l'app non vengono più usati/gestiti manualmente: tutta la gestione OM si sposta nell'app.
- Google Apps Script non sarà necessario per la versione reale: serve solo a validare l'MVP con dati veri.
- Framework e stack dell'app reale: **TBD**, non ancora deciso.

Questo è stato applicato aggiornando `README.md` e `docs/ARCHITECTURE.md` (sezioni Architecture, Development, Deployment), aggiungendo un elenco concreto di cosa serve per il deploy di un'app reale: framework/runtime, database reale, hosting/cloud, pipeline CI/CD, gestione secrets, SSO, dominio + TLS, monitoring, strategia di rollback.

## Sync verso GitLab

Il repository GitLab (`whyus-git/omg/om-governance-dashboard`) risultava essere solo il template vuoto di onboarding "First Launch" (README stub, CLAUDE.md/PROJECT.md generici, nessun contenuto reale del progetto). GitHub (`dianetalagrand/om-dashboard`) è il repo con il lavoro reale.

Portato il contenuto reale su GitLab via **merge request** (main è protetto lì): [MR !3 — "Bring in real OM Governance Dashboard project"](https://gitlab.lastminute.com/whyus-git/omg/om-governance-dashboard/-/merge_requests/3), 41 commit, pipeline CI passata. Da mergiare da un maintainer (Nathan), non da Claude.

Per passare le push rules di GitLab (email/nome autore verificati) è stata riscritta la history **solo sul branch locale destinato a GitLab** (mai toccato GitHub): email committer corrette a `diane.talagrand@lastminute.com`, nome autore normalizzato a "Diane Mary Talagrand". Ogni riscrittura è stata autorizzata esplicitamente prima di procedere.

## PROJECT.md aggiornato

Sostituito il placeholder "Personal training repo for First Launch mission" con i fatti reali del progetto (cosa fa l'app, stack MVP vs stack reale TBD, owner/approver, workflow).
