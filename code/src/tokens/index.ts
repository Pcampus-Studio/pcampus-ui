/**
 * JS token exports for @pcampus/ui
 * Key naming: strip "--" prefix, camelCase the rest
 * Example: --pcampus-color-primary → pcampusColorPrimary
 */

export const tokens = {
  // ═══ PALETTE ═══════════════════════════════════════════════════
  pcampusBlue600: '#2952A3',
  pcampusBlue400: '#4B7FD4',
  pcampusBlue300: 'rgba(41, 82, 163, 0.30)',
  pcampusBlue100: 'rgba(41, 82, 163, 0.12)',
  pcampusAmber600: '#C87533',
  pcampusAmber300: '#E8A96A',
  pcampusAmber100: 'rgba(200, 117, 51, 0.10)',
  pcampusGreen600: '#2A7A4B',
  pcampusGreen100: 'rgba(42, 122, 75, 0.10)',
  pcampusSlate400: '#8F9BB3',
  pcampusSlate100: 'rgba(143, 155, 179, 0.15)',
  pcampusRed600: '#C0392B',
  pcampusRed100: 'rgba(192, 57, 43, 0.08)',
  pcampusTeal600: '#1A7A6E',
  pcampusTeal100: 'rgba(26, 122, 110, 0.10)',
  pcampusGray900: '#0D0D0C',
  pcampusGray100: '#F3F2EF',
  pcampusGray50: '#F9F8F6',

  // ═══ SEMANTIC COLOR ════════════════════════════════════════════
  pcampusColorPrimary: 'var(--pcampus-color-primary)',
  pcampusColorPrimaryBright: 'var(--pcampus-color-primary-bright)',
  pcampusColorPrimarySubtle: 'var(--pcampus-color-primary-subtle)',
  pcampusColorPrimaryBorder: 'var(--pcampus-color-primary-border)',
  pcampusColorAccent: 'var(--pcampus-color-accent)',
  pcampusColorAccentLight: 'var(--pcampus-color-accent-light)',
  pcampusColorAccentSubtle: 'var(--pcampus-color-accent-subtle)',
  pcampusColorSuccess: 'var(--pcampus-color-success)',
  pcampusColorSuccessSubtle: 'var(--pcampus-color-success-subtle)',
  pcampusColorError: 'var(--pcampus-color-error)',
  pcampusColorErrorSubtle: 'var(--pcampus-color-error-subtle)',
  pcampusColorNeutral: 'var(--pcampus-color-neutral)',
  pcampusColorNeutralSubtle: 'var(--pcampus-color-neutral-subtle)',
  pcampusColorSurface: 'var(--pcampus-color-surface)',
  pcampusColorSurfaceSubtle: 'var(--pcampus-color-surface-subtle)',
  pcampusColorOverlay: 'var(--pcampus-color-overlay)',
  pcampusColorText: 'var(--pcampus-color-text)',
  pcampusColorTextSecondary: 'var(--pcampus-color-text-secondary)',
  pcampusColorTextTertiary: 'var(--pcampus-color-text-tertiary)',
  pcampusColorTextDisabled: 'var(--pcampus-color-text-disabled)',
  pcampusColorTextInverse: 'var(--pcampus-color-text-inverse)',
  pcampusColorBorder: 'var(--pcampus-color-border)',
  pcampusColorBorderSubtle: 'var(--pcampus-color-border-subtle)',
  pcampusColorBorderStrong: 'var(--pcampus-color-border-strong)',

  // ═══ TYPOGRAPHY ════════════════════════════════════════════════
  pcampusFontSans: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
  pcampusFontMono: '"JetBrains Mono", ui-monospace, monospace',
  pcampusText2xs: '10px',
  pcampusLeading2xs: '1.40',
  pcampusTextXs: '11px',
  pcampusLeadingXs: '1.45',
  pcampusTextSm: '12px',
  pcampusLeadingSm: '1.50',
  pcampusTextBase: '14px',
  pcampusLeadingBase: '1.60',
  pcampusTextMd: '15px',
  pcampusLeadingMd: '1.50',
  pcampusTextLg: '17px',
  pcampusLeadingLg: '1.40',
  pcampusTextXl: '20px',
  pcampusLeadingXl: '1.35',
  pcampusText2xl: '24px',
  pcampusLeading2xl: '1.25',
  pcampusText3xl: '30px',
  pcampusLeading3xl: '1.20',
  pcampusText4xl: '38px',
  pcampusLeading4xl: '1.10',

  // ═══ SPACING ═══════════════════════════════════════════════════
  pcampusSpace1: '4px',
  pcampusSpace2: '6px',
  pcampusSpace3: '8px',
  pcampusSpace4: '10px',
  pcampusSpace5: '12px',
  pcampusSpace6: '16px',
  pcampusSpace7: '20px',
  pcampusSpace8: '24px',
  pcampusSpace9: '32px',
  pcampusSpace10: '40px',
  pcampusSpace11: '48px',
  pcampusSpace12: '64px',
  pcampusTouchTargetMin: '44px',

  // ═══ BORDER / SHAPE ════════════════════════════════════════════
  pcampusBorderHairline: '1px',
  pcampusBorderStrong: '2px',
  pcampusRadiusNone: '0px',
  pcampusRadiusXs: '2px',
  pcampusRadiusSm: '4px',
  pcampusRadiusMd: '6px',
  pcampusRadiusLg: '8px',
  pcampusRadiusXl: '12px',
  pcampusRadiusFull: '9999px',

  // ═══ SHADOW ════════════════════════════════════════════════════
  pcampusShadowNone: 'none',
  pcampusShadowOverlay: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)',
  pcampusShadowModal: '0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.07)',
  pcampusBackdropBlur: 'blur(8px)',

  // ═══ MOTION ════════════════════════════════════════════════════
  pcampusDurationInstant: '0ms',
  pcampusDurationFast: '100ms',
  pcampusDurationPanel: '220ms',
  pcampusDurationBase: '300ms',
  pcampusDurationPulse: '3000ms',
  pcampusDurationShimmer: '2000ms',
  pcampusEaseDefault: 'cubic-bezier(0.16, 1, 0.3, 1)',
  pcampusEaseEnter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  pcampusEaseExit: 'cubic-bezier(0.4, 0.0, 1, 1)',
  pcampusEaseLinear: 'linear',

  // ═══ LAYOUT ════════════════════════════════════════════════════
  pcampusLayoutNavHeight: '48px',
  pcampusLayoutSidebarWidth: '240px',
  pcampusLayoutSidebarCollapsed: '64px',
  pcampusLayoutContentMax: '1280px',
  pcampusLayoutPanelWidth: '320px',

  // ═══ Z-INDEX ═══════════════════════════════════════════════════
  pcampusZBase: '0',
  pcampusZContent: '1',
  pcampusZSticky: '10',
  pcampusZOverlay: '20',
  pcampusZModal: '30',
  pcampusZTop: '40',
  pcampusZToast: '50',
} as const;

export type TokenKey = keyof typeof tokens;
export type TokenValue = typeof tokens[TokenKey];
