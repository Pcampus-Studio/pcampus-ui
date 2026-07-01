---
name: pcampus-architecture-governance
version: "1.0.0"
description: >-
  Architecture change detection and downstream impact propagation. Routes updates
  to roles, skills, rules, ADRs, discovery, goals, and review checklists — never
  leave architecture knowledge in chat only. arch impact, architecture review,
  propagate ADR-xxx — PLAN between Decision and Goal.
---

# Architecture governance

**Model:** Decision (ADR) → **Architecture review** → **Impact propagation** → Goal → Code

Sits **between** discovery decisions and goal execution. Complements — does not replace — [knowledge-governance.md](../../../docs/06-workflows/knowledge-governance.md) (who approves) or [governance.mdc](../../../.cursor/rules/governance.mdc) (ship gates).

| Phase | Agent job | Artifacts |
|-------|-----------|-----------|
| Detect | Classify architecture delta vs chat noise | Evidence `E-xxx`, delta summary |
| Impact | Map downstream artifacts | **Architecture Impact Report** in ADR |
| Propagate | Propose edits per authority matrix | roles, skills, rules, docs, goals |
| Gate | Block orphan architecture | `decisions[].arch_impact` in map |

Upstream: [pcampus-discovery](../pcampus-discovery/SKILL.md) (ADR draft)  
Downstream: [pcampus-goal-workflow](../pcampus-goal-workflow/SKILL.md) (`promote ready`)  
Post-ship: [pcampus-learning-loop](../pcampus-learning-loop/SKILL.md) (validates ADR outcomes)

Full reference: [knowledge-loop.md](../../../docs/06-workflows/knowledge-loop.md) · **Core:** [os-core-invariants.md](../../../docs/06-workflows/os-core-invariants.md)

---

## Position in the loop

```text
Discovery → Decision (PDR/ADR)
              ↓
        Architecture review     ← this skill
              ↓
        Governance update plan  (human ack)
              ↓
        Propagate artifacts
              ↓
        Goal → Code → Observation → Learning ↺
```

**Anti-pattern:** Architecture agreed in chat → code starts under `ready` goal → skills/rules/ADR stale.

---

## Gate

| Rule | Agent must |
|------|------------|
| User says **`arch impact`** / **`architecture review`** / **`propagate ADR-xxx`** | This skill — docs + map projection; no feature `code/` unless separate `ready` goal |
| ADR drafted or `proposed` with architectural scope | Run impact report before human `accepted` |
| `shared-memory` `architecture` section changed | Re-run impact for linked ADR or open draft ADR |
| User says **"ทำ G-xxx"** | [pcampus-goal-workflow](../pcampus-goal-workflow/SKILL.md) — not this skill |
| Framework change in **Pcampus Agent OS** repo | Impact includes skills-library, AGENTS.md, manifest — human Architect + framework ADR |

---

## When to run

| Trigger | Example |
|---------|---------|
| ADR `proposed` | ADR-005 JWT refresh rotation |
| ADR `superseded` / major edit | Replace auth model |
| Post-workshop chat | "เราเปลี่ยนเป็น event-driven" |
| `architecture review` | Planner requests impact before goals |
| Code/doc drift | Implementation contradicts `overview.md` |
| `shared-memory` handoff | Claude updates `architecture` block |
| `promote G-xxx ready` | Auto-check linked ADRs for pending impact |

---

## Step 1 — Detect architecture delta

Capture **what changed** in one paragraph. Require ≥1 `E-xxx` (interview, document, observation) unless human explicitly waives for emergency fix → log in [changelog.md](../../../docs/07-backlog/changelog.md).

| Signal | Architecture delta? |
|--------|---------------------|
| Stack, module boundary, integration pattern | ✅ Yes |
| Auth, security, permission model | ✅ Yes |
| API contract shape, data model | ✅ Yes |
| Agent workflow, skill routing, compiler IR | ✅ Yes (framework or project) |
| UI copy, single endpoint field rename in goal scope | ❌ No — goal touch map only |
| PDR scope cut (feature in/out) | ⚠️ PDR — run lighter **product impact** only |

If **no** architectural delta → set `arch_impact.status: not_required` on decision node; stop.

---

## Step 2 — Classify change

