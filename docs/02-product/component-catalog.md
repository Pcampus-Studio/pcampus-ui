# Component Catalog — @pcampus/ui

> Install: `npm install @pcampus/ui`  
> Import CSS tokens: `import '@pcampus/ui/dist/esm/tokens/index.css'`  
> Wrap app: `<ThemeProvider>...</ThemeProvider>`

---

## Quick Start

```tsx
// 1. Install
// npm install @pcampus/ui

// 2. Wrap your app
import { ThemeProvider } from '@pcampus/ui';
import '@pcampus/ui/dist/esm/tokens/index.css';

function App() {
  return (
    <ThemeProvider theme="system">
      <YourApp />
    </ThemeProvider>
  );
}

// 3. Use components
import { Button, Modal, SnapshotPanel, Toast } from '@pcampus/ui';
```

---

## Tier 1 — Tokens

Importable as JS or as CSS custom properties.

```tsx
// JS
import { tokens } from '@pcampus/ui';
console.log(tokens.pcampusColorPrimary); // '#2952A3'

// CSS — on :root after importing the CSS file
// var(--pcampus-color-primary)   → #2952A3
// var(--pcampus-color-accent)    → #C87533
// var(--pcampus-color-surface)   → #F9F8F6
// var(--pcampus-space-6)         → 16px
// var(--pcampus-text-base)       → 14px
// var(--pcampus-duration-panel)  → 220ms
```

Service token override:
```css
/* pip/src/styles/tokens.css */
@import '@pcampus/ui/dist/esm/tokens/index.css';

:root {
  /* Override only semantic tokens */
  --pcampus-color-primary: #1D4ED8;
}
```

---

## Tier 2 — Primitives

### Button

```tsx
import { Button } from '@pcampus/ui';

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">View</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   // default
<Button size="lg">Large</Button>

// States
<Button loading>Saving…</Button>
<Button disabled>Unavailable</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowRightIcon />}>Next</Button>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | `boolean` | `false` |
| `leftIcon` | `React.ReactNode` | — |
| `rightIcon` | `React.ReactNode` | — |
| + all native `<button>` props | | |

---

### Badge

```tsx
import { Badge } from '@pcampus/ui';

<Badge>Default</Badge>
<Badge variant="primary">Active</Badge>
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="neutral">Draft</Badge>

// Dot only (no text)
<Badge variant="success" dot />
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'default'` |
| `size` | `'sm' \| 'md'` | `'md'` |
| `dot` | `boolean` | `false` |

---

### Avatar

```tsx
import { Avatar } from '@pcampus/ui';

// From image
<Avatar src="/photo.jpg" name="Nattha P" size="md" />

// Initials fallback
<Avatar name="Nattha Pcampus" size="lg" />   // → "NP"

// Sizes
<Avatar name="User" size="xs" />  // 24px
<Avatar name="User" size="sm" />  // 32px
<Avatar name="User" size="md" />  // 40px — default
<Avatar name="User" size="lg" />  // 56px
```

| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | — |
| `name` | `string` | — |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `shape` | `'circle' \| 'square'` | `'circle'` |

---

### Spinner

```tsx
import { Spinner } from '@pcampus/ui';

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" color="white" />
```

| Prop | Type | Default |
|------|------|---------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'white' \| 'neutral'` | `'primary'` |

---

### Skeleton

```tsx
import { Skeleton } from '@pcampus/ui';

// Single line
<Skeleton width="200px" height="16px" />

// Multiple stacked lines
<Skeleton lines={3} />

// Circle (avatar placeholder)
<Skeleton width="40px" height="40px" radius="full" />
```

| Prop | Type | Default |
|------|------|---------|
| `width` | `string \| number` | `'100%'` |
| `height` | `string \| number` | `'16px'` |
| `radius` | `'sm' \| 'md' \| 'full'` | `'sm'` |
| `lines` | `number` | — |

---

## Tier 2 — Form Controls

### Input

```tsx
import { Input } from '@pcampus/ui';

// Basic
<Input label="Email" placeholder="you@example.com" />

// With hint
<Input
  label="Business Name"
  hint="This will appear on invoices"
  placeholder="Pcampus Co., Ltd."
/>

// Error state
<Input
  label="Phone"
  error="Phone number is required"
  value={phone}
  onChange={e => setPhone(e.target.value)}
/>

// With icons
<Input leftElement={<SearchIcon />} placeholder="Search…" />
<Input rightElement={<Button size="sm">Go</Button>} />
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `hint` | `string` | — |
| `error` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `leftElement` | `React.ReactNode` | — |
| `rightElement` | `React.ReactNode` | — |
| + all native `<input>` props | | |

---

### Select

```tsx
import { Select } from '@pcampus/ui';

