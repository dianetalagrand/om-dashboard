# src/ — application code

Empty for now. This file records where things are meant to go, so that a future session does not have
to re-derive it.

## Use the same words everywhere

The vocabulary in `../../docs/proposal/om-maps.html` section 5 should appear unchanged in the table
names, the API paths and the screens. If the app says "stream" and the database says "activity", the
next person has to hold a translation table in their head.

The words: **stream**, **decision**, **forum**, **assessment**, **delivery step**, **what it
changes**, **the setup**, **digest**.

## Two sides, kept separate

Nathan's decision of 30 July was to build these as two verticals, not as one shared screen with a
data model under it:

- **Gestione OM** — the working side. Diane and Nathan only. Opening streams, chasing input,
  escalating, following through.
- **Visualizzazione OM** — the reading side. Anyone on the lastminute network, no login. Search,
  and a readable page per stream.

They share a database. They do not share screens, and it is fine if they do not share much code.

## What the first real code should be

R1 in section 7 of the proposal: read the OM Streams Log and the Decisional Framework, and turn the
34 streams and 4 dossiers into structured data. It needs no database and no framework — a script and
an output file. Its purpose is to test the model against the real work before any schema is
committed to.

The rule for R1: **a field that cannot be filled from the real documents gets cut from the model.**
