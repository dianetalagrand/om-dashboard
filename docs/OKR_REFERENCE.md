# OKR Reference — materiale per il bridge OKR ↔ OM Stream

Materiale di riferimento per collegare gli stream OM agli OKR aziendali (vedi decisione in [conversations/2026-07-28-mvp-planning-recap.md](../conversations/2026-07-28-mvp-planning-recap.md) e discussione funzionale in corso).

## Come funziona la gestione OKR in azienda (da conversazione con Diane)

- **Fonte di verità**: Google Sheet condivisi (es. "Company OKRs_H2_2025"), non un tool dedicato.
- **Collegamento a Jira**: le iniziative operative in Jira referenziano l'OKR con un campo tipo "Principale: OKR-164" nel ticket.
- **ID OKR**: formato `OKR-XXX`, con link diretto al ticket Jira corrispondente (vedi screenshot fornito da Diane — colonna "Jira ID").
- Diane userà questi ID come ponte: un campo nello stream OM che referenzia l'OKR aziendale rilevante, più un campo libero per descrivere l'output specifico creato per il business (da popolare più avanti, lista non ancora esistente).

### Esempio di righe viste nello Sheet (screenshot, 5 di N righe)

| Id | Jira ID | Objective |
|----|---------|-----------|
| 1 | OKR-161 | Healthy unitary revenues to push volume growth in Packages and Flights |
| 2 | OKR-162 | Improve and expand our value proposition for Packages |
| 3 | OKR-163 | Keep our customers engaged with our services |
| 4 | OKR-164 | Scale more efficiently and increase our productivity |
| 5 | OKR-165 | Grow our footprint in key markets |

> Nota: questa lista (H2 2025?) non coincide testualmente con gli Objective 2026 qui sotto — sono presi da fonti/periodi diversi. Da chiarire quale sia la lista attuale/valida da usare come dropdown nello stream OM.

## 2026 Annual Company Objectives (da "SAW May 2026 - Company OKRs")

Fonte: [Google Slides — SAW May 2026 - Company OKRs](https://docs.google.com/presentation/d/1aB8-EJlmcvJ7V7HAUsrcdLSbxpNALeaiT-lwGdjM4hw/edit), letto il 28 luglio 2026.

### GROWTH — Increase market share and volumes responsibly
- KR1: Increase the share of DP bookings from directly-contracted supply from 36% to 50%
- KR2: Increase from 13% to 18% market share in family segments in DP on Sun & Beach destinations
- KR3: Increase revenue generated per visit to the booking flow on core channels (€1.11→€1.20 lastminute.com, €0.74→€0.81 blue brands, €0.60→€0.66 weg.de)
- KR4: Increase ancillaries YoY contribution at unitary level (€42.8→€45.9 on DP, €30.8→€35.6 on Flights)

### CUSTOMER — Win customer trust & loyalty via a superior, differentiated experience
- KR1: Expand the "Welcome Back" NPS survey from 4 markets to all Core and Tier 2 markets, raise overall DP NPS from 50 to 52
- KR2: Increase YoY repeat trip rate from 13.5% to 15%
- KR3: Reduce the total Claim Rate (pre and post-travel) from 1.5% to 1.35% of departed bookings

### EFFICIENCY — Build a scalable, efficient company with strong unit economics
- KR1: Integrate 70% of identified critical business rules documents and operational procedures/guidelines into a structured, searchable knowledge base (RAG) accessible to AI Agents
- KR2: Increase the AI Development Maturity Index from 15.5% to 80% by end of 2026
- KR3: Enhance cost efficiency, reducing cost-to-revenue ratio (excl. Marketing/Distribution) from 46.1% to 41.8%

### PEOPLE — Build a high-performance organisation that maximises talent impact, engagement, and cohesion
- KR1: Increase share of employees at AI Profile Level 4/5 supporting AI adoption from 8% to 12%
- KR2: Increase Group-wide Engagement Index from 68% to 72% (Jan 2027 Pulse Check)
- KR3: Keep "Senior Leadership Index" within ±10% of Group average (Jan 2027 Pulse Check)
- KR4: Keep EMEA remote/office connection score within ±10% of HQ result (Jan 2027 Pulse Check)

## Domande aperte per il design dello stream OM

1. Quale lista OKR è quella da usare nel dropdown dello stream — questa (2026 Annual, 4 objective/16 KR) o quella con ID `OKR-16X` (Sheet H2 2025, non ancora letto in full)?
2. Il collegamento è a livello di **Objective** (Growth/Customer/Efficiency/People — 4 opzioni) o di singolo **Key Result** (16 opzioni, più granulare ma cambia ogni ciclo)?
3. Chi aggiorna questa lista quando cambia ciclo OKR (es. H1→H2)? Serve un processo per tenerla sincronizzata in `config/`.
