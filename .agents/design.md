# Design Constitution — pcampus-ui

> **Source of truth:** PBCP Cockpit `.agents/design.md` + `docs/design/design-tokens.md`
> This file governs how Cockpit's visual language is translated into generic, reusable form.

---

## The Governing Principle

**Cockpit designs. pcampus-ui packages.**

Antigravity does not design new components in this repo. Every visual decision originates in Cockpit and is extracted here. This ensures the design system reflects production reality — not speculation.

---

## Visual Foundation (from Cockpit)

### Color Tokens

All color tokens are extracted from Cockpit's `design-tokens.md` verbatim. They are prefixed with `--pcampus-` in CSS custom properties.

**Brand:**
```css
--pcampus-blue-600: #2952A3;    /* Evidence Blue — primary brand */
--pcampus-amber-600: #C87533;   /* Story Amber — accent */
--pcampus-gray-900: #0F1117;    /* Primary text */
--pcampus-gray-50:  #F8F9FA;    /* Background */
```

**Semantic (generic names for cross-service use):**
```css
--pcampus-color-primary:     var(--pcampus-blue-600);
--pcampus-color-accent:      var(--pcampus-amber-600);
--pcampus-color-surface:     var(--pcampus-gray-50);
--pcampus-color-text:        var(--pcampus-gray-900);
--pcampus-color-border:      #E2E8F0;
--pcampus-color-error:       #DC2626;
--pcampus-color-success:     #16A34A;
--pcampus-color-warning:     #D97706;
```

**Services may define their own semantic overrides** — e.g. PIP may remap `--pcampus-color-primary` to their brand color. The token names stay the same; the values change per service context.

---

### Typography

```css
--pcampus-font-sans: 'Inter', system-ui, sans-serif;
--pcampus-font-mono: 'JetBrains Mono', monospace;

/* Scale */
--pcampus-text-xs:   0.75rem;   /* 12px */
--pcampus-text-sm:   0.875rem;  /* 14px */
--pcampus-text-base: 1rem;      /* 16px */
--pcampus-text-lg:   1.125rem;  /* 18px */
--pcampus-text-xl:   1.25rem;   /* 20px */
--pcampus-text-2xl:  1.5rem;    /* 24px */
```

---

### Spacing

4pt grid — all spacing values are multiples of 4px.

```css
--pcampus-space-1:  0.25rem;   /*  4px */
--pcampus-space-2:  0.5rem;    /*  8px */
--pcampus-space-3:  0.75rem;   /* 12px */
--pcampus-space-4:  1rem;      /* 16px */
--pcampus-space-6:  1.5rem;    /* 24px */
--pcampus-space-8:  2rem;      /* 32px */
--pcampus-space-12: 3rem;      /* 48px */
--pcampus-space-16: 4rem;      /* 64px */
```

---

### Motion

```css
--pcampus-duration-fast:   150ms;
--pcampus-duration-base:   250ms;
--pcampus-duration-slow:   400ms;
--pcampus-duration-pulse: 3000ms;   /* Living Pulse — active entity indicator */

--pcampus-ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--pcampus-ease-in:      cubic-bezier(0.4, 0, 1, 1);
--pcampus-ease-out:     cubic-bezier(0, 0, 0.2, 1);
```

---

## Component Design Rules

### What makes a component generic

A component is generic when:
- Its props contain no domain vocabulary (no `story`, `evidence`, `fact`, `entity`, `business`)
- It could be used by a school management app without modification
- Its visual style comes from tokens only — no hardcoded colors or sizes

### Extraction checklist (when promoting from Cockpit)

Before a Cockpit component becomes a `@pcampus/ui` component:

- [ ] Strip all domain-specific props — replace with generic equivalents
- [ ] Replace all hardcoded color values with token variables
- [ ] Replace all hardcoded size values with spacing token variables
- [ ] Ensure component works without any Cockpit-specific context providers
- [ ] Write a Storybook story demonstrating all variants
- [ ] Verify the component looks correct with a different `--pcampus-color-primary`

### SnapshotPanel pattern

The `SnapshotPanel` is the canonical Pcampus data display pattern — a panel with grouped label-value rows. All services use this for entity detail views.

```
SECTION TITLE          Subtitle
────────────────────────────────
Label                      Value
Label                      Value
Label                      Value
```

Rules:
- Label left-aligned, value right-aligned
- No card borders, no grid, no background boxes
- Divider between sections — 1px `--pcampus-color-border`
- Font size: `--pcampus-text-sm` for labels, `--pcampus-text-sm` medium for values

### AppShell pattern

Standard shell for all Pcampus services:
- Top navigation: service name + user avatar + service switcher (future)
- Left sidebar: collapsible, 240px expanded / 64px collapsed
- Content area: flex-1, scrollable
- No Cockpit-specific navigation items — shell accepts nav items as props

---

## What Does NOT Belong in Design Specs Here

- Evidence Substrate (2px left-border) — PBCP-specific, stays in Cockpit design.md
- Causal Thread tristate — PBCP-specific
- Story Amber as Business Moment marker — PBCP-specific
- Living Pulse on evidence elements — PBCP-specific
- Three Identity Gates — PBCP-specific quality gates

These patterns live in PBCP Cockpit's design.md. This repo provides the structural foundation they are built on top of.

---

## Antigravity's Role in This Repo

Antigravity reviews promoted components for:
1. Visual consistency with Cockpit's established patterns
2. Token correctness — no hardcoded values
3. Storybook story completeness — all variants, all states
4. Dark mode correctness

Antigravity does NOT design new patterns here. If a new pattern is needed, it is designed in Cockpit first.
