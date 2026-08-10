# ADR-0002: Add DataTable, adopt lucide-react, and codify page patterns

**Status:** proposed
**Date:** 2026-08-08
**Deciders:** Pcampus Studio (PLAN / design system owner)

## Context

Consuming apps embedded in `pcampus-console` (Mail, Storage) render **weak, inconsistent UI** when built screen-by-screen. Root cause: the design system is missing the exact building blocks that data/admin screens need, so each app (or each Cursor run) re-invents them badly.

Concretely, three gaps surfaced while redesigning Mail (see `console-ux-execution-spec.md` + `mail-ux-redesign-mockup.html`):

1. **No table primitive.** Every list screen (Activity, Audiences, Domains DNS, Buckets, Files) needs a table; without one, apps hand-roll `<table>` with ad-hoc styling → the "ง่อย" result.
2. **No standard icon set.** Screens use unicode glyphs or random SVGs. There is no shared, consistent icon language.
3. **No page-level patterns.** Recurring structures (page header, KPI card, status pill, wizard stepper, event timeline, filter bar) are re-built inconsistently.

The library already ships tokens, primitives (Button, Card, Badge, Input, Select, EmptyState, Skeleton, Spinner, Modal, Dialog, …), charts, and a layout shell. The missing tier is **data/app-screen composition**.

## Decision

Add a **data/app-screen tier** to `@pcampus-studio/ui`:

1. **`DataTable` (+ `Table` primitives)** — the canonical list component. Supports: typed columns, header, row hover, optional `onRowClick`, right-aligned actions cell, built-in **loading** (skeleton rows), **empty** (renders `EmptyState`), and **error** slots. All list UI across apps MUST use this.
2. **Adopt `lucide-react` as the standard icon set.** Re-export a curated set from `@pcampus-studio/ui` (e.g. `import { Icon } from '@pcampus-studio/ui'` or direct `lucide-react`), `currentColor`, context-sized. No unicode glyphs, no bespoke SVGs in app code.
3. **Codify page patterns** as components composed from existing primitives + tokens:
   - `PageHeader` — title + subtitle + actions slot
   - `KpiCard` — label + icon + value + delta (up/down)
   - `StatusBadge` — semantic states (ok / warn / err / info / muted / neutral)
   - `Stepper` — numbered step progress (done / current / pending)
   - `Timeline` — vertical event list with status dots
   - `FilterBar` — search + filter-pill row for table headers

All new components are token-driven (no hardcoded hex) and theme-aware (light/dark).

## Dependency graph

> Sync to knowledge-map.json → `decisions[]` on accept.

| Relation | IDs |
|----------|-----|
| **Evidence** | live console screenshot (bare Audiences); `mail-ux-redesign-mockup.html` |
| **Depends on** | tokens (G-002), primitives (G-003–G-010) — all done |
| **Unblocks** | pcampus-ui G-016; email-service Mail screen goals; pcampus-storage UI goals; console consistency |
| **Goals affected** | pcampus-ui G-016 |

## Consequences

### Positive

- Quality lives in the library — apps compose, they don't re-invent. Mail, Storage, and future apps inherit the same polish.
- Makes design-quality acceptance enforceable ("list uses `DataTable`", "icons from lucide", "empty uses `EmptyState`").
- One place to evolve the look; screenshot-diff gates become meaningful.

### Negative / tradeoffs

- `lucide-react` adds a dependency (tree-shakeable; acceptable).
- `DataTable` scope can creep (sorting, pagination, virtualization). Ship MVP first (columns, states, row-click); defer advanced features to a follow-up.

## Alternatives considered

| Option | Why not |
|--------|---------|
| Let each app build its own table/icons | This is exactly what produced the inconsistent, weak UI |
| Pull a heavy table lib (TanStack/AG Grid) into every app | Overkill for admin lists; inconsistent styling; heavier bundle; bypasses the design system |
| Icons per-app (heroicons here, unicode there) | No shared icon language; inconsistent weight/size |

## Architecture impact

**Status:** proposed
**Delta:** Adds a data/app-screen component tier to the shared UI contract. No breaking change to existing exports; additive.
**Classes:** contract (public component API of `@pcampus-studio/ui`)

### Impacted artifacts

| Priority | Artifact | Action | Owner role | Status |
|----------|----------|--------|------------|--------|
| P0 | `@pcampus-studio/ui` exports (index) | ADD DataTable, Icon, PageHeader, KpiCard, StatusBadge, Stepper, Timeline, FilterBar | Frontend | pending |
| P1 | theme.css / tokens | confirm coverage for new components | Frontend | pending |
| P1 | Storybook / docs | document new components + states | Frontend | pending |

### Blocked until propagated

- pcampus-ui G-016 → `ready`

## Links

- Spec: `console-ux-execution-spec.md`
- Mockup: `mail-ux-redesign-mockup.html`
- Goals: pcampus-ui G-016
