# db/ — schema and migrations

Empty for now, and there is a specific reason: **one open question decides the shape of the central
table**, so writing the schema first would mean rewriting it.

## The question that blocks the schema

Is a function's input on a stream filed **by function** or **by kind of impact**?

- The OM Streams Log files it by function — `Legal:`, `Fiscal:`, `DPO:`, `HR:`, `IT & Platform:`
- The C-Team package in the Decisional Framework files it by impact — financial, fiscal, legal and
  DPO, reputational

They are the same content, framed for two different audiences. The recommendation is to file by
function and tag each row with a kind of impact, so the C-Team view can group by impact — but that
is Diane's call. Section 8 of `../../docs/proposal/om-maps.html`.

## What the tables will be

From section 5 of the proposal, and only as a sketch — not a commitment:

| Table | Holds |
|---|---|
| `streams` | one row per change to the operating model: category, stage, what set it off, dates |
| `assessments` | one row per function per stream: state and text |
| `decisions` | what was chosen, why, in which forum, on what date |
| `forums` | C-Team, OM Committee, OM Table, GDPR Core, ERM |
| `delivery_steps` | steps owned by teams outside OM, with the date last checked |
| `stream_changes` | which parts of the setup a stream will move — tags, from controlled lists |
| `setup_cells` | how the group is arranged today. **Later** — see below |

## Three dates, not one

The current spec collapses these, and that is a real bug to avoid repeating:

- **when the decision was taken** — `decision_taking_date` in the Decisional Framework
- **when the change came into force** — repeatable. Greece landed in two phases, 13/08/2025 and
  01/06/2026
- **any technical go-live** — separate again
- closing the stream is a fourth event, and it is not the same as the change coming into force

## Why `setup_cells` is last

Not a technical reason. The market setup is only written up for **France and Spain**; everywhere else
it has to be collected from Legal, Tax and DPO market by market. No choice of tooling shortens that.

But `stream_changes` goes in from the start. It costs almost nothing, needs no `setup_cells` to
exist, and it is the only thing that would otherwise have to be filled in again across 34 streams
later.
