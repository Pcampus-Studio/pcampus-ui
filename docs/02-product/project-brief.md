# Project brief — @pcampus/ui

> **Status:** Vision locked — MVP scope and goals still draft.

## Vision

One visual language for every product in the Pcampus ecosystem. A user moving between PIP, PBCP Cockpit, Factory, and other services should feel like they never left — same spacing, type, colors, and interaction patterns.

**North Star:** "Feels like one product" — the AWS Console / Google Cloud Console standard for Pcampus.

Canonical vision: [../01-vision.md](../01-vision.md)

## Problem

Without a shared library, every service builds its own buttons, modals, and shells. They drift apart. Shared CSS or tokens alone are not enough — teams need shared, tested, documented components they can import and trust.

## Solution

`@pcampus/ui` packages what PBCP Cockpit has already proven in production:

- **Tokens first** — colors, spacing, typography as the unifying layer
- **Conservative promotion** — Cockpit ships → second service confirms need → strip domain semantics → promote
- **Structural patterns** — `AppShell`, `SnapshotPanel`, and peers enable a future unified Pcampus Console

Nothing new is designed in this repo. We extract, generalize, package, and version.

## Is / Is not

| Is | Is not |
|----|--------|
| Shared design system + component library for all Pcampus services | A product application (no routing, auth, business logic) |
| Extracted from Cockpit after production proof | A design tool or experimentation ground |
| Prerequisite for a future Pcampus Console | The console itself |
| Generic, domain-agnostic public API | A mirror of all Cockpit components |

## Target users

**Pcampus service teams** — frontend engineers building PIP, Cockpit, Upload, BuatJai, Factory, and future services who need consistent UI without rebuilding primitives.

**Design / platform** — Antigravity signs off on visual language in Cockpit; changes propagate through the shared library.

## Core journey (high level)

1. Component ships and stabilizes in PBCP Cockpit
2. A second service needs the same pattern
3. Component is stripped of domain logic and promoted to `@pcampus/ui`
4. Consuming services import tokens and/or components — visual consistency without custom styling for standard patterns

## Technical direction

| Area | Choice |
|------|--------|
| Language | TypeScript (strict) |
| UI | React 18+ |
| Styling | CSS custom properties (tokens) + optional Tailwind |
| Build | tsup (ESM + CJS) |
| Dev | Storybook 8 |
| Test | Vitest + Testing Library |
| Package | `@pcampus/ui` |

Details: [.agents/engineering.md](../../.agents/engineering.md)

## Success metrics

- New Pcampus services bootstrap with `@pcampus/ui` and immediately look on-brand
- Cockpit, PIP, Upload, BuatJai, Factory share the same `Button`, `Input`, `AppShell`, `SnapshotPanel` — differentiated at the token level only
- Breaking changes are deliberate, versioned decisions
- Visual language approved once in Cockpit propagates to every service through this library

## Related

- [mvp-scope.md](mvp-scope.md)
- [../01-vision.md](../01-vision.md)
- [.agents/product.md](../../.agents/product.md) — tier system + promotion
- [.agents/design.md](../../.agents/design.md) — tokens + visual foundation
- [../03-architecture/overview.md](../03-architecture/overview.md)
