import type { Preview } from '@storybook/react';
import '../src/tokens/index.css';

const preview: Preview = {
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
