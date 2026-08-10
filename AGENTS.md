# pcampus-ui — Agent Guide

> **Pause before coding.** This repo uses **Pcampus goal-driven development** — Human defines scope, AI implements within goals.

Human onboarding: [docs/06-workflows/team-workflow.md](docs/06-workflows/team-workflow.md)  
Framework map: [docs/03-architecture/design-spec.md](docs/03-architecture/design-spec.md)  
Constitution: [.agents/](./agents/)

## Mission

**North Star:** "Feels like one product" — no matter which Pcampus service a user is in.

`@pcampus/ui` is the shared component library and design system for the entire Pcampus ecosystem. It provides design tokens, primitive components, and structural patterns that every Pcampus service — PIP, PBCP, Upload, BuatJai, Factory — uses to look and feel like one product.

**PBCP Cockpit is the source of truth.** Components are promoted from Cockpit after proving themselves in production, not invented here. This repo packages and versions what Cockpit has already designed and shipped.

**Product principles:** extract don't invent · two-service rule · tokens before components · generic names.

Full vision: [docs/01-vision.md](docs/01-vision.md)

This repo is NOT a product application. It has no routing, no auth, no business logic. It is a library.

## Pcampus Agent OS — six layers

```text
Context + Skill + Goal + Governance + Approval + Audit
```

| Layer | Location | Agent job |
|-------|----------|-----------|
| **Context** | compiled action bundle | **EXECUTE:** `step-N.md` + `action-step-N.yaml` |
| **Skill** | `.cursor/skills/pcampus-*/` | Follow task playbook |
| **Goal** | `docs/07-backlog/goals.md`, `docs/02-product/acceptance/` | One `ready` goal per round |
| **Governance** | `.cursor/rules/governance.mdc`, `security.mdc` | Hard boundaries |
| **Approval** | Human in REVIEW / SHIP | No merge, prod, or `done` without human |
| **Audit** | `docs/07-backlog/changelog.md` | Log decisions |

## How this repo works

| Layer | Location | Agent job |
|-------|----------|-----------|
| **Goals** | `docs/07-backlog/goals.md` + `goals/G-xxx.md` | Work on **one** `ready` goal only; archive to `goals/_archived/` on close |
| **Scope lock** | `docs/02-product/mvp-scope.md` | Do not build **Out** items without a new goal |
| **Rules** | `.cursor/rules/` | Always follow |
| **Skills** | `.cursor/skills/pcampus-*/` | Read when task matches skill description |
| **Specs** | `docs/02-product/`, `docs/03-architecture/` | Read links in the active goal |
| **API / data** | `docs/03-architecture/api/`, `data/` | Update contracts when goal changes APIs or domain rules |

**Goal status:** `draft` / `planned` = spec only · `ready` = may pick · `in_progress` · `review` · `blocked` · `approved` · `done`  
(Canonical terms: [design-spec.md](docs/03-architecture/design-spec.md) §8 — collaboration phase ≠ goal status.)

## Approval gates — NO AI MAY (without explicit human approval)

- Merge to `main` / protected branches
- Deploy to **production**
- Modify infrastructure
- Run destructive migrations
- Change auth / security boundaries
- Mark goal `done` without human approval (`approved` → `done`)

See [.cursor/rules/governance.mdc](.cursor/rules/governance.mdc) and [.cursor/rules/security.mdc](.cursor/rules/security.mdc).

## Collaboration cycle (every session)

```text
DEFINE → PLAN → EXECUTE → REVIEW → IMPROVE → SHIP
```

Each name is a **collaboration phase** — not an operating mode, bundle mode, or response level. See [design-spec.md](docs/03-architecture/design-spec.md) §8.

1. **DEFINE** — Discovery interview → distill knowledge → record decisions → then goals ([knowledge-loop.md](docs/06-workflows/knowledge-loop.md))
2. **PLAN** — Confirm In/Out/touch map; read linked ADRs and acceptance contract
3. **EXECUTE** — Implement with task skill (API, migration, …) within touch map
4. **REVIEW** — Run code-review skill; human approves → `approved`
5. **IMPROVE** — Tests green per test plan + DoD
6. **SHIP** — Deploy goals only; human approves staging

