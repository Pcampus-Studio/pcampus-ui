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
