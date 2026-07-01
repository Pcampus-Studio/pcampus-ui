# Dev loop

One round = one goal = one commit (when possible) + green tests + review.

See **[team-workflow.md](team-workflow.md)** for the full **collaboration cycle** (DEFINE → SHIP). Terminology: [design-spec.md](../03-architecture/design-spec.md) §8.

**DEFINE spine:** [knowledge-loop.md](knowledge-loop.md) — Conversation → Knowledge → Decision → Execution. Use [pcampus-discovery](../../.cursor/skills/pcampus-discovery/SKILL.md) before first goals.

## Macro cycle (project level)

```text
DEFINE → PLAN → EXECUTE → REVIEW → IMPROVE → SHIP → (repeat)
```

## Micro loop (one goal)

```text
┌──────────┐    ┌──────────────┐    ┌────────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
│ Planner  │───▶│ Implementer  │───▶│  Tester    │───▶│ Reviewer│───▶│  Done    │───▶│  Shipper │
│ goal     │    │ + skill      │    │ testing    │    │ review  │    │ changelog│    │ optional │
└──────────┘    └──────────────┘    └────────────┘    └─────────┘    └──────────┘    └──────────┘
```

### 1. Select goal

- Open [../07-backlog/goals.md](../07-backlog/goals.md)
- Pick highest **`ready`** goal whose dependencies are `done` (skip `draft` / `planned`)
- Set goal status → `in_progress` when human says **"เริ่ม step N"** (first execution on a `ready` goal)
- Load acceptance contract `docs/02-product/acceptance/G-xxx.md` if present
- Load matching skill from [skills-library.md](../04-agents/skills-library.md)

### 2. Confirm scope

- **In** / **Out** unambiguous
- Acceptance criteria testable
- If not → Planner updates goal; stop

### 3. Implement

- Read touch map, architecture links, and task skill (API, migration, etc.)
- Code only within scope
- Update `docs/03-architecture/api/` or `data/` when applicable
- No unrelated refactors

### 4. Test (collaboration phase IMPROVE)

- Follow [pcampus-testing](../../.cursor/skills/pcampus-testing/SKILL.md)
- Run goal **Test plan** and `AGENTS.md` **Standard commands**
- Fix failures before proceeding

### 5. Review (collaboration phase REVIEW)

- Set goal status → `review`
- Run [pcampus-code-review](../../.cursor/skills/pcampus-code-review/SKILL.md) (five lenses)
- Human approves → `approved`; or request changes → `in_progress`

### 6. Commit

- One goal per commit; message `G-xxx: description`
- User must request commit in chat
- Agent does not merge

### 7. Close goal

- All **Plan** steps `done`; acceptance criteria `[x]`
- Status → `done` (from `approved` only)
- Move `goals/G-xxx.md` → `goals/_archived/G-xxx.md`; update **Dashboard** in [../07-backlog/goals.md](../07-backlog/goals.md)
- Append row to [../07-backlog/changelog-goals.md](../07-backlog/changelog-goals.md)
- Append audit row to [../07-backlog/changelog.md](../07-backlog/changelog.md)

### 8. Ship (when goal includes deploy)

- Human approves; agent follows [pcampus-deploy-staging](../../.cursor/skills/pcampus-deploy-staging/SKILL.md)
- Smoke test staging; record result

## When to split a goal

Split if estimate > one focused session or touches unrelated modules.

## When to write an ADR

Auth strategy, schema breaking change, new dependency, major architectural choice.

Use [../05-decisions/0000-template.md](../05-decisions/0000-template.md). See [0001-example-postgresql.md](../05-decisions/0001-example-postgresql.md) for format.

## When to write a PDR

MVP scope cut, persona priority, timeline tradeoff, feature deferral, pivot after change intake.

Use [../05-decisions/pdr-0000-template.md](../05-decisions/pdr-0000-template.md). See [pdr-0001-example-mvp-no-notification.md](../05-decisions/pdr-0001-example-mvp-no-notification.md) for format.

## After goal done — learning loop

Run [pcampus-learning-loop](../../.cursor/skills/pcampus-learning-loop/SKILL.md): **`post-ship G-xxx`** → observe metrics/support → update map → draft follow-up goals.

See [knowledge-loop.md](knowledge-loop.md) · [learning-log.md](../02-product/learning-log.md)

## Related

- [knowledge-loop.md](knowledge-loop.md)
- [team-workflow.md](team-workflow.md)
- [definition-of-done.md](definition-of-done.md)
- [../03-architecture/design-spec.md](../03-architecture/design-spec.md)
- [../../AGENTS.md](../../AGENTS.md)