<Select
  label="Status"
  placeholder="Select status…"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ]}
  value={status}
  onChange={e => setStatus(e.target.value)}
/>
```

---

### Checkbox

```tsx
import { Checkbox } from '@pcampus/ui';

<Checkbox label="I agree to the terms" />
<Checkbox label="Select all" indeterminate />
<Checkbox label="Disabled option" disabled checked />
```

---

### Radio + RadioGroup

```tsx
import { RadioGroup } from '@pcampus/ui';

<RadioGroup
  name="plan"
  value={plan}
  onChange={setPlan}
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
/>
```

---

### Toggle

```tsx
import { Toggle } from '@pcampus/ui';

<Toggle
  label="Email notifications"
  checked={enabled}
  onChange={setEnabled}
/>
```

---

## Tier 2 — Overlays

### Modal

```tsx
import { Modal } from '@pcampus/ui';

const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit Business Profile"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleSave} loading={saving}>Save</Button>
    </>
  }
>
  <Input label="Business Name" value={name} onChange={...} />
</Modal>
```

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | — |
| `onClose` | `() => void` | — |
| `title` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` |
| `closeOnBackdrop` | `boolean` | `true` |
| `footer` | `React.ReactNode` | — |

---

### Dialog (confirm)

```tsx
import { Dialog } from '@pcampus/ui';

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete this member?"
  description="This action cannot be undone."
  variant="destructive"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  loading={deleting}
/>
```

---

### Toast

```tsx
import { ToastProvider, useToast } from '@pcampus/ui';

// 1. Wrap app
<ToastProvider>
  <App />
</ToastProvider>

// 2. Use anywhere
function MyComponent() {
  const { toast } = useToast();

  const handleSave = async () => {
    await save();
    toast({
      variant: 'success',
      title: 'Saved',
      description: 'Your changes have been saved.',
    });
  };

  const handleError = () => {
    toast({
      variant: 'error',
      title: 'Failed to save',
      description: 'Please try again.',
      duration: 0,   // persist until dismissed
      action: { label: 'Retry', onClick: handleSave },
    });
  };
}
```

| Toast prop | Type | Default |
|------------|------|---------|
| `variant` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` |
| `title` | `string` | — |
| `description` | `string` | — |
| `duration` | `number` (ms) | `4000` |
| `action` | `{ label: string; onClick: () => void }` | — |

---

### Tooltip

```tsx
import { Tooltip } from '@pcampus/ui';

<Tooltip content="Copy to clipboard" placement="top">
  <Button variant="ghost" size="sm"><CopyIcon /></Button>
</Tooltip>
```

---

### Dropdown (menu)

```tsx
import { Dropdown } from '@pcampus/ui';

<Dropdown
  trigger={<Button variant="ghost" rightIcon={<ChevronDownIcon />}>Actions</Button>}
  placement="bottom-end"
  items={[
    { label: 'Edit', icon: <EditIcon />, onClick: handleEdit },
    { label: 'Duplicate', onClick: handleDuplicate },
    { label: 'Archive', onClick: handleArchive, separator: true },
    { label: 'Delete', onClick: handleDelete, destructive: true },
  ]}
/>
```

---

## Tier 3 — Layout

### ThemeProvider

```tsx
import { ThemeProvider } from '@pcampus/ui';
import '@pcampus/ui/dist/esm/tokens/index.css';

// System auto (follows OS preference) — default
<ThemeProvider>...</ThemeProvider>

// Force light or dark
<ThemeProvider theme="dark">...</ThemeProvider>

// Service token overrides
<ThemeProvider tokenOverrides={{ '--pcampus-color-primary': '#1D4ED8' }}>
  ...
</ThemeProvider>
```

---

### AppShell

```tsx
import { AppShell } from '@pcampus/ui';

<AppShell
  serviceName="PBCP Cockpit"
  logo={<CockpitLogo />}
  navItems={[
    { label: 'Dashboard', icon: <HomeIcon />, href: '/', active: true },
    { label: 'Members', icon: <UsersIcon />, href: '/members', badge: 3 },
    { label: 'Orders', icon: <ShoppingCartIcon />, href: '/orders' },
    {
      label: 'Reports',
      icon: <ChartIcon />,
      children: [
        { label: 'Sales', href: '/reports/sales' },
        { label: 'Performance', href: '/reports/performance' },
      ],
    },
  ]}
  topBarRight={
    <Avatar src={user.photo} name={user.name} size="sm" />
  }