## Context loading (before collaboration phase EXECUTE)

**Do not** load the full list below on every step — use the **context compiler**:

| Command trigger | Load |
|---------|------|
| **ทำ G-xxx** | `goals/G-xxx.md` only |
| **compile G-xxx** / hydrate | Build `.bundle/` per [context-compiler.md](docs/03-architecture/context-compiler.md) |
| **เริ่ม step N** | `step-N.md` + `action-step-N.yaml` + allowed_files |
| **continue G-xxx** | `delta.md` + changed paths only |
| **dispatch cursor G-xxx step-N** | Antigravity รัน `scripts/dispatch-cursor.sh` สั่ง Cursor โดยตรง |
| **dispatch parallel G-xxx** | Antigravity รัน `scripts/dispatch-parallel.sh` หลาย agents พร้อมกัน |

Full project context (bootstrap, discovery, new goal draft) — load in order:

1. This file (`AGENTS.md`)
2. [docs/01-vision.md](docs/01-vision.md) — North Star and product principles
3. [docs/00-project-snapshot.md](docs/00-project-snapshot.md)
4. [docs/02-product/project-brief.md](docs/02-product/project-brief.md)
5. Active goal in [docs/07-backlog/goals.md](docs/07-backlog/goals.md)
6. Acceptance contract `docs/02-product/acceptance/G-xxx.md` (if present)
7. Linked ADR in `docs/05-decisions/`
8. Relevant API/data docs
9. Matching `pcampus-*` skill

## Read first (in order)

1. [docs/01-vision.md](docs/01-vision.md) — why this library exists
2. [.agents/product.md](.agents/product.md) — tier system, consumers, promotion process
3. [.agents/design.md](.agents/design.md) — tokens, visual foundation, patterns
4. [.agents/engineering.md](.agents/engineering.md) — stack, component API, hard rules
5. [.agents/review.md](.agents/review.md) — publish gates before any component ships
6. [docs/02-product/project-brief.md](docs/02-product/project-brief.md) — canonical spec
7. [docs/02-product/mvp-scope.md](docs/02-product/mvp-scope.md) — in/out scope
8. [docs/07-backlog/goals.md](docs/07-backlog/goals.md) — pick **one** active goal

## Work loop (every round)

1. Select a single **`ready`** goal (dependencies `done`; skip `draft` / `planned`).
2. Confirm **In / Out / Touch map / Acceptance criteria** — stop if unclear.
3. Set goal status → `in_progress` when human says **"เริ่ม step N"** (first execution on a `ready` goal).
4. Load matching **pcampus-** skill; implement within goal scope.
5. Set goal status → `review`; run **pcampus-testing** + **pcampus-code-review**.
6. Human approves → `approved`; one commit per goal when user asks.
7. Mark goal `done`; update [docs/07-backlog/changelog-goals.md](docs/07-backlog/changelog-goals.md) and [changelog.md](docs/07-backlog/changelog.md).
8. **SHIP goals:** follow **pcampus-deploy-staging** after human approval.

Full workflow: [docs/06-workflows/dev-loop.md](docs/06-workflows/dev-loop.md)

## Dev agent roles

| Role | Reads | Does |
|------|-------|------|
| **Planner** | brief, digest, assumptions, mvp-scope | Break work into goals |
| **Implementer** | active goal + architecture + skill | Code in scope |
| **Tester** | acceptance contract + test plan | Tests green (`pcampus-testing`) |
| **Reviewer** | DoD + diff | Approve (`pcampus-code-review`) |
| **Shipper** | deploy goal | Approve staging (`pcampus-deploy-staging`) |

Details: [docs/04-agents/dev-roles.md](docs/04-agents/dev-roles.md)

## Hard rules

