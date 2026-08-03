# Accettazione della proposta di reframe di Nathan

_3 agosto 2026._

## Decisione

Diane accetta la proposta di reframe del dominio scritta da Nathan (`docs/proposal/`, vedi `docs/proposal/README.md` e `docs/proposal/OM_DOMAIN_MAPS.md`/`om-maps.html`), incluse le raccomandazioni di Nathan sulle domande aperte in sezione 8 (assessment archiviato per funzione con una faccetta di tipo-impatto; lista funzioni chiusa/controllata; "Stream" resta il nome).

**Una correzione alla tassonomia, data da Diane in fase di accettazione**: `OM Compliance` e `OM Governance` non sono due Driver separati — tutto quello che Nathan aveva contato come `OM Compliance` (2 stream) è in realtà `OM Governance`. Il Driver è quindi a **3 valori**, non 4:
- **OM Governance** (24 + 2 ex-"Compliance" = 26 stream)
- **OM Market Expansion** (5 stream)
- **OM Efficiency** (3 stream)

## Cosa sostituisce, cosa resta

Come già scritto nella proposta stessa: sostituisce il modello dati in `ARCHITECTURE.md`, l'enum `Driver` e `DetailSections` in `PRODUCT_SPEC.md`, `config/clusters.json`, il layout dashboard in `PRODUCT_SPEC.md` §2.1, e `MVP_ROADMAP.md` (rimpiazzato dal piano milestone di Map 3). Non tocca il comportamento dell'app già specificato (ruolo Admin unico, Draft/Publish, Kanban, accesso, notifiche) — quello resta.

## Documenti aggiornati di conseguenza

- `docs/proposal/README.md`: stato passato da "proposal, not agreed" ad "ACCEPTED", con la correzione Governance/Compliance
- `config/clusters.json`: riscritto a 3 Driver reali (placeholder per descrizioni/esempi — da derivare durante M1, non inventati)
- `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`: banner "superseded" in cima, che rimanda alla proposta accettata, chiarendo cosa resta valido (il comportamento) e cosa no (Driver, DetailSections, modello dati, layout dashboard)
- `docs/MVP_ROADMAP.md`: banner aggiornato — sostituito interamente dal piano milestone (M0-M6) di `OM_DOMAIN_MAPS.md` §3

## Prossimo passo: M1 — Seed from evidence

Portare tutti i 34 stream reali + i 4 documenti sorgente (OM Office Perimeter and Governance, OM Streams Log, OM Decisional Framework, OM Market Architecture) come dati strutturati, seguendo il modello accettato (Stream, Assessment, Decision, Forum, Milestone). Regola guida: un campo che non è riempibile da qualcosa scritto davvero nelle fonti viene tagliato, non inventato.

**Bloccante**: finora ho letto solo l'OM Streams Log Doc (via Claude in Chrome). Servono gli altri 3 documenti sorgente (Perimeter and Governance, Decisional Framework, Market Architecture) prima di poter fare M1 sul serio.
