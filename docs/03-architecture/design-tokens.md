# Design Tokens — @pcampus/ui

> **Source of truth:** PBCP Cockpit `docs/design/design-tokens.md`
> This file extracts generic tokens from Cockpit and renames them with the `--pcampus-*` prefix for cross-service use.
>
> **Rule:** Never use raw values in component code. Always reference the token name.
> When a value changes, it changes here — nowhere else.

---

## Token Naming Convention

```
--pcampus-{category}-{variant}
```

| Category | Examples |
|----------|---------|
| `color` | semantic aliases — `--pcampus-color-primary` |
| `blue` | raw palette — `--pcampus-blue-600` |
| `amber` | raw palette — `--pcampus-amber-600` |
| `green` | raw palette — `--pcampus-green-600` |
| `gray` | raw palette — `--pcampus-gray-900` |
| `red` | raw palette — `--pcampus-red-600` |
| `teal` | raw palette — `--pcampus-teal-600` |
| `text` | `--pcampus-text-sm`, `--pcampus-text-base` |
| `font` | `--pcampus-font-sans`, `--pcampus-font-mono` |
| `space` | `--pcampus-space-4`, `--pcampus-space-8` |
| `border` | `--pcampus-border-hairline` |
| `radius` | `--pcampus-radius-sm`, `--pcampus-radius-md` |
| `shadow` | `--pcampus-shadow-overlay` |
| `duration` | `--pcampus-duration-fast`, `--pcampus-duration-pulse` |
| `ease` | `--pcampus-ease-default`, `--pcampus-ease-enter` |
| `layout` | `--pcampus-layout-nav-height` |
| `z` | `--pcampus-z-overlay`, `--pcampus-z-modal` |

---

## Color System

### Raw Palette

These are the brand color values. Use palette tokens only to define semantic tokens — never reference them directly in components.

```css
:root {
  /* Blue — Pcampus primary brand */
  --pcampus-blue-100: rgba(41, 82, 163, 0.12);
  --pcampus-blue-300: rgba(41, 82, 163, 0.30);
  --pcampus-blue-400: #4B7FD4;
  --pcampus-blue-600: #2952A3;

  /* Amber — accent, secondary highlight */
  --pcampus-amber-300: #E8A96A;
  --pcampus-amber-100: rgba(200, 117, 51, 0.10);
  --pcampus-amber-600: #C87533;

  /* Green — completion, success */
  --pcampus-green-100: rgba(42, 122, 75, 0.10);
  --pcampus-green-600: #2A7A4B;

  /* Slate — partial, inactive, building */
  --pcampus-slate-100: rgba(143, 155, 179, 0.15);
  --pcampus-slate-400: #8F9BB3;

  /* Red — critical negative outcomes */
  --pcampus-red-100:  rgba(192, 57, 43, 0.08);
  --pcampus-red-600:  #C0392B;

  /* Teal — investigation, research depth */
  --pcampus-teal-100: rgba(26, 122, 110, 0.10);
  --pcampus-teal-600: #1A7A6E;

  /* Gray — backgrounds, text, borders */
  --pcampus-gray-50:  #F9F8F6;
  --pcampus-gray-100: #F3F2EF;
  --pcampus-gray-900: #0D0D0C;
}
```

### Semantic Color Tokens

These are the tokens components import. Services remap these to their own brand by overriding semantic tokens only — raw palette stays the same.

