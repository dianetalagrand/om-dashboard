# Brainstorming Gestione OM — ruoli utente e nuove funzionalità

_Sessione del 2 agosto 2026. Brainstorming con Diane sul dominio Gestione OM (deciso il 30 luglio, vedi `conversations/2026-07-30-domain-split-and-stack-pivot.md`), a partire dalla domanda: cosa ci si aspetta da Gestione OM a seconda della tipologia di utente._

## Decisione 1: un solo ruolo, Admin

Ipotesi iniziale (poi smentita): Diane e Nathan potessero avere permessi diversi (Diane data-entry, Nathan approvazione/config), e Sergio Stievano potesse avere un ruolo di revisione dentro Gestione OM. Confermato da Diane:

- **Diane e Nathan** = un solo ruolo, **Admin**, permessi identici — nessuna distinzione tra i due
- **Sergio Stievano** = utente di **Visualizzazione OM**, non mantiene informazioni. Se serve un approfondimento prima di chiudere uno stream, lo fa Diane stessa fuori dall'app (non è un gate/approvazione nel sistema)
- **Requester** (Business/Corporate/OM Governance) = mai accesso in scrittura — il censimento degli stream resta sempre appannaggio esclusivo dell'Admin

Conseguenza: niente sistema di permessi per-ruolo/per-campo, niente stato di "review" bloccante prima di Closed.

## Decisione 2: stato bozza pre-pubblicazione

Serve poter creare/lavorare su uno stream senza che compaia subito su Visualizzazione OM (rete lastminute). Modellato come campo `PublishedAt` (nullable, non come valore di `Status`):

- `PublishedAt = null` → stream esiste in Gestione OM ma è escluso da ogni query di Visualizzazione OM
- Pubblicazione one-way (nessun "un-publish"), coerente con l'assenza di delete/rollback già decisa altrove
- Lo stato `Status` (New/In Progress/...) resta indipendente: una bozza parte comunque da `New`

## Decisione 3: Kanban Admin (vista di lavoro)

Prima ipotesi scartata da Diane: un filtro automatico su "stream fermi da N giorni" — giudicato improprio, l'urgenza reale la valuta lei in base a eventi esterni, non un timer.

Design confermato:
- Vista Gestione OM–only, colonne = `Status`: **New / In Progress / Paused**. `Closed` **non** è una colonna — resta un'azione esplicita sul form di UPDATE, e uno stream chiuso esce dalla Kanban (va nell'Archive di Visualizzazione OM)
- Drag tra colonne = cambio di `Status` (stesso effetto della modifica via form, stessa version history/notifiche)
- Riordino manuale dentro una colonna = giudizio soggettivo di Diane, non un algoritmo
- Le bozze non pubblicate (Decisione 2) compaiono comunque in questa vista, perché vanno gestite anche se invisibili altrove
- **Aperto, deliberatamente rimandato**: come si combina l'ordine manuale con il campo `Priority` (Urgent/Normal) già esistente — coesistono, o il drag lo sostituisce? Diane ha chiesto esplicitamente di non deciderlo ora, ma quando l'architettura tecnica sarà consolidata

## Decisione 4: struttura DetailSections verificata contro il Doc reale

Diane ha chiesto di verificare le categorie di `DetailSections` leggendo direttamente l'OM Streams Log (Google Doc, https://docs.google.com/document/d/1UmdVojpEnd4OQ1p8pFJ7lgJt5XzCWs8a4rLnelg66Us/edit — salvato in memoria, non richiedere più il link) via Claude in Chrome, invece di fidarsi solo dell'esempio già in `ARCHITECTURE.md`.

Verificato sul tab reale "Cruise Applications Decommissioning": Context, Need, Legal, Finance & Tax, DPO, un'ancillary variabile per stream (qui "IT & Platform"), Conclusion, più Effective Date fuori tabella — combacia con quanto già documentato, nessuna correzione necessaria alla lista categorie.

Novità confermate:
- **`Need` è l'unica categoria obbligatoria fin dalla creazione** — le altre (Context, Legal, Finance & Tax, DPO, Conclusion, ancillary) sono legittimamente vuote all'inizio e si riempiono nel tempo via UPDATE. Il rendering della card esplosa mostra solo le categorie che hanno contenuto, mai un placeholder vuoto
- **Nuovo campo `Go-live Date`** (opzionale, colonna X in Postgres): non esiste nel Doc — è un campo nuovo, distinto da `EndDate`/Effective Date, per censire quando un eventuale deploy associato allo stream va in produzione (può succedere prima che lo stream stesso sia Closed)
- L'evoluzione di stato di uno stream avviene sempre tramite le stesse due vie equivalenti (form UPDATE o drag in Kanban) — nessuna terza via

## Decisione 5: F4 — Admin Access Gate

Applicando lo stesso metodo (problemi → funzionalità) su F4 (accesso separato Admin/pubblico):

**Problemi**: lettura senza attrito per chiunque in rete (già coperto); Admin deve raggiungere l'editing ripetutamente senza reinserire credenziali; le API di scrittura devono rifiutare chi non è Admin anche bypassando la UI; il meccanismo deve essere revocabile se trapela; nessun account separato tra Diane e Nathan (stesso ruolo, già deciso).

**Deciso**: modello **URL privato con token segreto** (non un login) — il token sblocca la UI di editing, viaggia con ogni `POST`/`PATCH /streams*` e viene verificato lato server (non solo nascosto in UI), è ruotabile se trapela.

**Resta bloccato su Nathan** (vedi `conversations/2026-07-30-domande-per-nathan-stack-infra.md` §6b): se la restrizione di rete richiede VPN/proxy sul nuovo stack, e dove/come si genera/distribuisce il token in produzione. Deciso qui è il modello, non l'infrastruttura sotto.

