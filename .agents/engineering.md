# Engineering Constitution — pcampus-ui

> **Base:** [Pcampus-Agent-OS/.agents/](../../Pcampus-Agent-OS/.agents/)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict) |
| Framework | React 18+ |
| Styling | CSS custom properties (design tokens) + Tailwind (optional utility layer) |
| Build | tsup — ESM + CJS dual output |
| Dev server | Storybook 8 |
| Testing | Vitest + Testing Library |
| Package | `@pcampus/ui` on npm (or private registry) |

---

## Package Structure

```
code/
├── src/
│   ├── tokens/          ← CSS custom properties + JS token exports
│   ├── primitives/      ← Tier 2 components (Button, Input, Badge...)
│   ├── layout/          ← Tier 3 components (AppShell, SplitPanel, SnapshotPanel...)
│   ├── charts/          ← Tier 4 data visualizations
│   └── index.ts         ← barrel export
├── stories/             ← Storybook stories, one per component
├── tests/               ← Vitest unit tests
└── package.json
```

---

## Component API Standards

### Naming

- Component name: PascalCase, generic noun — `Button`, `SnapshotPanel`, `AppShell`
- No domain vocabulary in component names — not `StoryButton`, not `EvidencePanel`
- File name: kebab-case matching component — `snapshot-panel.tsx`

### Props interface

```typescript
// Always export the props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  // NO domain props: no evidence, no story, no fact, no entity
}
```

### Forwarded refs

All interactive components must forward refs:
```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={...} {...props} />;
  }
);
Button.displayName = 'Button';
```

### Token-only styling

- No hardcoded color values in component source
- No hardcoded pixel values that should come from tokens
- All visual properties map to `--pcampus-*` CSS custom properties

```typescript
// ✓ Correct
style={{ color: 'var(--pcampus-color-primary)' }}
className="text-[var(--pcampus-text-sm)]"

// ✗ Wrong
style={{ color: '#2952A3' }}
style={{ fontSize: '14px' }}
```

---

## Token Naming Convention

All tokens follow the pattern: `--pcampus-{category}-{variant}`

| Category | Examples |
|----------|---------|
| `color` | `--pcampus-color-primary`, `--pcampus-color-surface` |
| `blue` | `--pcampus-blue-600`, `--pcampus-blue-100` |
| `gray` | `--pcampus-gray-900`, `--pcampus-gray-50` |
| `text` | `--pcampus-text-sm`, `--pcampus-text-base` |
| `space` | `--pcampus-space-4`, `--pcampus-space-8` |
| `duration` | `--pcampus-duration-fast`, `--pcampus-duration-pulse` |
| `ease` | `--pcampus-ease-default`, `--pcampus-ease-out` |
| `font` | `--pcampus-font-sans`, `--pcampus-font-mono` |

**Never use Cockpit-specific token names in this package.** If Cockpit uses `--evidence-blue`, this package uses `--pcampus-color-primary`.

---

## Storybook Requirements

Every component must have a story file before it can be merged:

```typescript
// stories/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/primitives/button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: { variant: { control: 'select' } },
};
export default meta;

export const Primary: StoryObj<typeof Button> = { args: { variant: 'primary', children: 'Button' } };
export const Secondary: StoryObj<typeof Button> = { args: { variant: 'secondary', children: 'Button' } };
export const Ghost: StoryObj<typeof Button> = { args: { variant: 'ghost', children: 'Button' } };
export const Destructive: StoryObj<typeof Button> = { args: { variant: 'destructive', children: 'Button' } };
export const Loading: StoryObj<typeof Button> = { args: { loading: true, children: 'Button' } };
```

---

## Testing Requirements

Every component must have a test before merge:

```typescript
// tests/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../src/primitives/button';

test('renders with correct label', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});

test('shows loading state', () => {
  render(<Button loading>Save</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

---

## Export Rules

All public components and types must be exported from `src/index.ts`:

```typescript
// src/index.ts
export { Button } from './primitives/button';
export type { ButtonProps } from './primitives/button';
export { SnapshotPanel } from './layout/snapshot-panel';
export type { SnapshotPanelProps } from './layout/snapshot-panel';
// tokens
export * as tokens from './tokens';
```

Nothing is exported from nested paths. Consumers always import from `@pcampus/ui`:
```typescript
// ✓ Correct
import { Button, SnapshotPanel } from '@pcampus/ui';

