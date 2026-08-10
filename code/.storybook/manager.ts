import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const pcampusTheme = create({
  base: 'light',

  // Brand
  brandTitle: '@pcampus-studio/ui',
  brandUrl: 'https://github.com/Pcampus-Studio/pcampus-ui',
  brandTarget: '_blank',

  // Storybook chrome colors — match Pcampus tokens
  colorPrimary: '#2952A3',    // --pcampus-blue-600
  colorSecondary: '#2952A3',

  // UI
  appBg: '#F3F2EF',           // --pcampus-color-surface-subtle
  appContentBg: '#F9F8F6',    // --pcampus-color-surface
  appBorderColor: 'rgba(13, 13, 12, 0.08)',
  appBorderRadius: 6,

  // Typography
  fontBase: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',

  // Text
  textColor: '#0D0D0C',       // --pcampus-gray-900
  textInverseColor: '#F9F8F6',
  textMutedColor: '#8A8A87',  // --pcampus-color-text-tertiary

  // Toolbar
  barTextColor: '#4A4A48',    // --pcampus-color-text-secondary
  barHoverColor: '#2952A3',
  barSelectedColor: '#2952A3',
  barBg: '#F9F8F6',

  // Input fields
  inputBg: '#ffffff',
  inputBorder: 'rgba(13, 13, 12, 0.08)',
  inputTextColor: '#0D0D0C',
  inputBorderRadius: 4,

  // Button
  buttonBg: '#ffffff',
  buttonBorder: 'rgba(13, 13, 12, 0.08)',
});

addons.setConfig({
  theme: pcampusTheme,
});