- **Only `ready` goals** — do not self-pick or implement `draft` / `planned`.
- **One goal per commit** — no drive-by refactors or multi-goal commits.
- **Touch map only** — no repo-wide changes outside goal scope.
- **Tests before goal status `review`** — do not mark complete if tests or analyzer fail.
- **Human before `done`** — status must reach `approved` with explicit human sign-off.
- **Respect MVP scope** — no out-of-scope features without a new goal row.
- **Minimize diff** — smallest change that satisfies acceptance criteria.
- **Do not commit** unless the user explicitly asks.
- **Do not deploy to production** unless goal explicitly includes it and human confirms.
- **No secrets** — never commit or expose `.env`, tokens, keys (see `security.mdc`).

## Operating modes

Governance overlay — not collaboration phases. See [design-spec.md](docs/03-architecture/design-spec.md) §8.

| Operating mode | Rules |
|------|-------|
| **Normal** | Full review; no hotfix without goal + review |
| **Incident** | Human declares; follow `pcampus-incident-response`; emergency path requires explicit authorization |

## Standard commands

```bash
cd code && npm run build        # build package
cd code && npm run lint         # ESLint + TypeScript check
cd code && npm run test         # Vitest unit tests
cd code && npm run storybook    # component dev server
```

## Pcampus standard skills (v1.4.0)

| Skill | Command triggers |
|-------|------|
| [pcampus-discovery](.cursor/skills/pcampus-discovery/SKILL.md) | `discover`, `coverage`, `knowledge audit` (DEFINE) |
| [pcampus-architecture-governance](.cursor/skills/pcampus-architecture-governance/SKILL.md) | `architecture review`, `arch impact`, propagate ADR (PLAN) |
| [pcampus-learning-loop](.cursor/skills/pcampus-learning-loop/SKILL.md) | `observe`, `learn`, `post-ship G-xxx` (evolve map) |
| [pcampus-goal-workflow](.cursor/skills/pcampus-goal-workflow/SKILL.md) | Any G-xxx work |
| [pcampus-rest-api](.cursor/skills/pcampus-rest-api/SKILL.md) | API endpoints |
| [pcampus-testing](.cursor/skills/pcampus-testing/SKILL.md) | Tests & CI |
| [pcampus-code-review](.cursor/skills/pcampus-code-review/SKILL.md) | Before done / PR |
| [pcampus-deploy-staging](.cursor/skills/pcampus-deploy-staging/SKILL.md) | Staging deploy |
| [pcampus-upgrade-os](.cursor/skills/pcampus-upgrade-os/SKILL.md) | Upgrade OS in existing projects (Phase 2) |
| [pcampus-incident-response](.cursor/skills/pcampus-incident-response/SKILL.md) | Incidents |
| [pcampus-db-migration](.cursor/skills/pcampus-db-migration/SKILL.md) | Schema migrations |

Catalog & versions: [docs/04-agents/skills-library.md](docs/04-agents/skills-library.md)

Add `{project}-*` skills only for project-specific conventions; register in the catalog.

## Cursor rules

Persistent constraints: [.cursor/rules/](.cursor/rules/) — `core`, `governance`, `security`, `guidelines`, stack-specific `{stack}.mdc`.

## CI & GitHub hard guards

| Asset | Purpose |
|-------|---------|
| [docs/06-workflows/github-governance.md](docs/06-workflows/github-governance.md) | Protected branches + setup |
| [.github/workflows/governance.yml](.github/workflows/governance.yml) | Goal reference, commit format, secret scan |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | App test/lint |
| [.github/pull_request_template.md](.github/pull_request_template.md) | PR checklist |

Copy [.github/ci-config.example.yml](.github/ci-config.example.yml) → `ci-config.yml` at G-001 bootstrap.

Run locally: `bash scripts/ci/governance-check.sh` · `bash scripts/ci/app-ci.sh`

**Existing projects:** [scripts/upgrade-os.sh](scripts/upgrade-os.sh) — two-phase: Phase 1 script, Phase 2 [pcampus-upgrade-os](.cursor/skills/pcampus-upgrade-os/SKILL.md) · [upgrade-agent-os.md](docs/06-workflows/upgrade-agent-os.md) · [framework-manifest.yml](framework-manifest.yml)