// ✗ Wrong
import { Button } from '@pcampus/ui/primitives/button';
```

---

## Hard Rules

- **No business logic** — components are dumb; they render props, emit events, nothing more
- **No API calls** — no fetch, no React Query, no SWR inside components
- **No auth** — no auth context, no permission checks
- **No routing** — no Next.js Link, no React Router inside components
- **No domain vocabulary** in component names, prop names, or exported types
- **Token-only styling** — no hardcoded colors or magic numbers
- **Story before merge** — no component ships without a Storybook story
- **Test before merge** — no component ships without a unit test
- **Semver on breaking changes** — any prop rename or removal is a major version bump

---

## LOCK SCOPE — Single Source of Visual Truth (Anti-Context-Drift)

> **This section is IMMUTABLE.** No agent may modify it without a human-approved ADR.  
> Violation = immediate halt; ask human before proceeding.

### What this library IS

`@pcampus-studio/ui` is the **one and only** source of visual design for the entire Pcampus ecosystem. Every color, spacing, radius, shadow, animation, typography, chart, and motion pattern that appears in **any** Pcampus service **must** originate here.

### FORBIDDEN — never do these

| ✗ Forbidden | Why |
|-------------|-----|
| CSS vars outside `--pcampus-*` namespace | Token drift |
| Hardcoding any hex (`#2952A3`), rgb, or hsl value | Bypasses token system |
| Hardcoding pixel/ms values that have a token (`14px`, `6px`, `220ms`) | Same |
| `style={{ color: '...', fontSize: '...' }}` for visual properties | Blocks hover/focus/disabled states |
| Component names with domain vocabulary (`StoryButton`, `EvidencePanel`) | Library is generic |
| Importing `next/link`, `react-router`, or any framework module | Must be framework-agnostic |
| Shipping component without `className` passthrough | Breaks consumer extensibility |
| Chart that duplicates Recharts primitive without pcampus token wrapper | Use Recharts as base |
| Motion/animation with hardcoded timing values | Use `--pcampus-duration-*`, `--pcampus-ease-*` |
| New animation keyframe with hardcoded colors or values | Use token vars |

### REQUIRED before any new component merges

- [ ] All visual properties via `--pcampus-*` var or Tailwind utility from `@theme inline`
- [ ] `className` prop forwarded to root element
- [ ] No hardcoded hex, no hardcoded values that have tokens
- [ ] Storybook story — all variants, light + dark
- [ ] Vitest unit test — render + key interactions
- [ ] Exported from `src/index.ts` barrel
- [ ] Charts: Recharts base + all colors from `--pcampus-color-*`
- [ ] Motion: all timing and easing from `--pcampus-duration-*` / `--pcampus-ease-*`

### Tier map — what belongs where

| Tier | Folder | Ships as |
|------|--------|----------|
| Tokens | `src/tokens/` | `dist/tokens.css` — `--pcampus-*` CSS vars |
| Theme | `src/styles/theme.css` | `dist/theme.css` — Tailwind preset (services with Tailwind) |
| Components | `src/styles/components.css` | `dist/index.css` — pre-built utilities (services without Tailwind) |
| Primitives | `src/primitives/` | Button, Badge, Avatar, Spinner, Skeleton, Card, ButtonLink |
| Forms | `src/forms/` | Input, Select, Checkbox, Radio, Toggle, FormField |
| Overlays | `src/overlays/` | Modal, Dialog, Toast, Tooltip, Popover, Dropdown |
| Layout | `src/layout/` | ThemeProvider, AppShell, SnapshotPanel, SplitPanel, Alert, EmptyState |
| Charts | `src/charts/` | FunnelChart, FunnelMiniChart, KpiChart, LineChart, BarChart, SankeyChart |
| Motion | `src/motion/` | Keyframes, transition presets, `useMotionPreference` hook |

### What consuming services MAY do

1. Import from `@pcampus-studio/ui` — components, tokens, charts, motion
2. Override **semantic** tokens only: `--pcampus-color-primary: #1D4ED8`
3. Add **domain** tokens in their own namespace on top: `--color-evidence-blue: #2952A3`
4. Extend Tailwind with domain colors in their own `@theme inline` additions
5. Write domain components that **compose from** pcampus-ui primitives

### What consuming services MUST NOT do

1. Copy component source from pcampus-ui into their repo
2. Define generic visual tokens independently of pcampus-ui
3. `style={{ color: '#...' }}` in any component
4. Create a button, card, chart, or animation from scratch without checking pcampus-ui first