```css
:root {
  /* Primary action + interactive */
  --pcampus-color-primary:        var(--pcampus-blue-600);
  --pcampus-color-primary-bright: var(--pcampus-blue-400);
  --pcampus-color-primary-subtle: var(--pcampus-blue-100);
  --pcampus-color-primary-border: var(--pcampus-blue-300);

  /* Accent / secondary highlight */
  --pcampus-color-accent:         var(--pcampus-amber-600);
  --pcampus-color-accent-light:   var(--pcampus-amber-300);
  --pcampus-color-accent-subtle:  var(--pcampus-amber-100);

  /* States */
  --pcampus-color-success:        var(--pcampus-green-600);
  --pcampus-color-success-subtle: var(--pcampus-green-100);
  --pcampus-color-error:          var(--pcampus-red-600);
  --pcampus-color-error-subtle:   var(--pcampus-red-100);
  --pcampus-color-neutral:        var(--pcampus-slate-400);
  --pcampus-color-neutral-subtle: var(--pcampus-slate-100);

  /* Surface */
  --pcampus-color-surface:        var(--pcampus-gray-50);
  --pcampus-color-surface-subtle: var(--pcampus-gray-100);
  --pcampus-color-overlay:        rgba(249, 248, 246, 0.92);

  /* Text */
  --pcampus-color-text:           var(--pcampus-gray-900);
  --pcampus-color-text-secondary: #4A4A48;
  --pcampus-color-text-tertiary:  #8A8A87;
  --pcampus-color-text-disabled:  #C4C4C1;
  --pcampus-color-text-inverse:   var(--pcampus-gray-50);

  /* Border */
  --pcampus-color-border:         rgba(13, 13, 12, 0.08);
  --pcampus-color-border-subtle:  rgba(13, 13, 12, 0.05);
  --pcampus-color-border-strong:  rgba(13, 13, 12, 0.16);
}
```

### Dark Mode

Forced via `data-theme="dark"` (ThemeProvider / Storybook) or `.dark` on `<html>` (ThemeToggle). System preference applies only when neither forces light.

```css
:root[data-theme="dark"],
:root.dark {
  --pcampus-color-surface:          #0F0F0E;
  --pcampus-color-surface-subtle:   #1A1A19;
  --pcampus-color-overlay:          rgba(15, 15, 14, 0.92);

  --pcampus-color-primary:          var(--pcampus-blue-400);
  --pcampus-color-primary-bright:   #6B9FE4;
  --pcampus-color-primary-subtle:   rgba(75, 127, 212, 0.12);
  --pcampus-color-primary-border:   rgba(75, 127, 212, 0.30);

  --pcampus-color-accent:           #D4884D;
  --pcampus-color-accent-light:     #E8A96A;
  --pcampus-color-accent-subtle:    rgba(212, 136, 77, 0.12);

  --pcampus-color-surface-card:     #1c1c1b;
  --pcampus-color-success:          #3DAB6A;
  --pcampus-color-error:            #E74C3C;
  --pcampus-color-neutral:          #6B7A9E;

  --pcampus-color-text:             #F0EFED;
  --pcampus-color-text-secondary:   #A8A8A5;
  --pcampus-color-text-tertiary:    #6A6A67;

  --pcampus-color-border:           rgba(240, 239, 237, 0.08);
  --pcampus-color-border-subtle:    rgba(240, 239, 237, 0.05);
  --pcampus-color-border-strong:    rgba(240, 239, 237, 0.16);
}
```

---

## Typography

### Font Families

```css
:root {
  /* Default sans-serif — narrative and UI text */
  --pcampus-font-sans: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", sans-serif;

  /* Monospace — technical display, code, IDs */
  --pcampus-font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
}
```

### Type Scale

Source: Cockpit type scale, values unchanged.

```css
:root {
  --pcampus-text-2xs:  10px;
  --pcampus-text-xs:   11px;
  --pcampus-text-sm:   12px;
  --pcampus-text-base: 14px;
  --pcampus-text-md:   15px;
  --pcampus-text-lg:   17px;
  --pcampus-text-xl:   20px;
  --pcampus-text-2xl:  24px;
  --pcampus-text-3xl:  30px;
  --pcampus-text-4xl:  38px;

  /* Line heights */
  --pcampus-leading-2xs:  1.40;
  --pcampus-leading-xs:   1.45;
  --pcampus-leading-sm:   1.50;
  --pcampus-leading-base: 1.60;
  --pcampus-leading-md:   1.50;
  --pcampus-leading-lg:   1.40;
  --pcampus-leading-xl:   1.35;
  --pcampus-leading-2xl:  1.25;
  --pcampus-leading-3xl:  1.20;
  --pcampus-leading-4xl:  1.10;

  /* Tabular numerals feature — use for all metric and count displays */
  --pcampus-font-feature-tabular: "tnum" 1, "kern" 1;
}
```

---

## Spacing

4pt base grid. Dense within data clusters; generous between concepts.

