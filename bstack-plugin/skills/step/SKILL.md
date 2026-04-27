---
description: Snapshot the last ~10 minutes of work into docs/steps/step-N-DD-MM-YYYY-HH-MM/ with 6 structured files (user-notes, knowledge, architecture-decisions, lessons-learned, maintenance, step-tasks).
---

Capture the most recent ~10 minutes of work as a durable "step" snapshot so future agents (and the user) can reconstruct context without replaying the whole conversation.

## Execution order (do NOT skip any)

### 1. Start a 10-minute timer

Call the **task-timer MCP** to start a timer named `step-snapshot` for **10 minutes**. Use `mcp__task-timer__timer_start` with duration `10m` (or `600` seconds). This is a wall-clock boundary for the snapshot, not a countdown you must finish inside — but log the timer ID so the user can see it running.

If the task-timer MCP tools aren't loaded, use ToolSearch to load them first: `select:mcp__task-timer__timer_start,mcp__task-timer__timer_list,mcp__task-timer__timer_check`.

### 2. Read the last 3 steps (if they exist)

List existing directories in `docs/steps/` (sorted so the 3 most recent come last by step number). For each of the 3 most recent, read all 6 files. Understand:
- What was done before
- What decisions were made
- What context this step builds on
- What open threads are still running

If fewer than 3 steps exist, read all of them. If `docs/steps/` doesn't exist yet, this is step #1 — note that and skip this read.

### 3. Determine the step number and directory name

- Step number `N` = (count of existing `step-*` dirs in `docs/steps/`) + 1. Zero-pad to 6 digits (`000001`, `000002`, …).
- Datetime = current local date+time, formatted exactly `DD-MM-YYYY-HH-MM` (e.g. `22-04-2026-19-42`). Use the `currentDate` context plus the current clock.
- Final directory name: `step-<N>-<DD-MM-YYYY>-<HH-MM>` (e.g. `step-000001-22-04-2026-19-42`).
- Full path: `docs/steps/<that directory name>/`

### 4. Create the directory and all 6 files

Create the directory, then write exactly these 6 files inside it. Each file must be grounded in what was actually said and done in the last ~10 minutes of the conversation — never invent, never pad.

#### `user-notes.md`
All direct quotes, asks, preferences, and guidelines the user expressed during this window. Each bullet = one distinct note. Include *verbatim* user language in quotes where it captures intent sharply. Also include any implicit signals ("user seemed frustrated about X", "user corrected Y"). This file is the record of the human's voice in this step.

#### `knowledge.md`
General facts, links, identifiers, API endpoints, commands, credentials (placeholders only — never raw secrets), version numbers, UI paths, error messages, and discovery-worthy observations learned during this window. Organize by topic with short headings. Include URLs verbatim so they're copy-pasteable. This file is the reference librarian.

#### `architecture-decisions.md`
Every architectural or design choice made during this window. For each:
- **Decision**: one-line statement of what was chosen
- **Alternatives considered**: the roads not taken
- **Why**: the reasoning or constraint that drove the choice
- **Blast radius**: what it affects (files, services, envs, downstream systems)
- **Reversibility**: trivial / requires migration / one-way door

Include decisions about third-party services (Vercel/Supabase/Google/Meta/etc.), schema, auth, APIs, env vars, CI/CD, and any code/infrastructure pattern. This file is the "why" record.

#### `lessons-learned.md`
Every friction point encountered: bugs, denied permissions, failed assumptions, wrong-first-tries, missing configuration, and surprises. For each:
- **What happened**
- **Root cause** (not just the symptom)
- **Fix / workaround applied**
- **How a future agent avoids this**

Prioritize things that would cost a future agent ≥5 minutes to rediscover. Honest about failures — if Claude assumed something and was wrong, say so. This file is the anti-repetition record.

#### `maintenance.md`
Everything a future maintainer needs to operate, support, debug, and evolve the system end-to-end **based on what this step touched**. Include:
- How to run / deploy / check health (exact commands, URLs)
- Which env vars matter and where they live
- Where logs are
- Where secrets are stored (key names, not values)
- How to roll back this step's changes
- Monitoring / alerting touchpoints
- On-call-style runbook tips relevant to this step's surface area

This file should let someone brand new take over this surface area.

#### `step-tasks.md`
For each discrete task executed during this window:
- **Task**: one-line description
- **State BEFORE**: what the system/codebase/config looked like
- **State AFTER**: what it looks like now
- **Files touched** (full repo-relative paths, with line numbers or symbols where useful)
- **Related prior steps**: pointers into `docs/steps/step-NNN-.../<file>.md` if this builds on earlier work, or "N/A" if fresh
- **Related sibling files in this step**: which of user-notes/knowledge/architecture-decisions/lessons-learned/maintenance have relevant material on this task

This file is the task ledger.

### 5. Quality bar before declaring done

- **Every file has content.** If a category truly has nothing, write `_No entries this step._` rather than leaving empty — prove you considered it.
- **No invented details.** If you don't know something, say so ("TBD" / "unverified") rather than fabricating.
- **Reference real artifacts.** Cite actual file paths, commit hashes, PR numbers, deploy IDs, Supabase refs, Vercel project IDs — not vague descriptions.
- **Cross-links work.** `step-tasks.md`'s pointers into prior steps must match real directory names.

### 6. Report back

After creating all 6 files, reply with:
- The step directory name
- One sentence per file summarizing its top-1 takeaway
- Any category where you had to write `_No entries this step._` and why
- Confirm the timer ID from step 1 so the user can see it running
