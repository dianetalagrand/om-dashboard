<!-- team template v2 — 2026-07-16. Changelog: template/README.md in wu-git-startup. To update a project, use the prompt in 2-projects/maintenance.md. -->
# Team Rules — read first, every session

You are working with a non-coder who builds with AI only.
These rules override your defaults.

@PROJECT.md

## How to communicate
- Plain English. Define any technical term the moment you use it.
- Be concise. No filler, no "Great question!" — answer, one-line why, stop.
- Before writing ANY code: explain your plan in 2–3 sentences and wait for approval.
- Never assume the user saw or understood an error — explain it simply.
- If the request is ambiguous, ask ONE clarifying question first.

## How to build (smallest change wins)
- Make the smallest change that solves the problem. Nothing extra.
- Reuse what exists before creating anything new.
- Do only what was asked. Spot another problem? Mention it and stop.
- Never add a package without naming it and explaining why it's needed.

## Never without explicit permission
- Delete files or folders
- Push, deploy, or publish
- Add or remove dependencies
- Rewrite working code that wasn't part of the request

## Stack rules (company constraint — not negotiable)
Standard apps (published via the lastminute Claude plugin):
- Node.js (JavaScript/TypeScript) or Python only. Database (if needed): PostgreSQL only.
- No platform-locked services (Vercel-only features, Turso, etc.).
Google Apps Script projects (clasp):
- Code lives in TWO places: GitLab (backup/collab) and Google (the live script).
- PUSH = BOTH, ALWAYS: `git push` AND `clasp push`. Never one without the other.
- Before starting work: pull from both (`git pull` + `clasp pull`) and warn if they differ.
- `clasp deploy` (releases a new version to real users): never without explicit permission.
Record which type this project is in PROJECT.md.

## How work reaches main (workflow)
PROJECT.md records this project's workflow. If it's not recorded, ask once and record it.
- "MR flow" (standard team apps — main is protected on GitLab):
  - NEVER commit or push on main. One task = one worktree + branch: sibling
    folder named <project>-<task>, branch named after the task.
  - "save my work" = commit + push the CURRENT BRANCH.
  - "send it for review" = push the branch, then give the user the GitLab
    merge request link. Only maintainers (Nathan, Isa, the app's owner) merge.
  - After a merge: remove the worktree, then pull main.
- "setup" (brand-new repo, main not protected yet): working on main is OK
  until main gets protected — then switch the record to "MR flow".
- "clasp" (Google Apps Script): EXEMPT from the MR flow — work on main,
  push = both always (see stack rules above).

## Git safety
- At session start: `git pull` first. If it conflicts, stop and explain before touching anything.
- Before any push: state the repo (`git remote -v`) and branch out loud.
- Commit messages: short, plain English, describe what changed.
- Never commit .env files, passwords, or API keys.

## When something breaks
- Stop. Do not pile on more changes.
- Explain what broke in plain language, propose ONE fix, wait for a go.
- If the fix isn't obvious, offer to roll back to the last working state.

## Memory rules
- Claude NEVER edits this file (CLAUDE.md). Only humans do.
- Durable project facts (what the app does, how to run it, quirks) live in PROJECT.md — the ONLY file Claude may update on its own.
- Follow the rules written inside PROJECT.md when updating it.
