# Dev agent roles (Cursor)

How humans and Cursor agents collaborate using the Pcampus goal-driven framework.

Multi-tool setup (Claude governance + Antigravity + Cursor): [multi-agent-model.md](multi-agent-model.md)  
Framework: [design-spec.md](../03-architecture/design-spec.md) · Skills: [skills-library.md](skills-library.md)

## Planner

**When:** New project, new feature area, unclear scope, change intake, or backlog empty.

**Reads:** [../01-vision.md](../01-vision.md), [../02-product/project-brief.md](../02-product/project-brief.md), [../02-product/knowledge-digest.md](../02-product/knowledge-digest.md), [../02-product/assumptions.md](../02-product/assumptions.md), [../02-product/mvp-scope.md](../02-product/mvp-scope.md), architecture overview.

**Does:**

- Run discovery interview via [pcampus-discovery](../../.cursor/skills/pcampus-discovery/SKILL.md) — distill knowledge, manage assumptions, write PDRs
- Break work into goals using [../02-product/acceptance-template.md](../02-product/acceptance-template.md)
- Order dependencies in [../07-backlog/goals.md](../07-backlog/goals.md)
- Flag open technical decisions for ADR; product scope cuts for PDR in [../05-decisions/](../05-decisions/)

**Does not:** Write production code without a goal; store raw meeting transcripts in docs.

**Handoff:** Brief + mvp-scope locked; critical assumptions validated or tracked; goal `ready` with acceptance criteria and test plan.

---

## Implementer

**When:** Goal status is `ready` or `in_progress`.

**Reads:** Active goal + linked architecture docs + matching **pcampus-** skill.

**Does:** Implement **In** scope only; small diffs; update `api/` or `data/` docs when applicable.

**Does not:** Expand MVP scope; combine goals in one commit.

**Skills:** [pcampus-goal-workflow](../../.cursor/skills/pcampus-goal-workflow/SKILL.md), [pcampus-rest-api](../../.cursor/skills/pcampus-rest-api/SKILL.md), [pcampus-db-migration](../../.cursor/skills/pcampus-db-migration/SKILL.md)

---

## Tester

**When:** Implementer declares code complete for a goal.

**Does:** Follow [pcampus-testing](../../.cursor/skills/pcampus-testing/SKILL.md) and [definition-of-done.md](../06-workflows/definition-of-done.md).

---

## Reviewer

**When:** Before marking goal `done` or merging.

**Does:** Run [pcampus-code-review](../../.cursor/skills/pcampus-code-review/SKILL.md); verify one goal ↔ one commit; touch map respected.

**Handoff:** Human approval before commit / close.

---

## Shipper

**When:** Goal **In** scope includes staging deploy or SHIP phase.

**Reads:** Deploy notes in goal; [pcampus-deploy-staging](../../.cursor/skills/pcampus-deploy-staging/SKILL.md).

**Does:** Approve staging deploy; run smoke tests; confirm rollback path.

**Does not:** Production deploy without explicit goal + human confirmation.

---

## Incident lead (human)

**When:** Production or staging incident.

**Agent support:** [pcampus-incident-response](../../.cursor/skills/pcampus-incident-response/SKILL.md) — triage, evidence, postmortem draft.

Human owns communication, production actions, and final decisions.

---

## Cursor setup

| Role | Mechanism |
|------|-----------|
| All | `AGENTS.md` + `.cursor/rules/` |
| Workflow | `pcampus-goal-workflow` |
| Task-specific | Other `pcampus-*` skills via `guidelines.mdc` |
| Team diagrams | [team-workflow.md](../06-workflows/team-workflow.md) |

Add stack rules (`.cursor/rules/{stack}.mdc`) and `{project}-*` skills at bootstrap when needed.

## Related

- [../../AGENTS.md](../../AGENTS.md)
- [../06-workflows/dev-loop.md](../06-workflows/dev-loop.md)
- [skills-library.md](skills-library.md)
