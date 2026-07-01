# Project snapshot

> **TL;DR for agents.** Update when architecture, active goals, or constraints change.  
> Reload this at the start of every session before collaboration phase EXECUTE.

## Vision (North Star)

**"Feels like one product"** — no matter which Pcampus service a user is in.

`@pcampus/ui` is the shared visual foundation for the Pcampus ecosystem: design tokens, primitives, and structural patterns that PIP, PBCP Cockpit, Upload, BuatJai, and Factory import so spacing, type, colors, and interaction patterns stay consistent.

Full vision: [01-vision.md](01-vision.md)

## Architecture (one paragraph)

A **component library**, not an application — no routing, auth, or business logic. PBCP Cockpit is the source of truth: components are extracted, generalized, packaged, and versioned after proving themselves in production (two-service rule). Package lives in `code/` as `@pcampus/ui` (TypeScript, React 18+, tsup, Storybook, Vitest). Tiers: tokens → primitives → layout patterns → generic charts. Domain-specific components stay in each service.

## Active goals

| ID | Status | Summary |
|----|--------|---------|
| *(none)* | — | Create G-001 at project bootstrap |

## Constraints

- MVP scope: [02-product/mvp-scope.md](02-product/mvp-scope.md)
- Stack: React + TypeScript — see [.agents/engineering.md](../.agents/engineering.md)
- **Extract, don't invent** — nothing new is designed here before Cockpit ships it
- **Two-service rule** — promote only when Cockpit + a second service need the same component
- **Generic names** — no PBCP domain vocabulary in public API

## Product principles

1. Extract, don't invent
2. Two-service rule
3. Tokens before components
4. Generic names

## Current APIs (high level)

| Area | Doc |
|------|-----|
| Package exports | [03-architecture/overview.md](03-architecture/overview.md) |
| Component tiers | [.agents/product.md](../.agents/product.md) |

## Known issues / tech debt

| Issue | Goal / note |
|-------|-------------|
| `code/` not bootstrapped | G-001 |

## Last updated

2026-07-02 — vision integrated from docs/01-vision.md
