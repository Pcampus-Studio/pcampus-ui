---
name: pcampus-goal-workflow
version: "1.8.0"
description: >-
  Executes the Pcampus one-goal-per-round dev workflow: 1 goal = 1 file in
  docs/07-backlog/goals/G-xxx.md; on done move to goals/_archived/. Pick or draft
  a goal first, confirm scope, implement only after an explicit G-xxx is approved,
  run tests, close goal with changelog. Use when the user mentions G-xxx goals,
  backlog items, "next goal", "ต่อ G-", closing a goal, committing goal work,
  or describes feature work without a goal ID (draft goal only).
---

# Goal workflow

One round = **one goal** = **one commit** (when possible) + green tests + human approval.

Always read first during collaboration phase EXECUTE: **compiled action bundle** — not AGENTS.md + full repo. See §0.4 [context-compiler.md](../../../docs/03-architecture/context-compiler.md). Terminology: [design-spec.md](../../../docs/03-architecture/design-spec.md) §8.

**Layout:** 1 goal = 1 file = 1 outcome. Active → `docs/07-backlog/goals/G-xxx.md`. On `done` → move to `docs/07-backlog/goals/_archived/G-xxx.md` and update [goals.md](../../../docs/07-backlog/goals.md) queue.

## 0. Goal gate (mandatory — read before any code)

**No goal → no application code.**

| Situation | Agent must |
|-----------|------------|
| User describes a change **without** `G-xxx` | **Stop.** No `code/`. If new product / empty brief / command trigger `discover` → [pcampus-discovery](../pcampus-discovery/SKILL.md). Else create or update `docs/07-backlog/goals/G-xxx.md` (`draft` / `planned`) and index row in `goals.md`. Summarize In/Out/touch map/acceptance criteria. |
| Command trigger `discover` / `สัมภาษณ์` / `intake change` | [pcampus-discovery](../pcampus-discovery/SKILL.md) — collaboration phase DEFINE; docs only |
| User says "อยากให้…", "ช่วยทำ…", workflow skill only | Treat as collaboration phase **PLAN** — goal doc only unless they also say **"ทำ G-xxx"** / **"implement G-xxx"** / **"เริ่มทำ G-xxx"**. |
| User says **"ทำ G-xxx"** / **"เริ่มทำ G-xxx"** | **Fast path** (§0.2): read goal file → **TodoWrite** → ≤3 lines in chat. **No `code/`**. **No promote nag.** |
| User says **"ทำต่อ G-xxx"** / **"เริ่ม step N"** | Compile step bundle if missing (§0.4) → read `step-N.md` + `action-step-N.yaml` → execute |
| User says **"compile G-xxx"** / **hydrate** / **resolve** | ContextCompilerService → `.bundle/G-xxx/` — no code |
| User says **"continue G-xxx"** | `delta()` only — no full recompile |
| User says **"set goal"** / **"สร้าง goal"** | Only edit `docs/07-backlog/goals/G-xxx.md`, `goals.md` index, and acceptance contract if promoting to ready. No `code/`. |
| Goal is `draft` / `planned` | **"ทำ G-xxx"** still shows todos. Block **code** only on **"เริ่ม step N"** — not on todo display |
| Goal is `blocked` | Stop — wait for human to unblock. |
| Goal is `done` (in `_archived/`) | Do not re-implement unless user opens a new goal. |
| Goal not **`ready`** | Do **not** self-pick. **"ทำ G-xxx"** on a named goal → show todos anyway. **"เริ่ม step N"** → stop if not `ready` |

**Wrong:** User asks for `/store/products` skeleton → agent edits `page.tsx` immediately.  
**Right:** Add **G-113** as `draft`, show acceptance criteria, wait for **"ทำ G-113"**.

If agent already changed code without a goal → report that to the user; offer to revert or fold changes under a new goal after human approves.

## 0.2 "ทำ G-xxx" = show step todos (fast path)

**Deliverable:** Cursor **todo list** at the top of chat — human reads progress there. Chat text is **short**.

When the user says **"ทำ G-xxx"** / **"เริ่มทำ G-xxx"**:

1. Read **only** `docs/07-backlog/goals/G-xxx.md` — **Plan** step table (or **Work steps** if no Plan table)
2. **TodoWrite** (`merge: true`) — one todo per step (§0.3) — **first tool call**
3. Reply **≤3 lines** — e.g. `G-xxx · {status} · step {n}/{total} — {current title}`
4. **Stop.** No `code/` edits unless the same message also says **"เริ่ม step N"** / **"ทำต่อ G-xxx"**