## Decisione 6: F4 rivista — un solo URL, riconoscimento invece di token-URL separato

Diane ha corretto il modello di Decisione 5: non un URL privato separato da ricondividere ogni volta, ma **un solo URL pubblico per tutti** — il sistema, riconoscendo il dispositivo/browser di Diane o Nathan (via un passaggio di riconoscimento one-time, meccanismo ancora da definire), mostra loro l'admin view automaticamente su quello stesso URL. Il marker di riconoscimento viaggia comunque con ogni scrittura e viene verificato lato server (l'enforcement non cambia, cambia solo come si "entra").

**Tenuto a mente, non deciso**: un pulsante "[PREVIEW]" lato Admin per vedere esattamente cosa vede un utente non-admin, senza perdere il proprio stato riconosciuto — utile ma non ancora impegnativo.

**Aspettativa di Diane** (da riportare a Nathan, non ancora confermata): la restrizione di rete lastminute-only dovrebbe bastare da sola, senza VPN/proxy — basata su altre app aziendali costruite con Claude che funzionano così. Resta comunque una domanda aperta per Nathan (§6b in `conversations/2026-07-30-domande-per-nathan-stack-infra.md`), qui registrata solo come aspettativa di partenza.

## Decisione 7: revisione critica — chiusure sui buchi aperti

Su richiesta esplicita di Diane ("agisci come un esperto e dimmi criticamente cosa ti serve"), è stata fatta una revisione critica del lavoro fatto su Gestione OM finora. Punti sollevati e relative chiusure:

1. **Rischio scope creep**: segnalato che oggi si è aggiunto parecchio oltre l'MVP originale (Draft/Publish, Kanban, Access Gate, Go-live Date+notifiche, Preview). Diane: tempo/effort non è un problema ora — priorità a costruire qualcosa di solido e a tenere **tutta** la documentazione aggiornata correttamente, incluso il lato tech senza doverlo richiedere esplicitamente (vedi nota metodo sotto).
2. **Draft chiuso senza mai essere pubblicato**: nessuna gestione speciale — si comporta come qualunque stream chiuso, senza sovrastrutture. Un pulsante "[PUBLISH]" vive direttamente nella card/form dello stream (a CREATE e a ogni EDIT successivo), così non ci si dimentica di pubblicare. Uno stream creato per errore si corregge con EDIT, mai con un meccanismo di undo/discard separato. Nice-to-have a bassa priorità: il record più recente nel "calderone" dei chiusi ha un accento visivo (es. giallino) per segnalare che è il più recente — puro dettaglio di ordinamento (`EndDate DESC`), nessun nuovo campo.
3. **Notifiche su bozze**: struttura confermata ma dettaglio rimandato — due pubblici distinti: notifiche verso Admin (2 tipi, ancora da definire quali) e notifiche Slack per il resto del team/azienda. Da riprendere quando si affronta F3 nel dettaglio.
4. **Meccanismo di riconoscimento (Access Gate)**: raccomandazione di Claude — Google Sign-In ristretto alle 2 email @lastminute.com di Diane e Nathan, invece di un token custom da costruire e distribuire. Diane verifica con Nathan.
5. **Init Code**: confermato — nessuna validazione via API Jira necessaria. Diane gestisce lei stessa il censimento degli Init OM (anche per la richiesta budget associata) a monte, prima che il codice venga mai inserito nell'app: la validità è già garantita.
6. **Completeness % soggettiva**: confermato esplicitamente non da MVP — resta uno slider manuale puro, nessun ancoraggio calcolato.

## Nota di metodo aggiuntiva (2 agosto 2026)

Diane ha segnalato che in un passaggio precedente ha dovuto chiedere esplicitamente di aggiornare anche `ARCHITECTURE.md` dopo una modifica a `PRODUCT_SPEC.md` — non era stato fatto in autonomia. Richiesta esplicita: ogni decisione di prodotto va sincronizzata **anche** lato tecnico nello stesso passaggio, senza aspettare di essere richiesto, e con occhio critico su cosa si scrive — Nathan è "esigente e preciso" e Diane vuole essere alla sua altezza. Salvato come memoria permanente (`feedback_proactive_tech_sync`).

## Esplicitamente fuori scope (confermato in questa sessione)

- UI per gestire la tassonomia (Cluster→Pillar, Output Type, Markets) — resta un file di config
- Vista aggregata di version history trasversale a tutti gli stream — resta per singolo stream

## Documenti aggiornati di conseguenza

`README.md`, `docs/PRODUCT_SPEC.md` (nuove §1.4 Draft/Publish, §1.5 Admin Kanban View, chiarimento ruolo unico Admin, Out of Scope), `docs/ARCHITECTURE.md` (colonna `PublishedAt`, endpoint `PATCH /streams/{id}/publish`, nota Kanban, testing checklist).

## Metodo di lavoro richiesto da Diane per il proseguo

Per le prossime fasi di Gestione OM (e in generale), l'approccio da seguire è:

1. **Partire dai problemi** (bisogni reali, non funzionalità immaginate) e scendere in dettaglio
2. **Raggrupparli in funzionalità** (non il contrario — non si parte da una lista di feature)
3. **Mettere in ordine le funzionalità** (priorità)
4. **Svilupparle una a una**, non tutte insieme

Questa sessione stessa ha seguito implicitamente questo schema (problema → tipologie di utente coinvolte → funzionalità emerse → dettaglio una a una); va reso esplicito e ripetuto come metodo per le prossime aree del prodotto.
