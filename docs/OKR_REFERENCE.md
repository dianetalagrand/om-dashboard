# OKR Reference — material for the OKR ↔ OM Stream bridge

Reference material for linking OM streams to company OKRs (see the decision log in [conversations/2026-07-28-mvp-planning-recap.md](../conversations/2026-07-28-mvp-planning-recap.md) and the ongoing functional discussion).

## How OKR management works at the company (from conversation with Diane)

- **Source of truth**: shared Google Sheets (e.g. "Company OKRs_H2_2025"), not a dedicated tool.
- **Jira link**: operational initiatives in Jira reference the OKR via a field like "Principale: OKR-164" in the ticket.
- **OKR ID**: format `OKR-XXX`, with a direct link to the corresponding Jira ticket (see the screenshot Diane provided — "Jira ID" column).
- Diane will use these IDs as the bridge: a field on the OM stream referencing the relevant company OKR, plus a free-text field describing the specific output created for the business (to be populated later — the list doesn't exist yet).

### Example rows seen in the Sheet (screenshot, 5 of N rows)

| Id | Jira ID | Objective |
|----|---------|-----------|
| 1 | OKR-161 | Healthy unitary revenues to push volume growth in Packages and Flights |
| 2 | OKR-162 | Improve and expand our value proposition for Packages |
| 3 | OKR-163 | Keep our customers engaged with our services |
| 4 | OKR-164 | Scale more efficiently and increase our productivity |
| 5 | OKR-165 | Grow our footprint in key markets |

> Note: this list (H2 2025?) doesn't textually match the 2026 Objectives below — they come from different sources/periods. Still to clarify which is the current/valid list to use as the dropdown on the OM stream.

## 2026 Annual Company Objectives (from "SAW May 2026 - Company OKRs")

Source: [Google Slides — SAW May 2026 - Company OKRs](https://docs.google.com/presentation/d/1aB8-EJlmcvJ7V7HAUsrcdLSbxpNALeaiT-lwGdjM4hw/edit), read on 28 July 2026.

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

## Open questions for the OM stream design

1. Which OKR list should be used in the stream's dropdown — this one (2026 Annual, 4 objectives/16 KRs) or the one with `OKR-16X` IDs (H2 2025 Sheet, not yet read in full)?
2. Is the link at the **Objective** level (Growth/Customer/Efficiency/People — 4 options) or the individual **Key Result** level (16 options, more granular but changes every cycle)? — **Asked Nathan, awaiting his answer.**
3. Who updates this list when the OKR cycle changes (e.g. H1→H2)? Needs a process to keep it in sync in `config/`.