| Class | Examples | Typical downstream |
|-------|----------|-------------------|
| **boundary** | New service, module split | `overview.md`, touch maps, dev-roles |
| **contract** | REST shape, event schema | `api/`, pcampus-rest-api, acceptance |
| **data** | Tables, migrations | `data/`, pcampus-db-migration |
| **security** | Auth, RBAC, secrets handling | security.mdc, ADR, code-review lens 2 |
| **agent_os** | Skill, rule, phase, compiler | skills, AGENTS.md, design-spec (platform repo only) |
| **operations** | Deploy, observability | pcampus-deploy-staging, incident skill |

Multiple classes allowed — one row per class in impact report.

---

## Step 3 — Impact matrix

For each class, scan and list **concrete paths** to update. Do not answer "maybe update docs" — name files.

### Project (consumer repo)

| Artifact type | Check |
|---------------|-------|
| **ADR** | Current + supersede targets; dependency graph |
| **PDR** | Scope alignment if product boundary shifted |
| **Roles** | [dev-roles.md](../../../docs/04-agents/dev-roles.md) handoff text |
| **Skills** | Matching `pcampus-*` + `{project}-*` procedures |
| **Rules / prompts** | `.cursor/rules/{stack}.mdc`, `security.mdc` |
| **Architecture docs** | `overview.md`, `api/`, `data/` |
| **Discovery** | `assumptions.md`, pains, re-`trace G-xxx` |
| **Goals** | Touch map, **In/Out**, acceptance contracts |
| **Review** | [pcampus-code-review](../pcampus-code-review/SKILL.md) lenses 2–4 |
| **Playbooks / IR** | `docs/04-agents/playbooks/`, compiler allowed_files |

### Platform (Pcampus Agent OS repo only)

| Artifact type | Check |
|---------------|-------|
| **Skills** | [skills-library.md](../../../docs/04-agents/skills-library.md), affected `pcampus-*` |
| **Rules** | `.cursor/rules/*.mdc` |
| **Workflow docs** | `docs/06-workflows/`, `design-spec.md` |
| **Manifest** | [framework-manifest.yml](../../../framework-manifest.yml) version bump |
| **Templates** | ADR/PDR/goal templates |
| **Schema** | `knowledge-map.schema.json` if map shape changes |

**Platform/consumer separation:** [platform-consumer.mdc](../../../.cursor/rules/platform-consumer.mdc) — never bind consumer product names in platform impact reports.

---

## Step 4 — Architecture Impact Report

Write into ADR under **## Architecture impact** ([0000-template.md](../../../docs/05-decisions/0000-template.md)). For large spreads, add `docs/05-decisions/adr-NNNN-slug-impact.md` and link from ADR.

```markdown
## Architecture impact

**Status:** proposed | accepted | waived  
**Delta:** [one paragraph]  
**Evidence:** E-xxx  
**Classes:** boundary, security  

### Impacted artifacts

| Priority | Artifact | Action | Owner role | Status |
|----------|----------|--------|------------|--------|
| P0 | docs/03-architecture/overview.md | Update auth diagram | Architect | pending |
| P0 | G-012 touch map | Add auth module paths | Tech Lead | pending |
| P1 | pcampus-rest-api §errors | Add 401 refresh flow | Implementer | pending |
| P1 | acceptance/G-012.md | New scenario A-005 | PO | pending |
| P2 | .cursor/rules/security.mdc | Document rotation | Architect | pending |

### Blocked until propagated

- G-012 → `ready` (touches auth boundary)
- G-015 → `ready` (depends on ADR-005)

### Propagation log

| Date | Artifact | Agent/human | Note |
|------|----------|-------------|------|
| 2026-06-29 | ADR-005 | agent | impact proposed |
```

**Status meanings:**

| Status | Meaning |
|--------|---------|
| `not_required` | No architectural delta |
| `pending` | Delta known; report not written |
| `proposed` | Report written; human has not ack'd plan |
| `accepted` | Architect ack'd; P0 items done or scheduled in goals |
| `waived` | Human override — log reason in changelog |

---

## Step 5 — Propagate (draft only)

Agent **proposes** edits — never auto-accept ADR or promote goals.

