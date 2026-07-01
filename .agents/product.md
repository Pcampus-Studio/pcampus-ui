# Product Constitution — pcampus-ui

> **Role in ecosystem:** Shared design system and component library for all Pcampus services.
> **Base:** [Pcampus-Agent-OS/.agents/roles.md](../../Pcampus-Agent-OS/.agents/roles.md)

---

## What This Is

`@pcampus/ui` is the single source of shared UI for the Pcampus ecosystem. Every service that a user touches — PIP, PBCP Cockpit, Upload, BuatJai, Factory — imports from this package. It is what makes them feel like one product.

**PBCP Cockpit is the source of truth.** Components are extracted from Cockpit after proving themselves in production. Nothing is invented in this repo that has not first lived in Cockpit.

---

## What This Is Not

- Not a product application — no routing, no auth, no business logic
- Not an experimentation ground — no component is designed here before Cockpit ships it
- Not a Cockpit mirror — only components that are truly generic and reusable are promoted
- Not a design tool — Antigravity designs in Cockpit, not here

---

## Consumers

| Service | Uses |
|---------|------|
| PBCP Cockpit | Tokens + primitives (Cockpit retains PBCP-specific components) |
| PIP (Identity Platform) | Shell layout + form components + tokens |
| Upload Platform | Shell + file/media components + tokens |
| BuatJai | Tokens + layout + domain-agnostic components |
| Factory | Tokens + layout + domain-agnostic components |
| Future services | Same — import `@pcampus/ui`, extend with service-specific components |

---

## What Lives Here

### Tier 1 — Tokens (shared by all)
Design tokens extracted from Cockpit `design-tokens.md`:
- Color palette — brand colors, semantic colors, surface colors
- Typography — font family, scale, weight, line-height
- Spacing — 4pt grid, named scale
- Border radius, shadows, z-index
- Motion — duration, easing

### Tier 2 — Primitives (domain-agnostic)
Components with no business logic:
- `Button` — primary, secondary, ghost, destructive
- `Input`, `Select`, `Checkbox`, `Radio`, `Toggle`
- `Badge`, `Tag`, `Chip`
- `Avatar`, `Icon`
- `Tooltip`, `Popover`, `Dropdown`
- `Modal`, `Sheet`, `Dialog`
- `Table`, `DataGrid`
- `Skeleton`, `Spinner`, `Progress`
- `Alert`, `Toast`, `Banner`
- `Tabs`, `Breadcrumb`, `Pagination`

### Tier 3 — Layout Patterns (structural)
Shell and layout without domain content:
- `AppShell` — top nav + sidebar + content area
- `SplitPanel` — two or three column layout with collapsible panels
- `SnapshotPanel` — label-value list pattern (the Cockpit side panel pattern)
- `WorkspaceModal` — full-screen modal workspace (from story-modal pattern)
- `ThemeProvider` — dark/light mode, token injection

### Tier 4 — Data Visualization (generic charts)
Charts without domain wiring:
- `FunnelChart`
- `KPIChart`
- `SankeyChart`
- `TimelineBase` — structural timeline without Evidence/Story semantics

---

## What Does NOT Live Here (stays in each service)

| Component | Why it stays in service |
|-----------|------------------------|
| `BusinessTimeline` | Contains Evidence Substrate, Causal Thread, Story Amber — PBCP DNA |
| `StorySnapshot` | PBCP Story semantics |
| `BusinessPulseMetrics` | PBCP domain logic |
| `EntitySearchGrid` | PBCP entity resolution logic |
| `VisibleTruthCertificate` | PBCP provenance concept |

Rule: if a component name uses domain vocabulary (Story, Evidence, Business, Entity, Fact) — it stays in the service repo.

---

## Promotion Process

A component is promoted from Cockpit to `@pcampus/ui` when:
1. It has shipped in Cockpit and is stable
2. A second service needs the same component
3. It can be stripped of all domain logic and remain useful
4. Antigravity reviews the generic version for visual consistency

**Never promote speculatively.** A component enters `@pcampus/ui` because two services need it — not because it might be needed someday.

---

## Versioning

- Semantic versioning: `MAJOR.MINOR.PATCH`
- Breaking changes require a major version bump and migration guide
- Services pin to a minor version; patch updates are safe to absorb
- Cockpit may use `latest` as the upstream reference implementation
