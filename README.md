# @pcampus/ui

**One visual language for every product in the Pcampus ecosystem.**

Shared design tokens, primitives, and structural patterns that PIP, PBCP Cockpit, Upload, BuatJai, Factory, and future services import so users feel like they never left — same spacing, type, colors, and interaction patterns.

**North Star:** "Feels like one product"

---

## What this repo is

| Is | Is not |
|----|--------|
| Shared component library (`@pcampus/ui`) | A product app — no routing, auth, or business logic |
| Extracted from PBCP Cockpit after production proof | A design tool or experimentation ground |
| Prerequisite for a future unified Pcampus Console | The console itself |

**Source of truth:** PBCP Cockpit. Nothing new is designed here — we extract, generalize, package, and version what Cockpit has already shipped.

**Promotion rule:** Cockpit ships → second service confirms need → strip domain semantics → promote (two-service rule).

Full vision: [docs/01-vision.md](docs/01-vision.md)

---

## Package tiers

| Tier | Contents |
|------|----------|
| **Tokens** | Colors, typography, spacing, motion |
| **Primitives** | `Button`, `Input`, `Modal`, … |
| **Layout** | `AppShell`, `SnapshotPanel`, `SplitPanel`, … |
| **Charts** | Generic data visualization |

Details: [.agents/product.md](.agents/product.md) · [.agents/design.md](.agents/design.md) · [.agents/engineering.md](.agents/engineering.md)

---

## Development

Built on **Pcampus Agent OS** — goal-driven Human + Agent delivery with governance.

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](AGENTS.md) | AI entry point — agents read first |
| [docs/00-project-snapshot.md](docs/00-project-snapshot.md) | TL;DR for agents |
| [docs/02-product/project-brief.md](docs/02-product/project-brief.md) | Canonical product spec |
| [docs/07-backlog/goals.md](docs/07-backlog/goals.md) | Active goals (G-001, …) |
| [docs/06-workflows/team-workflow.md](docs/06-workflows/team-workflow.md) | DEFINE → SHIP cycle |

### Commands (after `code/` bootstrap)

```bash
cd code && npm run build      # build package
cd code && npm run lint       # ESLint + TypeScript
cd code && npm run test       # Vitest
cd code && npm run storybook  # component dev server
```

### Start a dev round

1. Set a goal to `ready` in [docs/07-backlog/goals.md](docs/07-backlog/goals.md)
2. In Cursor: `อ่าน AGENTS.md แล้วทำ G-001`
3. When ready to code: `เริ่ม step 1`

---

## Repo layout

```text
AGENTS.md                 ← AI entry point
.agents/                  ← product, design, engineering, review constitutions
code/                     ← @pcampus/ui package (bootstrap via G-001)
docs/
  01-vision.md            ← North Star + principles
  02-product/             ← brief, scope, acceptance
  03-architecture/        ← overview, design-spec
  07-backlog/             ← goals
.cursor/
  rules/                  ← governance + stack rules
  skills/pcampus-*/       ← standard skills
```

Doc index: [docs/00-index.md](docs/00-index.md)

---

## Collaboration cycle

```text
DEFINE → PLAN → EXECUTE → REVIEW → IMPROVE → SHIP
```

Humans define scope in goals — AI implements within touch map. See [docs/03-architecture/design-spec.md](docs/03-architecture/design-spec.md).

---

Maintained by **Pcampus Studio**.