```css
:root {
  --pcampus-space-1:   4px;   /* between icon and label */
  --pcampus-space-2:   6px;   /* between inline elements */
  --pcampus-space-3:   8px;   /* within compact components */
  --pcampus-space-4:  10px;   /* between compact items */
  --pcampus-space-5:  12px;   /* within cards, between fields */
  --pcampus-space-6:  16px;   /* standard component padding */
  --pcampus-space-7:  20px;   /* between related components */
  --pcampus-space-8:  24px;   /* standard section gap */
  --pcampus-space-9:  32px;   /* between distinct information zones */
  --pcampus-space-10: 40px;   /* between major sections */
  --pcampus-space-11: 48px;   /* between page-level regions */
  --pcampus-space-12: 64px;   /* major concept separation */
  --pcampus-space-13: 80px;   /* page margins */
  --pcampus-space-14: 96px;   /* hero space */
}
```

### Semantic Spacing

```css
:root {
  /* Component internals */
  --pcampus-space-component-padding: var(--pcampus-space-6);
  --pcampus-space-card-padding:      var(--pcampus-space-5);
  --pcampus-space-panel-padding:     var(--pcampus-space-7);
  --pcampus-space-page-margin:       var(--pcampus-space-9);

  /* Touch target minimum (WCAG AA) */
  --pcampus-touch-target-min: 44px;
}
```

---

## Border & Shape

```css
:root {
  /* Stroke widths */
  --pcampus-border-hairline: 1px;
  --pcampus-border-strong:   2px;

  /* Border radius */
  --pcampus-radius-none: 0px;
  --pcampus-radius-xs:   2px;
  --pcampus-radius-sm:   4px;
  --pcampus-radius-md:   6px;
  --pcampus-radius-lg:   8px;
  --pcampus-radius-xl:   12px;
  --pcampus-radius-full: 9999px;
}
```

---

## Shadow & Depth

Depth is earned. Apply only where it communicates hierarchy.

```css
:root {
  /* No shadow — flat content layer */
  --pcampus-shadow-none: none;

  /* Overlay — side panels, drawers, contextual popups */
  --pcampus-shadow-overlay:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.05);

  /* Modal — dialogs, full-focus surfaces */
  --pcampus-shadow-modal:
    0 8px 24px rgba(0, 0, 0, 0.10),
    0 0 0 1px rgba(0, 0, 0, 0.07);

  /* Backdrop blur base (for overlay backgrounds) */
  --pcampus-backdrop-blur: blur(8px);
}
```

---

## Motion

Every animation communicates something. If you cannot say what it communicates, remove it.

```css
:root {
  /* Duration */
  --pcampus-duration-instant:  0ms;
  --pcampus-duration-fast:     100ms;   /* hover, focus, state changes */
  --pcampus-duration-panel:    220ms;   /* panel open/close */
  --pcampus-duration-base:     300ms;   /* page transitions, modal entry */
  --pcampus-duration-pulse:   3000ms;   /* living pulse — active entity indicator */
  --pcampus-duration-shimmer: 2000ms;   /* loading / building states */

  /* Easing */
  --pcampus-ease-default: cubic-bezier(0.16, 1, 0.3, 1);   /* standard UI */
  --pcampus-ease-enter:   cubic-bezier(0.0, 0.0, 0.2, 1);  /* elements arriving */
  --pcampus-ease-exit:    cubic-bezier(0.4, 0.0, 1, 1);    /* elements leaving */
  --pcampus-ease-linear:  linear;                           /* time-based, pulse */
}
```

**Never use bounce or spring easing.** Business systems do not bounce.

---

## Layout

```css
:root {
  /* AppShell */
  --pcampus-layout-nav-height:     48px;
  --pcampus-layout-sidebar-width:  240px;   /* expanded */
  --pcampus-layout-sidebar-collapsed: 64px; /* collapsed, icon-only */

  /* Content */
  --pcampus-layout-content-max:    1280px;
  --pcampus-layout-panel-width:    320px;   /* side detail panels */
}
```

---

## Z-Index

```css
:root {
  --pcampus-z-base:    0;
  --pcampus-z-content: 1;
  --pcampus-z-sticky:  10;   /* sticky headers */
  --pcampus-z-overlay: 20;   /* drawers, side panels */
  --pcampus-z-modal:   30;   /* dialogs */
  --pcampus-z-top:     40;   /* developer overlays, debug */
  --pcampus-z-toast:   50;   /* notifications */
}
```

---

## Complete Reference Sheet

