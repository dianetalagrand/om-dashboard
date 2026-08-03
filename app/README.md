# app/ — the OM application

**Status: scaffold only. There is no running code here yet, and that is on purpose.**

This folder is where the application lives. It is deliberately empty of dependencies until two
things are settled, because both change what gets installed.

## What is already decided

- **Backend: TypeScript on Node.js.** Decided by Nathan on 30 July 2026 — see
  `../conversations/2026-07-30-domain-split-and-stack-pivot.md`.
- **Database: PostgreSQL**, as the system of record from day one. Not a Google Sheet, not a
  bootstrap step.
- **The Google Doc is read exactly once**, to seed the database. After that it is never read or
  written again.

## What is not decided, and blocks the first install

| | Question | Who |
|---|---|---|
| 1 | Frontend framework — is there a company standard, or free choice? | Nathan |
| 2 | Where it is hosted, and who provisions it | Nathan |
| 3 | Who provisions and owns the Postgres instance | Nathan |
| 4 | CI/CD ownership, and whether a company template exists | Nathan |
| 5 | Where credentials live — a vault, or platform environment variables | Nathan |
| 6 | Whether the lastminute-network-only restriction needs a VPN or proxy | Nathan |
| 7 | Custom domain and TLS, monitoring, backup policy | Nathan |

Full text in `../conversations/2026-07-30-domande-per-nathan-stack-infra.md`.

**Can work start before these are answered?** Yes, for a while. The first release (R1 in
`../docs/proposal/om-maps.html`) produces a structured data file from the real OM documents and
needs no database, no hosting and no framework. The second release needs somewhere to keep data,
which can be a local Postgres to begin with. Hosting only becomes blocking when someone outside OM
needs to open it.

## Why there are no dependencies yet

Adding a package is a decision that needs naming and a reason (see `../CLAUDE.md`). Choosing an HTTP
framework, an ORM or a frontend framework before question 1 is answered would mean installing
something and then removing it. `package.json` therefore pins only the Node version.

## Layout

```
app/
├── README.md        this file
├── package.json     no dependencies yet — Node version only
├── .env.example     the shape of the configuration; never commit a real .env
├── src/             application code — see src/README.md
└── db/              schema and migrations — see db/README.md
```

## Before writing the first line of real code

Read `../docs/proposal/om-maps.html`, sections 5 and 7. Section 5 is the vocabulary the code should
use — the same words in the database, the API and the screens. Section 7 gives each release a brief
in plain English, which is what to work from.

One open question changes the central table and has to be answered first: **is a function's input
filed by function, or by kind of impact?** Section 8 explains the trade-off.
