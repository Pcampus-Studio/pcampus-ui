# Skills library

> **Pcampus Studio standard skills** — shipped with every project from **Pcampus Agent OS**.  
> Versioned, repeatable procedures for humans and Cursor agents.

Project-specific skills use prefix `{project}-*` and are listed in a separate section below.

## Version convention

| Change type | Bump | Example |
|-------------|------|---------|
| New steps, removed steps, different order | **minor** (1.0 → 1.1) | Add mandatory security scan |
| Incompatible with previous workflow | **major** (1.x → 2.0) | Commit policy changed |
| Wording, links, typos | **patch** (1.0.0 → 1.0.1) | Fix path typo |

Store version in skill frontmatter:

```yaml
---
name: pcampus-my-skill
version: "1.0.0"
description: When to use this skill…
---
```

## Pcampus standard skills (shipped)

| Skill | Version | Path | Use when |
|-------|---------|------|----------|
| Product discovery | **1.3.3** | [pcampus-discovery](../../.cursor/skills/pcampus-discovery/SKILL.md) | Knowledge Services + ROI on `os health` |
| Architecture governance | **1.0.0** | [pcampus-architecture-governance](../../.cursor/skills/pcampus-architecture-governance/SKILL.md) | ADR impact propagation; block orphan architecture |
| Learning loop | **1.0.2** | [pcampus-learning-loop](../../.cursor/skills/pcampus-learning-loop/SKILL.md) | LearningService capabilities |
| Goal workflow | **1.8.0** | [pcampus-goal-workflow](../../.cursor/skills/pcampus-goal-workflow/SKILL.md) | Playbooks, capability matrix, shared memory |
| Create REST API | **1.0.0** | [pcampus-rest-api](../../.cursor/skills/pcampus-rest-api/SKILL.md) | New/changed HTTP/RPC endpoints |
| Code review checklist | **1.1.0** | [pcampus-code-review](../../.cursor/skills/pcampus-code-review/SKILL.md) | Before done / merge / PR review |
| Testing procedure | **1.0.0** | [pcampus-testing](../../.cursor/skills/pcampus-testing/SKILL.md) | Tests, failures, test plan |
| Deploy to staging | **1.0.0** | [pcampus-deploy-staging](../../.cursor/skills/pcampus-deploy-staging/SKILL.md) | SHIP phase, staging deploy |
| Upgrade Agent OS | **1.0.0** | [pcampus-upgrade-os](../../.cursor/skills/pcampus-upgrade-os/SKILL.md) | Phase 2 semantic merge after upgrade-os.sh |
| Incident response | **1.1.0** | [pcampus-incident-response](../../.cursor/skills/pcampus-incident-response/SKILL.md) | Outages, rollback, postmortem |
| Database migration | **1.0.0** | [pcampus-db-migration](../../.cursor/skills/pcampus-db-migration/SKILL.md) | Schema changes, migrations |

All linked from [AGENTS.md](../../AGENTS.md) and routed via [.cursor/rules/guidelines.mdc](../../.cursor/rules/guidelines.mdc).

## Project-specific skills (add when needed)

Use when the same **project-only** convention is explained 3+ times:

```text
.cursor/skills/{project}-{name}/SKILL.md
```

| Skill | Version | Path | Use when |
|-------|---------|------|----------|
| *(none — add rows as created)* | — | — | — |

Register new skills here and in `AGENTS.md`.

## Changelog

| Skill | Version | Date | Change |
|-------|---------|------|--------|
| pcampus-architecture-governance | 1.0.0 | 2026-06-29 | Architecture impact detection, propagation matrix, promote-ready gate |
| pcampus-learning-loop | 1.0.2 | 2026-06-27 | LearningService; event bus documented as future |
| pcampus-discovery | 1.3.3 | 2026-06-27 | Knowledge Services layer; Knowledge ROI on os health |
| pcampus-discovery | 1.0.0 | 2026-06-27 | Knowledge loop: 7-step interview, distillation, assumptions, PDR |
| pcampus-upgrade-os | 1.0.0 | 2026-06-24 | Two-phase upgrade: manifest + --report + AI semantic merge |
| pcampus-goal-workflow | 1.8.0 | 2026-06-27 | Coordination layer — playbooks, capability IR, shared memory |
| pcampus-goal-workflow | 1.5.0 | 2026-06-27 | Context resolver, execution bundle, hydrate/continue |
| pcampus-goal-workflow | 1.4.2 | 2026-06-24 | "ทำ G-xxx" fast path — TodoWrite only, no promote nag / no repo explore |
| pcampus-goal-workflow | 1.4.1 | 2026-06-24 | TodoWrite sync with Plan steps — visible step progress in chat |
| pcampus-goal-workflow | 1.4.0 | 2026-06-24 | Plan briefing on "ทำ G-xxx"; execute on "เริ่ม step N" only |
| pcampus-goal-workflow | 1.3.3 | 2026-06-24 | Executable goal spec (Context, Work steps); goal-spec-guide.md |
| pcampus-goal-workflow | 1.3.2 | 2026-06-24 | Plan & Dashboard tracking; archive to goals/_archived/ |
| pcampus-goal-workflow | 1.2.0 | 2026-05-27 | Governance layer: state machine, audit, acceptance contracts |
| pcampus-code-review | 1.1.0 | 2026-05-27 | Five review lenses (security, architecture, scope creep) |
| pcampus-incident-response | 1.1.0 | 2026-05-27 | Normal vs incident mode |
| pcampus-goal-workflow | 1.1.0 | 2026-05-24 | Goal gate mandatory before code |
| pcampus-rest-api | 1.0.0 | 2026-05-24 | Initial ship |
| pcampus-code-review | 1.0.0 | 2026-05-24 | Initial ship |
| pcampus-testing | 1.0.0 | 2026-05-24 | Initial ship |
| pcampus-deploy-staging | 1.0.0 | 2026-05-24 | Initial ship |
| pcampus-incident-response | 1.0.0 | 2026-05-24 | Initial ship |
| pcampus-db-migration | 1.0.0 | 2026-05-24 | Initial ship |

## Related

- [design-spec.md](../03-architecture/design-spec.md)
- [dev-roles.md](dev-roles.md)
- [../06-workflows/team-workflow.md](../06-workflows/team-workflow.md)
