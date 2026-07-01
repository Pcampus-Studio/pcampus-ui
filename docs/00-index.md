# Documentation index — @pcampus/ui

> Shared component library for the Pcampus ecosystem.  
> **Do not remove** process docs, `design-spec.md`, or `pcampus-*` skills.

## Project status

| Field | Value |
|-------|--------|
| **Project** | `@pcampus/ui` — shared design system + component library |
| **North Star** | "Feels like one product" — [01-vision.md](01-vision.md) |
| **Project stage** | Vision locked — bootstrap `code/` via G-001 |
| **Framework** | [03-architecture/design-spec.md](03-architecture/design-spec.md) |
| **Active goal** | — ([07-backlog/goals.md](07-backlog/goals.md)) |
| **Stack** | React 18+ · TypeScript · tsup · Storybook · Vitest |
| **Last updated** | 2026-07-02 |

## Read before writing code

1. [01-vision.md](01-vision.md) — why this library exists
2. [00-project-snapshot.md](00-project-snapshot.md) — TL;DR state
3. [02-product/project-brief.md](02-product/project-brief.md) — canonical spec
4. [02-product/mvp-scope.md](02-product/mvp-scope.md) — in/out scope
5. [.agents/product.md](../.agents/product.md) — tier system + promotion process
6. [03-architecture/overview.md](03-architecture/overview.md)
7. Active goal in [07-backlog/goals.md](07-backlog/goals.md)
8. [06-workflows/definition-of-done.md](06-workflows/definition-of-done.md)

## Team onboarding

- **[06-workflows/team-workflow.md](06-workflows/team-workflow.md)** — collaboration cycle (DEFINE → SHIP)
- [../AGENTS.md](../AGENTS.md) — AI entry point
- [../README.md](../README.md) — project overview + dev commands

## Document map

### Product

| Doc | Purpose |
|-----|---------|
| [01-vision.md](01-vision.md) | North Star, principles, success metrics |
| [00-project-snapshot.md](00-project-snapshot.md) | Agent reload — architecture, goals, constraints |
| [02-product/project-brief.md](02-product/project-brief.md) | Canonical product spec |
| [02-product/mvp-scope.md](02-product/mvp-scope.md) | MVP in/out |
| [02-product/knowledge-digest.md](02-product/knowledge-digest.md) | Distilled discovery (human scan) |
| [02-product/knowledge-map.json](02-product/knowledge-map.json) | Runtime graph ([README](02-product/knowledge-map.README.md)) |
| [02-product/learning-log.md](02-product/learning-log.md) | Post-ship observations |
| [02-product/assumptions.md](02-product/assumptions.md) | Assumption register |
| [02-product/acceptance-template.md](02-product/acceptance-template.md) | Goal block template |
| [02-product/acceptance/](02-product/acceptance/) | Per-goal acceptance contracts |

### Architecture

| Doc | Purpose |
|-----|---------|
| [03-architecture/design-spec.md](03-architecture/design-spec.md) | Framework map (Pcampus standard) |
| [03-architecture/overview.md](03-architecture/overview.md) | Library context + tiers |
| [03-architecture/folder-structure.md](03-architecture/folder-structure.md) | Code layout |
| [03-architecture/context-compiler.md](03-architecture/context-compiler.md) | Compile knowledge → action bundle |
| [03-architecture/api/README.md](03-architecture/api/README.md) | API contracts |
| [03-architecture/data/README.md](03-architecture/data/README.md) | Business rules |

### Agent constitutions

| Doc | Purpose |
|-----|---------|
| [.agents/product.md](../.agents/product.md) | Tier system, consumers, promotion |
| [.agents/design.md](../.agents/design.md) | Tokens + visual foundation |
| [.agents/engineering.md](../.agents/engineering.md) | Stack + component API |
| [.agents/review.md](../.agents/review.md) | Publish gates |

### Process

| Doc | Purpose |
|-----|---------|
| [04-agents/skills-library.md](04-agents/skills-library.md) | Pcampus standard skills |
| [06-workflows/dev-loop.md](06-workflows/dev-loop.md) | One round workflow |
| [06-workflows/team-workflow.md](06-workflows/team-workflow.md) | Human + Agent cycle |
| [06-workflows/definition-of-done.md](06-workflows/definition-of-done.md) | Done checklist |
| [07-backlog/goals.md](07-backlog/goals.md) | Goal queue |
| [07-backlog/changelog-goals.md](07-backlog/changelog-goals.md) | Completed goals log |

### Decisions

| Doc | Purpose |
|-----|---------|
| [05-decisions/README.md](05-decisions/README.md) | ADR vs PDR |
| [05-decisions/](05-decisions/) | Architecture + product decisions |

### Agent layers (repo root)

| Path | Purpose |
|------|---------|
| [../AGENTS.md](../AGENTS.md) | Agent entry |
| [../.cursor/rules/](../.cursor/rules/) | Always-on rules |
| [../.cursor/skills/pcampus-*/](../.cursor/skills/) | Standard skills |