Copy into `src/tokens/index.css` as the starting point. All component values flow from here.

```css
:root {
  /* ═══ PALETTE ═══════════════════════════════════════════════════ */
  --pcampus-blue-600: #2952A3;
  --pcampus-blue-400: #4B7FD4;
  --pcampus-blue-300: rgba(41, 82, 163, 0.30);
  --pcampus-blue-100: rgba(41, 82, 163, 0.12);
  --pcampus-amber-600: #C87533;
  --pcampus-amber-300: #E8A96A;
  --pcampus-amber-100: rgba(200, 117, 51, 0.10);
  --pcampus-green-600: #2A7A4B;
  --pcampus-green-100: rgba(42, 122, 75, 0.10);
  --pcampus-slate-400: #8F9BB3;
  --pcampus-slate-100: rgba(143, 155, 179, 0.15);
  --pcampus-red-600:   #C0392B;
  --pcampus-red-100:   rgba(192, 57, 43, 0.08);
  --pcampus-teal-600:  #1A7A6E;
  --pcampus-teal-100:  rgba(26, 122, 110, 0.10);
  --pcampus-gray-900:  #0D0D0C;
  --pcampus-gray-100:  #F3F2EF;
  --pcampus-gray-50:   #F9F8F6;

  /* ═══ SEMANTIC COLOR ════════════════════════════════════════════ */
  --pcampus-color-primary:         var(--pcampus-blue-600);
  --pcampus-color-primary-bright:  var(--pcampus-blue-400);
  --pcampus-color-primary-subtle:  var(--pcampus-blue-100);
  --pcampus-color-primary-border:  var(--pcampus-blue-300);
  --pcampus-color-accent:          var(--pcampus-amber-600);
  --pcampus-color-accent-light:    var(--pcampus-amber-300);
  --pcampus-color-accent-subtle:   var(--pcampus-amber-100);
  --pcampus-color-success:         var(--pcampus-green-600);
  --pcampus-color-success-subtle:  var(--pcampus-green-100);
  --pcampus-color-error:           var(--pcampus-red-600);
  --pcampus-color-error-subtle:    var(--pcampus-red-100);
  --pcampus-color-neutral:         var(--pcampus-slate-400);
  --pcampus-color-neutral-subtle:  var(--pcampus-slate-100);
  --pcampus-color-surface:         var(--pcampus-gray-50);
  --pcampus-color-surface-subtle:  var(--pcampus-gray-100);
  --pcampus-color-text:            var(--pcampus-gray-900);
  --pcampus-color-text-secondary:  #4A4A48;
  --pcampus-color-text-tertiary:   #8A8A87;
  --pcampus-color-text-disabled:   #C4C4C1;
  --pcampus-color-text-inverse:    var(--pcampus-gray-50);
  --pcampus-color-border:          rgba(13, 13, 12, 0.08);
  --pcampus-color-border-subtle:   rgba(13, 13, 12, 0.05);
  --pcampus-color-border-strong:   rgba(13, 13, 12, 0.16);

  /* ═══ TYPOGRAPHY ════════════════════════════════════════════════ */
  --pcampus-font-sans: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  --pcampus-font-mono: "JetBrains Mono", ui-monospace, monospace;
  --pcampus-text-2xs: 10px; --pcampus-leading-2xs: 1.40;
  --pcampus-text-xs:  11px; --pcampus-leading-xs:  1.45;
  --pcampus-text-sm:  12px; --pcampus-leading-sm:  1.50;
  --pcampus-text-base: 14px; --pcampus-leading-base: 1.60;
  --pcampus-text-md:  15px; --pcampus-leading-md:  1.50;
  --pcampus-text-lg:  17px; --pcampus-leading-lg:  1.40;
  --pcampus-text-xl:  20px; --pcampus-leading-xl:  1.35;
  --pcampus-text-2xl: 24px; --pcampus-leading-2xl: 1.25;
  --pcampus-text-3xl: 30px; --pcampus-leading-3xl: 1.20;
  --pcampus-text-4xl: 38px; --pcampus-leading-4xl: 1.10;
  --pcampus-font-feature-tabular: "tnum" 1, "kern" 1;

  /* ═══ SPACING ═══════════════════════════════════════════════════ */
  --pcampus-space-1:   4px; --pcampus-space-2:   6px;
  --pcampus-space-3:   8px; --pcampus-space-4:  10px;
  --pcampus-space-5:  12px; --pcampus-space-6:  16px;
  --pcampus-space-7:  20px; --pcampus-space-8:  24px;
  --pcampus-space-9:  32px; --pcampus-space-10: 40px;
  --pcampus-space-11: 48px; --pcampus-space-12: 64px;
  --pcampus-touch-target-min: 44px;

  /* ═══ BORDER / SHAPE ════════════════════════════════════════════ */
  --pcampus-border-hairline: 1px;
  --pcampus-border-strong:   2px;
  --pcampus-radius-none: 0px;   --pcampus-radius-xs:  2px;
  --pcampus-radius-sm:   4px;   --pcampus-radius-md:  6px;
  --pcampus-radius-lg:   8px;   --pcampus-radius-xl:  12px;
  --pcampus-radius-full: 9999px;

  /* ═══ SHADOW ════════════════════════════════════════════════════ */
  --pcampus-shadow-overlay: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05);
  --pcampus-shadow-modal:   0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.07);
  --pcampus-backdrop-blur:  blur(8px);

  /* ═══ MOTION ════════════════════════════════════════════════════ */
  --pcampus-duration-fast:    100ms;
  --pcampus-duration-panel:   220ms;
  --pcampus-duration-base:    300ms;
  --pcampus-duration-pulse:  3000ms;
  --pcampus-duration-shimmer:2000ms;
  --pcampus-ease-default: cubic-bezier(0.16, 1, 0.3, 1);
  --pcampus-ease-enter:   cubic-bezier(0.0, 0.0, 0.2, 1);
  --pcampus-ease-exit:    cubic-bezier(0.4, 0.0, 1, 1);
  --pcampus-ease-linear:  linear;

  /* ═══ LAYOUT ════════════════════════════════════════════════════ */
  --pcampus-layout-nav-height:       48px;
  --pcampus-layout-sidebar-width:   240px;
  --pcampus-layout-sidebar-collapsed: 64px;
  --pcampus-layout-content-max:    1280px;
  --pcampus-layout-panel-width:     320px;

  /* ═══ Z-INDEX ═══════════════════════════════════════════════════ */
  --pcampus-z-base:    0;
  --pcampus-z-content: 1;
  --pcampus-z-sticky:  10;
  --pcampus-z-overlay: 20;
  --pcampus-z-modal:   30;
  --pcampus-z-top:     40;
  --pcampus-z-toast:   50;
}
```