>
  <YourPageContent />
</AppShell>
```

| Prop | Type | Default |
|------|------|---------|
| `serviceName` | `string` | — |
| `logo` | `React.ReactNode` | — |
| `navItems` | `NavItem[]` | — |
| `topBarRight` | `React.ReactNode` | — |
| `sidebarCollapsed` | `boolean` | `false` |
| `onSidebarToggle` | `(collapsed: boolean) => void` | — |

---

### SnapshotPanel

```tsx
import { SnapshotPanel } from '@pcampus/ui';

<SnapshotPanel
  sections={[
    {
      title: 'Business Info',
      rows: [
        { label: 'Business Name', value: 'Pcampus Co., Ltd.' },
        { label: 'Tax ID', value: '0105563001234', copyable: true },
        { label: 'Status', value: <Badge variant="success">Active</Badge> },
      ],
    },
    {
      title: 'Contact',
      rows: [
        { label: 'Phone', value: '02-xxx-xxxx' },
        { label: 'Email', value: 'info@pcampus.com' },
      ],
    },
  ]}
/>

// Loading state
<SnapshotPanel loading sections={[{ rows: [{label:'',value:''}] }]} />
```

Visual output:
```
BUSINESS INFO
──────────────────────────────────
Business Name          Pcampus Co., Ltd.
Tax ID                 0105563001234  ⧉
Status                 ● Active

CONTACT
──────────────────────────────────
Phone                  02-xxx-xxxx
Email                  info@pcampus.com
```

---

### SplitPanel

```tsx
import { SplitPanel } from '@pcampus/ui';

<SplitPanel
  left={<MemberList members={members} onSelect={setSelected} />}
  right={selected ? <MemberDetail member={selected} /> : null}
  leftWidth="360px"
/>
```

---

### Alert

```tsx
import { Alert } from '@pcampus/ui';

<Alert variant="info" title="New feature available">
  Enable invoice auto-send in Settings.
</Alert>

<Alert
  variant="error"
  title="Payment failed"
  description="Your last payment could not be processed."
  action={{ label: 'Update payment', onClick: handleUpdatePayment }}
  dismissible
/>
```

---

### EmptyState

```tsx
import { EmptyState } from '@pcampus/ui';

<EmptyState
  icon={<UsersIcon />}
  title="No members yet"
  description="Add your first member to get started."
  action={{ label: 'Add member', onClick: handleAdd }}
/>
```

---

## Complete Export List

```tsx
// Tokens
export { tokens } from '@pcampus/ui';

// Primitives
export {
  Button,       // ButtonProps
  Badge,        // BadgeProps
  Avatar,       // AvatarProps
  Spinner,      // SpinnerProps
  Skeleton,     // SkeletonProps
  Input,        // InputProps
  Textarea,     // TextareaProps
  Select,       // SelectProps
  Checkbox,     // CheckboxProps
  Radio,        // RadioProps
  RadioGroup,   // RadioGroupProps
  Toggle,       // ToggleProps
  FormField,    // FormFieldProps
  Modal,        // ModalProps
  Dialog,       // DialogProps
  Toast,        // ToastProps
  ToastProvider,
  useToast,
  Tooltip,      // TooltipProps
  Popover,      // PopoverProps
  Dropdown,     // DropdownProps, DropdownItem
  Alert,        // AlertProps
  EmptyState,   // EmptyStateProps
} from '@pcampus/ui';

// Layout
export {
  ThemeProvider, // ThemeProviderProps
  AppShell,      // AppShellProps, NavItem
  SnapshotPanel, // SnapshotPanelProps, SnapshotSection, SnapshotRow
  SplitPanel,    // SplitPanelProps
} from '@pcampus/ui';
```

---

## Goal implementation order

| Goal | Components | Status |
|------|-----------|--------|
| G-001 | Package scaffold | planned |
| G-002 | Tokens (`--pcampus-*`) | planned |
| G-003 | Button, Badge, Avatar, Spinner, Skeleton | planned |
| G-004 | Input, Select, Checkbox, Radio, Toggle | planned |
| G-005 | Modal, Dialog, Toast, Tooltip, Popover, Dropdown | planned |
| G-006 | ThemeProvider, AppShell, SnapshotPanel, SplitPanel, Alert, EmptyState | planned |

---

## Related

- [docs/03-architecture/design-tokens.md](../03-architecture/design-tokens.md) — token values
- [.agents/product.md](../../.agents/product.md) — tier system + promotion rules
- [.agents/engineering.md](../../.agents/engineering.md) — component API standards
- [.agents/review.md](../../.agents/review.md) — publish gates
