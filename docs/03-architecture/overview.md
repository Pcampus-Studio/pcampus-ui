# Architecture overview — @pcampus/ui

> Shared component library for the Pcampus ecosystem. Not an application.

## System context

```text
┌─────────────────────────────────────────────────────────────┐
│  Pcampus services (PIP · Cockpit · Upload · BuatJai · …)   │
│  domain components + service-specific UI                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ import
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  @pcampus/ui (this repo)                                    │
│  tokens → primitives → layout → charts                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ source of truth (extract from)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PBCP Cockpit — production-proven patterns                  │
└─────────────────────────────────────────────────────────────┘
```

## Package tiers

| Tier | Contents | Example exports |
|------|----------|-----------------|
| 1 — Tokens | Colors, type, spacing, motion | `@pcampus/ui/tokens` |
| 2 — Primitives | Domain-agnostic controls | `Button`, `Input`, `Modal` |
| 3 — Layout | Structural shells | `AppShell`, `SnapshotPanel` |
| 4 — Charts | Generic visualization | `FunnelChart`, `KPIChart` |

Tier details and promotion rules: [.agents/product.md](../../.agents/product.md)

## Layers (library)

| Layer | Responsibility |
|-------|------------------|
| **Tokens** | CSS custom properties + JS exports — visual foundation |
| **Primitives** | Reusable UI controls — no business logic |
| **Layout** | App shell and panel patterns — no domain content |
| **Stories / tests** | Storybook docs + Vitest behavior coverage |

## Key choices

| Area | Choice |
|------|--------|
| Language | TypeScript (strict) |
| UI | React 18+ |
| Styling | CSS custom properties + optional Tailwind |
| Build | tsup — ESM + CJS |
| Dev | Storybook 8 |
| Test | Vitest + Testing Library |

## Related

- [folder-structure.md](folder-structure.md)
- [../01-vision.md](../01-vision.md)
- [../02-product/project-brief.md](../02-product/project-brief.md)
- [.agents/engineering.md](../../.agents/engineering.md)