### Do NOT on "ทำ G-xxx" (saves tokens)

- Do **not** explore `code/`, run broad searches, or re-read `AGENTS.md` / `mvp-scope.md` / `goals.md` Dashboard
- Do **not** output the full Plan briefing template — todos **are** the UI
- Do **not** nag **"promote ready"** — that is only for **"promote G-xxx ready"**
- Do **not** change goal status, Dashboard, or Plan rows — **read-only** display turn

| Goal status | On "ทำ G-xxx" |
|-------------|---------------|
| any (incl. `draft` / `planned`) | TodoWrite from file → ≤3 lines |
| `blocked` | Same + one line: blocker |
| archived / `done` | One line: goal archived |

**Wrong:** User says "ทำ G-022" → agent reads 10 files, explores repo, lectures promote, pastes long briefing.  
**Right:** Read `G-022.md` → TodoWrite → `G-022 · in_progress · step 2/6 — Add migration`.

### Optional full briefing

Only when human asks **"brief G-xxx"** / **"สรุป G-xxx"** — then use [Plan briefing template](#plan-briefing-template-optional).

## 0.4 Context compiler — recipes + working memory (mandatory in collaboration phase EXECUTE)

**Goal:** reduce **cognitive load** — agent follows recipe checklist; does not translate bundle → plan.

```text
Knowledge → Bundle (compile once) → Working Memory (runtime) → Delta → Agent
```

Full spec: [context-compiler.md](../../../docs/03-architecture/context-compiler.md) · [working-memory.md](../../../docs/03-architecture/working-memory.md)  
Recipes: [execution-recipes](../../../docs/04-agents/execution-recipes/README.md) · Playbooks: [playbooks](../../../docs/04-agents/playbooks/README.md)  
Capabilities: [agent-capabilities](../../../docs/04-agents/agent-capabilities/README.md) · IR: [compiler-ir.md](../../../docs/03-architecture/compiler-ir.md)  
Coordination: [coordination.md](../../../docs/03-architecture/coordination.md) · Shared memory: [working-memory.md](../../../docs/03-architecture/working-memory.md)

### Compile inputs (capability-aware)

```text
compile(goal, step?, role?, agent?, mode?, task_type?, profile?, agent_capability?)
```

`mode` = **bundle mode** (`execute` default on **"เริ่ม step N"**). See [context-compiler.md](../../../docs/03-architecture/context-compiler.md) § Bundle mode.

| Capability | When |
|------------|------|
| `matchPlaybook(tags)` | PB-xxx → REC list |
| `getAgentScore(agent, skill)` | Capability matrix variant |
| `compile(...)` | IR pass pipeline |
| `patchSharedMemory(section)` | Multi-agent handoff |
| `initSharedMemory(G-xxx, N)` | From recipe checklist |
| `updateSharedMemory(patch)` | After each turn |
| `scoreBundle()` | Trim if >2500 tokens |
| `cacheLookup(source_hash)` | Reuse compile cache |
| `delta(G-xxx)` | **continue** — delta + memory only |

### Action bundle + recipe (per step)

`action-step-N.yaml` must include: `recipe`, `checklist`, `completion`, `objective`, `allowed_files`, `exit_when`.

Agent **follows checklist in order** — do not invent steps.

### เริ่ม step N — agent reads

```text
step-N.md
action-step-N.yaml
shared-memory.yaml   (init execution section from checklist)
+ allowed_files (≤5)
```

### continue G-xxx — agent reads

```text
shared-memory.yaml
delta.md
+ changed files only
```

**Do not** re-read full bundle or goal on continue.

### Runtime layout

```text
.bundle/G-xxx/
  shared-memory.yaml      # multi-agent handoff (primary)
  cache/G-xxx-{hash}/     # IR — stable compile output
    step-N.md
    action-step-N.yaml
    score.json
  delta.md
```

### Token / cognition rules

| Command | Read | Plan? |
|---------|------|-------|
| **ทำ G-xxx** | goal file | No |
| **compile G-xxx** | compiler only | No |
| **เริ่ม step N** | step + action + init memory | **Follow recipe** |
| **continue** | memory + delta | **Resume checklist** |

**Forbidden during collaboration phase EXECUTE:** replan from ADR, full bundle re-read on continue, knowledge-map.

### Sync flow

```text
"ทำ G-xxx"       →  goal  →  TodoWrite
"compile G-xxx"  →  bundle cache + recipes
"เริ่ม step N"   →  compileStep  →  initWorkingMemory  →  execute checklist
"continue G-xxx" →  working-memory + delta  →  execute
```

### Plan briefing template (optional)

Copy this structure into every briefing reply (fill from the goal file):

```markdown
### G-xxx — {title}
**Status:** `{status}` · **Collaboration phase:** {DEFINE|PLAN|EXECUTE|REVIEW|SHIP} · **Step:** {n} / {total} — {step title}

| DEFINE | PLAN | EXECUTE | REVIEW | SHIP |
|:------:|:----:|:-------:|:------:|:----:|
| {● or ○} | ... | ... | ... | ... |

| # | Step | Status |
|---|------|--------|
| 1 | {step title} | pending / **current** / done |
| 2 | ... | ... |

**Acceptance (unchecked):**
- [ ] ...

**Touch map:** `path1`, `path2`, ...

**Gaps before work:** {e.g. still draft, missing acceptance contract, blocked dep}

**Next:** พิมพ์ `เริ่ม step {n}` เพื่อให้ agent ลงมือ step นี้ (หรือ `promote G-xxx ready` ถ้ายังไม่ ready)
```

**Next:** `เริ่ม step {n}` · `promote G-xxx ready` · `brief G-xxx`
```

## 0.3 Cursor todo list = Plan progress UI (mandatory on "ทำ G-xxx")

The **step tracker at the top of chat** (`2/6`, ✓ done, → current) = **TodoWrite** synced from the goal **Plan** table.

### Build todos (do this immediately)

1. Parse **Plan** step table in `goals/G-xxx.md` (or **Work steps** if Plan empty).
2. **TodoWrite** (`merge: true`) — one todo per step:

| Todo `id` | Todo `content` | Todo `status` |
|-----------|----------------|---------------|
| `G-xxx-step-1` | `Step 1: {title}` | from plan row |
| `G-xxx-step-2` | `Step 2: …` | … |

| Plan row | TodoWrite |
|----------|-----------|
| `done` | `completed` |
| `current` | `in_progress` |
| `pending` | `pending` |

If no step is `current` yet, all todos `pending` (or `completed` for done rows). **Do not** auto-mark step 1 `in_progress` on display-only **"ทำ G-xxx"**.

### When to call TodoWrite

| Event | Action |
|-------|--------|
| **"ทำ G-xxx"** | TodoWrite from file — **read-only**; ≤3 lines chat |
| **"เริ่ม step N"** (goal `ready`+) | Set step N `in_progress` in todos + Plan; then implement |
| **Step N done** | Todo + Plan row → `completed`/`done`; next stays `pending` until **"เริ่ม step N+1"** |
| **Goal closed** | All todos `completed` |

### Sync on execution only

```text
"ทำ G-xxx"     →  goals/G-xxx.md (read)  →  TodoWrite  →  short chat
"compile G-xxx" →  .bundle/ cache (write)
"เริ่ม step N"  →  step-N.md + action-step-N.yaml  →  implement  →  TodoWrite + Plan
"continue G-xxx" →  delta.md + changed files only
```

**Wrong:** Long briefing + promote lecture + codebase explore on **"ทำ G-xxx"**.  
**Right:** TodoWrite visible in chat; human says **"เริ่ม step 3"** when ready to code.

## 1. Select goal

1. Open [goals.md](../../../docs/07-backlog/goals.md) index → open the goal file `docs/07-backlog/goals/G-xxx.md`
2. Pick highest **`ready`** goal whose **Depends on** goals are **`done`** (archived = done; skip **`draft`** / **`planned`**)
3. On **"ทำ G-xxx"** → fast path (§0.2): todos only — do not auto-set `in_progress` or change Dashboard
4. Load `docs/02-product/acceptance/G-xxx.md` if linked

If scope is unclear → stop and clarify; do not implement.

### Draft a new goal (no code)

1. Assign next **G-xxx** ID; copy [_template.md](../../../docs/07-backlog/goals/_template.md) → `goals/G-xxx.md` (`draft` / `planned` by default); follow [goal-spec-guide.md](../../../docs/06-workflows/goal-spec-guide.md)
2. Fill **In**, **Out**, **Touch map**, **Acceptance criteria**, **Test plan**, **Depends on**
3. Add row to **Active queue** and **Dashboard** in [goals.md](../../../docs/07-backlog/goals.md)
4. When promoting to `ready`, create acceptance contract from [_template.md](../../../docs/02-product/acceptance/_template.md)
5. Tell human: say **"ทำ G-xxx"** when approved

## 2. Confirm scope (before coding)

Run after compile — from **action-step-N.yaml** + `step-N.md`, not repo crawl.

| Field | Source |
|-------|--------|
| **Objective** | `action.objective` |
| **Files** | `allowed_files` only |
| **Avoid** | `avoid` globs — hard boundary |
| **Exit** | `exit_when` — step done when all true |
| **Task skill** | `action.skills` only |

**Stop** if acceptance criteria are ambiguous — update goal first (Planner role).

## 3. Implement

**Only after** human says **"เริ่ม step N"** / **"ทำต่อ G-xxx"** (goal **`ready`** or **`in_progress`**).

1. **compileStep** if `action-step-N.yaml` missing or `source_hash` changed
2. **scoreBundle** — trim if >2500 tokens
3. **initWorkingMemory** from recipe `checklist`
4. Read **`step-N.md`** + **`action-step-N.yaml`** — follow checklist in order
5. **continue G-xxx** → **`shared-memory.yaml`** + `delta.md` only
6. **patchSharedMemory** after each meaningful action

- If goal not `ready` → one line: not ready; use **"promote G-xxx ready"** — **do not** re-show todos or re-explore

- Execute **only** the step marked `current` — do not mark multiple steps `done` in one turn
- **TodoWrite:** step N → `in_progress` at start, → `completed` when step finishes (§0.3)
- Smallest correct diff; no drive-by refactors
- Match `docs/03-architecture/folder-structure.md`
- Follow [governance.mdc](../../../.cursor/rules/governance.mdc) execution boundaries
- Follow constraints in goal **Notes for AI**
- **Update Plan & Dashboard** when starting, finishing, or blocking a plan step (see below)
- Load task skill when applicable:

| Goal type | Skill |
|-----------|-------|
| API endpoints | [pcampus-rest-api](../pcampus-rest-api/SKILL.md) |
| Schema / DB | [pcampus-db-migration](../pcampus-db-migration/SKILL.md) |
| Deploy / staging | [pcampus-deploy-staging](../pcampus-deploy-staging/SKILL.md) |

## 4. Test (IMPROVE)

Run [pcampus-testing](../pcampus-testing/SKILL.md) — commands from goal **Test plan** and `AGENTS.md` **Standard commands**.

- Verify acceptance contract scenarios
- Add tests from goal **Test plan**; test behavior, not constants
- Fix all failures before proceeding

## 5. Review (collaboration phase REVIEW)

1. Set goal status → **`review`**
2. Run [pcampus-code-review](../pcampus-code-review/SKILL.md)
3. Human approves → **`approved`**

Do not mark `done` without human approval.

## 6. Commit (only when user asks)

- One goal per commit; message: `G-xxx: imperative description`
- Stage only files from **Touch map** (+ goal/changelog docs)
- Do not commit unless user explicitly requests
- Do not merge — human merges

## 6b. Open PR (only when user asks)

GitHub pre-fills [pull_request_template.md](../../../.github/pull_request_template.md) — **you must replace every placeholder** before `gh pr create`. Empty template shells fail CI.

1. Title: `G-xxx: imperative summary`
2. Body: replace `G-___`, fill **Summary** and **Test plan**; tick checklist items that apply
3. Prefer:

```bash
gh pr create --title "G-xxx: ..." --body-file /tmp/pr-body.md
```

(`/tmp/pr-body.md` = filled template, not the raw file from repo)

4. Agent creates PR; **human** reviews checklist and merges

## 7. Close goal

1. Check acceptance criteria `[x]` in `docs/07-backlog/goals/G-xxx.md`; all **Plan** steps `done`
2. Set status → **`done`** (only from **`approved`**)
3. **Move** `G-xxx.md` → `docs/07-backlog/goals/_archived/G-xxx.md`; remove **Dashboard** + **Active queue** rows in [goals.md](../../../docs/07-backlog/goals.md)
4. Append row to [changelog-goals.md](../../../docs/07-backlog/changelog-goals.md):

```markdown
| G-xxx | YYYY-MM-DD | <hash or —> | One-line summary |
```

5. **Learning hook:** One line → **`post-ship G-xxx`** or **`learn`** ([pcampus-learning-loop](../pcampus-learning-loop/SKILL.md)). Do not auto-run unless asked.
6. TraceabilityService → sync goal trace for G-xxx — see [knowledge-services.md](../../../docs/03-architecture/knowledge-services.md)
7. Append audit row to [changelog.md](../../../docs/07-backlog/changelog.md) if not already logged
8. Update [00-project-snapshot.md](../../../docs/00-project-snapshot.md) if architecture or active goals changed
9. Report summary; wait for commit instruction if not yet committed

## Plan & Dashboard (update every session)

Keep progress visible in:

| Place | When to update |
|-------|----------------|
| **Cursor TodoWrite** | **"ทำ G-xxx"** (read sync) + after each **"เริ่ม step N"** |
| `goals/G-xxx.md` → **Plan** | On step execution only — not on display-only **"ทำ G-xxx"** |
| `goals.md` → **Dashboard** | When phase/status actually changes (promote, execute, review, done) |

**When to update**

| Event | Dashboard collaboration phase | Plan step |
|-------|-----------------|-----------|
| Goal drafted | DEFINE **●** | all `pending` |
| Promoted `ready` | PLAN **●** | — |
| Human **"ทำ G-xxx"** | (unchanged) | (unchanged) — todos only |
| Human **"เริ่ม step N"** (first on `ready`) | EXECUTE **●**; goal status → `in_progress` | step N → `current`, then `done` |
| Tests green, handoff | REVIEW **●** | — |
| Human `approved` | REVIEW ✓ | — |
| `done` + archived | remove Dashboard row | all `done` |
| Blocked | add ⏸ on step | status `blocked` |

Only one step `current` at a time. Add brief audit notes under **Plan** when a step produces findings.

## 8. Ship (deploy goals only)

If goal **In** includes staging deploy → [pcampus-deploy-staging](../pcampus-deploy-staging/SKILL.md) after human approval. Do not mark deploy goals done until smoke tests pass. Never deploy production without explicit human authorization.

## Command triggers (user says → do)

| Command trigger | Do |
|-----------|-----|
| "ทำ G-xxx" / "เริ่มทำ G-xxx" | §0.2 **TodoWrite + ≤3 lines** — read-only; no promote nag |
| "brief G-xxx" / "สรุป G-xxx" | Optional full Plan briefing template |
| "ทำต่อ G-xxx" / "เริ่ม step N" | Execute step (§3) if `ready`+ → TodoWrite + Plan |
| "promote G-xxx ready" | Set `ready`; **trace G-xxx** + coverage; **arch impact check G-xxx** ([pcampus-architecture-governance](../pcampus-architecture-governance/SKILL.md)); acceptance contract — human approves |
| "set goal" / "สร้าง goal" / describes feature, no G-xxx | Draft `G-xxx.md` + index row only — **no code** |
| "commit G-xxx" | Git commit only; follow `commits.mdc` |
| "สร้าง PR" / "open PR G-xxx" | §6b — fill template; `gh pr create`; do not merge |
| `review G-xxx` | Set goal status `review`; run code-review skill |
| "approve G-xxx" / "UAT pass G-xxx" | Human decision → `approved` or mark UAT step `done` |
| "post-ship G-xxx" / "observe" / "learn" | [pcampus-learning-loop](../pcampus-learning-loop/SKILL.md) — no unscoped code |
| "ทำให้สวย / refactor ทั้ง repo" | Stop — ask for goal ID or draft new goal |
| Attaches this skill + feature request, no G-xxx | **Goal first** (§0) — do not implement |

## Related

- [docs/06-workflows/goal-spec-guide.md](../../../docs/06-workflows/goal-spec-guide.md)
- [docs/06-workflows/team-workflow.md](../../../docs/06-workflows/team-workflow.md)
- [docs/06-workflows/dev-loop.md](../../../docs/06-workflows/dev-loop.md)
- [docs/06-workflows/definition-of-done.md](../../../docs/06-workflows/definition-of-done.md)
- [governance.mdc](../../../.cursor/rules/governance.mdc)