| Artifact | Agent may | Human must |
|----------|-----------|------------|
| ADR body + impact section | Draft / update | Accept ADR |
| Map `arch_impact` | Sync projection | Ack impact `accepted` |
| Skills / rules (platform) | Draft PR-sized diff | Architect |
| Goal touch map | Draft in goal file | Tech Lead on `ready` |
| Acceptance contract | Draft scenarios | PO |

After each propagated item, update **Propagation log** and increment `arch_impact.items_done`.

---

## Step 6 — Sync knowledge map

Mirror on `decisions[]` entry for the ADR:

```json
{
  "id": "ADR-005",
  "type": "adr",
  "status": "proposed",
  "arch_impact": {
    "status": "proposed",
    "classes": ["security", "contract"],
    "items_total": 5,
    "items_done": 0,
    "blocks_goals": ["G-012", "G-015"],
    "updated_at": "2026-06-29"
  }
}
```

Phase 1: update via **DecisionService** when available; otherwise sync projection directly and note in session — same pattern as [learning-log.md](../../../docs/02-product/learning-log.md) projection.

---

## Block rules (`promote G-xxx ready`)

Run on **`arch impact check G-xxx`** or automatically during **`promote G-xxx ready`**:

| Condition | v1 behavior |
|-----------|-------------|
| Linked ADR `arch_impact.status` = `pending` or `proposed` | **Block** `ready` |
| Linked ADR `accepted` but `items_done` < P0 count | **Block** `ready` for goals in `blocks_goals` |
| `arch_impact.status` = `waived` | Allow — changelog entry required |
| Goal traceability marks ADR `optional_skipped` | Skip arch impact gate |

Human override → [changelog.md](../../../docs/07-backlog/changelog.md) + set `waived`.

Works with **`trace G-xxx`** from [pcampus-discovery](../pcampus-discovery/SKILL.md) — orthogonal checks.

---

## Shared memory handoff

When `.bundle/G-xxx/shared-memory.yaml` `architecture` section updates ([working-memory.md](../../../docs/03-architecture/working-memory.md)):

1. Diff against last ADR summary
2. If material change → open or update ADR + impact report
3. Patch `architecture` only after impact `proposed` minimum

Future: `ArchitectureUpdated` event → invoke this skill — see [coordination.md](../../../docs/03-architecture/coordination.md).

---

## OS health metric

On **`os health`**, include extension metric (studio tunes threshold in `_extensions`):

| Metric | Formula |
|--------|---------|
| **Architecture propagation** | ADRs with `accepted` status where `arch_impact.status` = `accepted` ÷ ADRs with architectural scope |

Target default: **100%** for `accepted` ADRs in active project. Warn if any `accepted` ADR lacks impact report.

---

## Agent commands

| Command | Action |
|---------|--------|
| `architecture review` | Detect delta from chat/context → classify → draft impact |
| `arch impact ADR-xxx` | Full impact report for one ADR |
| `arch impact check G-xxx` | List blockers for promote ready |
| `propagate ADR-xxx` | Step through propagation checklist; draft edits |
| `arch impact sync ADR-xxx` | ADR section ↔ map `arch_impact` |

---

## Knowledge governance

| Agent may | Agent must not |
|-----------|----------------|
| Draft impact report `proposed` | Set ADR `accepted` without human |
| Propose skill/rule/goal edits | Merge platform changes without Architect |
| Block `ready` with clear artifact list | Waive without changelog |
| Set `arch_impact` projection | Implement feature code under this skill |

Approvers: **Architect** (impact `accepted`, ADR) · **Tech Lead** (goal touch map) · **PO** (acceptance) · **Product Lead** (PDR alignment).

---

## Related

- [knowledge-governance.md](../../../docs/06-workflows/knowledge-governance.md)
- [pcampus-discovery](../pcampus-discovery/SKILL.md) — dependency graph, `trace G-xxx`
- [pcampus-goal-workflow](../pcampus-goal-workflow/SKILL.md) — `promote G-xxx ready`
- [pcampus-code-review](../pcampus-code-review/SKILL.md) — lens 4 architecture compliance
- [pcampus-upgrade-os](../pcampus-upgrade-os/SKILL.md) — framework **version** drift (not semantic arch delta)
- [engineering-constitution.md](../../../docs/constitution/engineering-constitution.md)
