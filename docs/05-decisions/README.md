# Decision records

Two complementary types — both live in this folder.

| Type | Prefix | Template | When |
|------|--------|----------|------|
| **ADR** — Architecture | `0001-slug.md` | [0000-template.md](0000-template.md) | Stack, auth, data model, integration, infra pattern |
| **PDR** — Product | `pdr-0001-slug.md` | [pdr-0000-template.md](pdr-0000-template.md) | MVP scope, persona, timeline, feature in/out, pivot |

## Examples

**ADR:** "Use PostgreSQL" — transaction needs, team expertise, tradeoff vs MongoDB write scale.

**PDR:** "MVP excludes push notification" — ship in 4 weeks; users refresh manually in v1.

## Workflow

Decisions emerge from [knowledge-digest.md](../02-product/knowledge-digest.md) and [knowledge-map.json](../02-product/knowledge-map.json) during discovery:

```text
Evidence (E-xxx) → Pain (P-xxx) → PDR → ADR → Architecture impact → Goal (G-xxx)
```

Each ADR includes **Dependency graph** + **Architecture impact** synced to map `decisions[]` (including `arch_impact`).

Architecture propagation: [pcampus-architecture-governance](../../.cursor/skills/pcampus-architecture-governance/SKILL.md)

Log significant decisions in [changelog.md](../07-backlog/changelog.md).

## Related

- [0001-example-postgresql.md](0001-example-postgresql.md) — ADR format example
- [pdr-0001-example-mvp-no-notification.md](pdr-0001-example-mvp-no-notification.md) — PDR format example (replace on bootstrap)
- [pcampus-discovery](../../.cursor/skills/pcampus-discovery/SKILL.md)
