# Writing executable goals

> **Goal:** Anyone opening `goals/G-xxx.md` — developer or agent — knows **why**, **what to deliver**, and **what to do in this card** without guessing.

Copy [_template.md](../07-backlog/goals/_template.md) when creating a goal. This guide explains each section.

## Two layers in every goal file (+ chat todo UI)

| Layer | Section | When to update |
|-------|---------|----------------|
| **Goal workflow** | **Plan** (collaboration phase row + step status) | Every session during DEFINE → SHIP |
| **Executable spec** | Context, Intent, Work steps, In/Out, … | When drafting; refine before `ready` |
| **Chat progress UI** | Cursor **TodoWrite** (one item per Plan step) | On **"ทำ G-xxx"** and after each **"เริ่ม step N"** |

**Plan** tracks *where you are in the process*. **Work steps** describe *what to do* — keep them aligned; Plan step 1 should mirror Work step 1. **TodoWrite** mirrors Plan in chat (`2/6`, current step highlighted) — see [pcampus-goal-workflow](../../.cursor/skills/pcampus-goal-workflow/SKILL.md) §0.3.

## Required sections

| Section | Purpose |
|---------|---------|
| **Context** | 1–3 sentences — placement in product, legacy gap, linked ADR/goal |
| **Intent** | **Why** / **Done when** / **Unblocks** |
| **Work steps** | Ordered checklist for **this card only** |
| **In / Out** | Scope boundary (same as MVP **Out** — no scope creep) |
| **Acceptance criteria** | Verifiable — each item testable or reviewable |
| **Test plan** | Real commands from `AGENTS.md` |
| **Touch map** | Paths agent may edit |

## Optional sections

| Section | Use when |
|---------|----------|
| **Knowledge links** | Always — pains, PDR/ADR, assumptions; sync [knowledge-map.json](../02-product/knowledge-map.json) |
| **Context manifest** | Always when `ready`+ — compiler input; see [context-compiler.md](../03-architecture/context-compiler.md) |
| **Blocks** (header metadata) | Other goals wait on this one |
| **Contract draft** | API/schema design — delta table + snippets only |
| **Open questions** | Resolve before `ready` or document in ADR |
| **Notes for AI** | Non-obvious constraints, anti-patterns |

Do **not** label steps as "human" or "AI" — the card owns the work.

## "ทำ G-xxx" vs "เริ่ม step N"

| Command trigger | Meaning |
|---------|---------|
| **ทำ G-xxx** | Read goal file → **TodoWrite** → ≤3 lines. **No code, no promote nag, no repo explore.** |
| **hydrate G-xxx** / **compile G-xxx** / **resolve G-xxx** | Compile progressive action bundles to `.bundle/` |
| **เริ่ม step N** / **ทำต่อ G-xxx** | `step-N.md` + `action-step-N.yaml` → execute (if `ready`+) |
| **continue G-xxx** | Incremental — [working-memory.md](../03-architecture/working-memory.md) |
| **brief G-xxx** | Full Plan briefing (optional) |

Add to goal **Notes for AI** which steps need human (UAT, approval) before marking `done`.

## Intent — bad vs good

**Bad:**

```markdown
## Intent
Add user auth — part of MVP.
```

**Good:**

```markdown
## Intent

**Why:** Mobile clients cannot call protected routes — every feature goal is blocked.

**Done when:** `POST /auth/login` returns JWT; `GET /health` unchanged; contract in `docs/03-architecture/api/`.

**Unblocks:** G-004 (profile), G-005 (orders).
```

## Knowledge links — required for `ready`

Link **Intent → Why** to map IDs. Run **`knowledge audit`** before promote.

```markdown
## Knowledge links

| Type | IDs |
|------|-----|
| **Pains addressed** | P-002 |
| **Decisions** | PDR-001, ADR-003 |
| **Assumptions required** | — |
```

## Work steps — design goal (docs / contract only)

1. Read linked ADR and dependency goals.
2. Apply contract draft delta in touch map paths.
3. Cross-check with existing code or schema (read-only).
4. Update acceptance criteria if scope shifted.
5. Hand off for human review before implement goals start.

## Work steps — implement goal

1. Confirm goal is `ready` and dependencies are `done`.
2. Set Plan step 1 → `current`; execute Work steps in order.
3. Edit **touch map** only; run **test plan**.
4. Set goal → `review`; run [pcampus-code-review](../../.cursor/skills/pcampus-code-review/SKILL.md).
5. After human `approved` → `done` → move file to `goals/_archived/`.

## Contract draft (API projects)

For OpenAPI/GraphQL/protobuf goals, put **delta only** in the goal — not the full spec.

| Field / path | Action | Location |
|--------------|--------|----------|
| `User.email` | ADD | `components/schemas/User` |

Link the canonical contract doc in `docs/03-architecture/api/`. Implementation goals reference the frozen contract, not a duplicate paste.

Project-specific contract playbooks may live in `docs/03-architecture/api/` (e.g. `goal-openapi-draft-guide.md` at bootstrap).

## Related

- [_template.md](../07-backlog/goals/_template.md)
- [acceptance-template.md](../02-product/acceptance-template.md)
- [goal-spec-guide.md](goal-spec-guide.md) (this file)
- [pcampus-goal-workflow](../../.cursor/skills/pcampus-goal-workflow/SKILL.md)
- [dev-loop.md](dev-loop.md)
