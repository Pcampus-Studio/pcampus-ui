# G-xxx: [Short title]

**Status:** draft | planned | ready | in_progress | review | blocked | approved  
**Depends on:** G-yyy or —  
**Blocks:** G-zzz or — *(optional — goals waiting on this one)*

#### Plan

**Collaboration phase:** DEFINE | PLAN | EXECUTE | REVIEW | SHIP *(alias: Pcampus phase)*

| DEFINE | PLAN | EXECUTE | REVIEW | SHIP |
|:------:|:----:|:-------:|:------:|:----:|
| **●** | ○ | ○ | ○ | ○ |

| # | Step | Status |
|---|------|--------|
| 1 | [Mirror work step 1 below] | pending |
| 2 | [Mirror work step 2 below] | pending |
| 3 | [Verify test plan] | pending |

`pending` · `current` · `done` · `blocked` — mark one step `current` during EXECUTE.

## Context

1–3 sentences: where this goal sits (initiative, legacy gap, linked ADR or parent goal). Link specs the agent must read first.

## Intent

**Why:** [Problem or opportunity — what breaks if we skip this?]

**Done when:** [Concrete deliverable — file, behaviour, or doc state]

**Unblocks:** [Downstream goals, repos, or teams]

## Knowledge links

> Sync to [knowledge-map.json](../../02-product/knowledge-map.json) → `goals[]`. **Why** must trace to at least one `P-xxx` or accepted PDR.

| Type | IDs |
|------|-----|
| **Pains addressed** | P-xxx |
| **Decisions** | PDR-xxx, ADR-xxx |
| **Assumptions required** *(must be validated before `ready`)* | A-xxx or — |
| **Evidence** | E-xxx *(optional — supporting)* |

## Context manifest

> **Compiler input** — like `package.json` for compile dependencies. [context-compiler.md](../../03-architecture/context-compiler.md)  
> On `compile G-xxx`, compiler builds progressive `.bundle/G-xxx/cache/G-xxx-{hash}/`.

| Kind | IDs / paths |
|------|-------------|
| **ADR** | ADR-xxx or — |
| **PDR** | PDR-xxx or — |
| **Patterns** | ORG-xxx or — |
| **Acceptance** | `docs/02-product/acceptance/G-xxx.md` |
| **Skills** | `pcampus-rest-api` \| — |
| **Profile** | `backend-api` \| `qa` \| `product` \| `designer` |
| **Task type** | `add_api` \| `modify_existing_api` \| `db_migration` \| `qa_verify` |
| **Playbook** | PB-xxx or — (compiler selects from tags) |
| **Default role** | `developer` \| `qa` \| … |
| **Files** | touch map globs (e.g. `code/src/auth/*`) |
| **Constraints** | C-xxx, `mvp-scope.md#out` or — |

## Work steps

Ordered checklist for **this card only** — human or agent executes the same list. Do not label steps as "human" vs "AI".

1. [First step — e.g. read ADR / confirm dependency goal is done]
2. [Second step — e.g. edit files in touch map]
3. [Third step — run test plan commands]
4. [Handoff / review if needed]

## In

- ...

## Out

- ...

## Contract draft *(optional — API / schema design goals)*

> Remove this section if not applicable. Delta only — link [api/README.md](../../03-architecture/api/README.md) or project contract guide.

| Field / path | Action | Location |
|--------------|--------|----------|
| `...` | ADD / CHANGE / REMOVE | `...` |

### Open questions

- [ ] [Question] → [resolution or link to ADR]

## Acceptance criteria

- [ ] Testable criterion 1
- [ ] Testable criterion 2

## Test plan

- Commands from `AGENTS.md` **Standard commands**
- New/updated test files: `code/...`

## Touch map

- `path/to/...`
- `docs/03-architecture/api/...` (if API changes)
- `docs/03-architecture/data/...` (if domain rules change)

## Notes for AI

- Read: [link to architecture doc or ADR]
- Acceptance contract: [_template.md](../../02-product/acceptance/_template.md) (copy to `G-xxx.md` when `ready`)
- Skill: `pcampus-rest-api` | `pcampus-db-migration` | `pcampus-deploy-staging` | —
- Constraints: [non-obvious boundaries — what not to change]
- **"ทำ G-xxx"** → TodoWrite from Plan steps (chat UI); **`compile G-xxx`** before first **`เริ่ม step N`**
- **`เริ่ม step N`** → read `step-N.md` + `action-step-N.yaml` only — execute, do not replan
- Steps requiring human (UAT, prod verify): note here — agent marks `done` only after human confirms
- Update **Plan** table and [goals.md](../goals.md) **Dashboard** when phase or step changes

Writing guide: [goal-spec-guide.md](../../06-workflows/goal-spec-guide.md)
