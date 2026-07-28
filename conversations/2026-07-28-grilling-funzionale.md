# Grigliata funzionale — decisioni definitive

_Sessione del 28 luglio 2026 (skill "grill-me"). Domande incalzanti su `docs/PRODUCT_SPEC.md` per far emergere buchi e assunzioni non verificate prima di implementare._

## Decisioni prese

### 1. OKR — collegare lo stream OM agli obiettivi aziendali

- Gli OKR aziendali vivono in Google Sheet condivisi (es. "Company OKRs_H2_2025"), non in un tool dedicato; Jira referenzia l'OKR nei ticket operativi (es. "Principale: OKR-164").
- Ponte proposto: campo di aggancio all'OKR + campo libero per l'output creato per il business (lista di definizioni ancora da costruire).
- Materiale di riferimento salvato in [`docs/OKR_REFERENCE.md`](../docs/OKR_REFERENCE.md) (2026 Annual Company Objectives + screenshot Sheet OKR-161...165).
- **Bloccato**: granularità dell'aggancio — livello Objective (4 opzioni stabili: Growth/Customer/Efficiency/People) o singolo Key Result (16 opzioni, cambiano ogni semestre). Diane ha girato la domanda a Nathan Vené.

### 2. Rollback — rimosso dallo scope

Il conflitto "chi vince tra Doc e app" e "cosa succede se un restore va in conflitto col sync" si è risolto a monte: **non esiste più sync continuo**, quindi non esiste nemmeno il caso d'uso del rollback. Editor unico (Diane) → nessun conflitto tra versioni da gestire. Resta solo **Version History in sola lettura** (chi ha cambiato cosa e quando), niente pulsante "[RESTORE TO THIS VERSION]", niente freeze, niente notifica-admin-per-conflitto.

### 3. Sync Doc → Sheet — import una tantum, non continuo

Il Google Doc "OM Streams Log" serve solo per l'**import iniziale una tantum** (bootstrap dello Sheet con i dati già raccolti). Dopo l'import, il Doc non viene più letto né aggiornato — tutta l'operatività passa in app. Non serve più un trigger giornaliero (6 AM), né gestire conflitti Doc-vs-app.

### 4. Archive — nuovo campo `EndDate`

Lo schema non aveva un campo dedicato per la data di chiusura (solo `CreatedAt`/`UpdatedAt`, che cambia per qualsiasi modifica). Aggiunto `EndDate`, valorizzato **solo** quando `Status` passa a `Closed` — l'Archive raggruppa per anno su questo campo.

### 5. Market Details Panel — processo manuale confermato

Per gli altri mercati (oltre FR) il contenuto (Distribution Chain, Data Controller, Consent & Processing, Market Architecture) va ancora creato. È un processo manuale: Diane raccoglie le informazioni cross legal/tax/DPO e le inserisce lei stessa. Nessun form admin dedicato necessario per l'MVP.

### 6. Roadmap — priorità per Tier di mercato, non per fasi calendario

Il roadmap post-MVP mischiava un mercato Tier 2 (NL) con mercati Tier 1 (IT, ES) nella stessa fase, lasciando altri Tier 1 (UK, DE) per dopo. Corretto: **Fase 2 = tutto il Tier 1 rimanente** (IT, ES, UK, DE), **Fase 3 = mercati Tier 2**.

### 7. Accesso — niente login

Cambio più grande della sessione: **nessuna autenticazione**. Non ci sono dati sensibili nell'app, e la priorità è restare facilmente accessibile senza sovracomplicare.

- **Lettura**: aperta a chiunque sulla rete lastminute.com, nessun account
- **Scrittura (create/update)**: riservata a Diane, tramite un accesso separato e più semplice del login classico (meccanismo esatto da definire in Sprint 1)
- Eliminato l'intero sistema di ruoli (OM Admin/PM/Contributor/Viewer) e l'audit trail multi-utente: editor unico → basta un change log con timestamp
- Motivazione: "no owner field, sono sempre io" — non esiste un team di Contributor da gestire nella pratica attuale

Questo taglia il lavoro di Sprint 1 da ~47h a ~37h (niente sistema di auth/ruoli da costruire).

### 8. Cluster — resta single-select

Confermato: nessun caso reale finora di un'iniziativa che ricade contemporaneamente in due cluster (es. Efficiency + Continuity insieme). Il dropdown single-select resta com'è, nessuna modifica.

## Documenti aggiornati di conseguenza

`README.md`, `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/MVP_ROADMAP.md`, `docs/UI_WIREFRAMES.md` — vedi commit "docs: no login, one-time Doc import, no rollback (functional review)".

## Bonus: fix CI

Il workflow GitHub "pages build and deployment" falliva da giorni (`fatal: No url found for submodule path 'wu-station' in .gitmodules`). Causa: `wu-station` e `wu-station-add-diane-card` erano finiti nel repo come riferimenti a sottomodulo rotti (nessun `.gitmodules`), non submodule veri — probabilmente un `git add` più ampio fatto per errore. Risolto: rimossi dal tracking di git (i file restano sul disco, non toccati), aggiunti a `.gitignore`. Sito ora live su [dianetalagrand.github.io/om-dashboard](https://dianetalagrand.github.io/om-dashboard/).
