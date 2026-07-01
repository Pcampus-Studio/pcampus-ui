import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import '../src/tokens/index.css';
import { ThemeProvider } from '../src/layout/theme-provider';

// Load Inter from Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
document.head.appendChild(fontLink);

// Apply base font to preview body
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  body {
    font-family: var(--pcampus-font-sans);
    font-size: var(--pcampus-text-base);
    color: var(--pcampus-color-text);
    background: var(--pcampus-color-surface);
    -webkit-font-smoothing: antialiased;
  }
`;
document.head.appendChild(globalStyle);

// Wrap every story with ThemeProvider (dark/light follows Storybook background toggle)
const withTheme: Decorator = (Story, context) => {
  const bg = context.globals?.backgrounds?.value;
  const theme = bg === '#0F0F0E' ? 'dark' : 'light';

  return React.createElement(
    ThemeProvider,
    { theme, key: theme },
    React.createElement('div', { style: { padding: '24px' } },
      React.createElement(Story)
    )
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F9F8F6' },
        { name: 'dark', value: '#0F0F0E' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
