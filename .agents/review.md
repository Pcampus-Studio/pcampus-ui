# Review Constitution — pcampus-ui

> **Base:** [Pcampus-Agent-OS/.agents/](../../Pcampus-Agent-OS/.agents/)

---

## Review Stages

Every component PR must pass all stages before merge.

---

### Stage 1 — Generic Test

**Question:** Is this component truly generic?

| Check | Pass condition |
|-------|---------------|
| No domain vocabulary in names or props | Component could be used in a school app without modification |
| No PBCP-specific logic | No Evidence, Story, Fact, Entity, Business references |
| No hardcoded business rules | No lifecycle stages, no causal logic |

**Fail response:** Return to Cockpit. This component is not ready for extraction.

---

### Stage 2 — Token Compliance

**Question:** Does this component use only design tokens?

| Check | Pass condition |
|-------|---------------|
| No hardcoded color values | All colors via `--pcampus-*` CSS custom properties |
| No hardcoded pixel sizes | All spacing via `--pcampus-space-*` tokens |
| Works with token override | Changing `--pcampus-color-primary` changes the component visually |

**Fail response:** Replace hardcoded values with token references before merge.

---

### Stage 3 — API Quality

**Question:** Is the component API clean and consistent?

| Check | Pass condition |
|-------|---------------|
| Props interface exported | Consumers can import the type |
| Ref forwarded | Interactive components support `ref` |
| HTML attributes extended | Native attributes pass through correctly |
| Variant/size names consistent | Uses same vocabulary as other components in this repo |

**Fail response:** Fix the API. Changing props after publish is a breaking change.

---

### Stage 4 — Story Coverage

**Question:** Are all variants documented in Storybook?

| Check | Pass condition |
|-------|---------------|
| Story file exists | `stories/{component}.stories.tsx` present |
| All variants have a story | Primary, secondary, ghost, loading, error states — all visible |
| Props are controllable | `argTypes` configured so reviewer can test interactively |
| Dark mode story | Component renders correctly in dark mode |

**Fail response:** Add missing stories before merge.

---

### Stage 5 — Test Coverage

**Question:** Are the critical behaviors tested?

| Check | Pass condition |
|-------|---------------|
| Test file exists | `tests/{component}.test.tsx` present |
| Render test | Component renders without crashing |
| Interaction test | Click, input, toggle behaviors verified |
| Accessibility test | Uses correct ARIA roles and labels |

**Fail response:** Add tests before merge.

---

### Stage 6 — Visual Consistency (Antigravity)

**Question:** Does this component look like a Pcampus product?

Antigravity reviews:
- Does the component feel consistent with Cockpit's visual language?
- Are spacing, weight, and color usage consistent with the Pcampus style?
- Does it hold up at all breakpoints?
- Does dark mode look intentional, not accidental?

**This stage is not optional.** Antigravity's visual sign-off is required before any component ships.

---

## Promotion Review (Cockpit → pcampus-ui)

When promoting a component from Cockpit, run the additional checklist:

- [ ] Original Cockpit component is stable and has been in production
- [ ] At least one other service has confirmed they need this component
- [ ] Domain logic has been stripped — confirmed by Stage 1
- [ ] Props have been renamed to generic vocabulary where needed
- [ ] Migration guide written if Cockpit will now import from `@pcampus/ui`

---

## Breaking Change Review

Any PR that changes existing public API (prop rename, removal, behavior change):

- [ ] Semver major version bump prepared
- [ ] Migration guide written in `CHANGELOG.md`
- [ ] All known consumers (Cockpit, PIP, etc.) assessed for impact
- [ ] Human approval required before merge — not agent-only decision