---

## What Does NOT Live Here

These are PBCP-specific semantic tokens. They stay in Cockpit's `design-tokens.md`:

| Token | Why it stays in Cockpit |
|-------|------------------------|
| `--color-evidence-blue` | PBCP Evidence concept |
| `--color-story-amber` | PBCP Story concept |
| `--border-evidence-substrate` | Evidence Substrate 2px left-border |
| `--border-causal-thread` | Causal Thread stroke |
| `--color-trust-green` | PBCP Causal Chain completion state |
| `--color-gap-slate` | PBCP evidence gap state |
| `--color-developer-purple` | PBCP Engineer Mode |
| `--duration-chain-link` | Chain Draw animation (PBCP-specific) |
| `--layout-snapshot-width` | PBCP Story Page layout |

Services that need PBCP-specific tokens import from Cockpit, not from `@pcampus/ui`.

---

## Service Token Override Pattern

A service overrides only the semantic layer — never the raw palette:

```css
/* pip/src/styles/tokens.css */
@import '@pcampus/ui/tokens';

:root {
  /* PIP uses its own primary color */
  --pcampus-color-primary:        #1D4ED8;
  --pcampus-color-primary-bright: #3B82F6;
  --pcampus-color-primary-subtle: rgba(29, 78, 216, 0.10);
}
```

Components imported from `@pcampus/ui` pick up the new primary automatically. Palette tokens stay unchanged.

---

## Related

- Source: [PBCP Cockpit design-tokens.md](../../PBCP-Cockpit/docs/design/design-tokens.md) (canonical Cockpit reference)
- Implementation target: `code/src/tokens/index.css`
- JS export target: `code/src/tokens/index.ts`
- Constitution: [.agents/design.md](../../.agents/design.md)
