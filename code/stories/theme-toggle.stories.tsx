import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '../src/primitives/theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Primitives/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animated sun/moon toggle that switches the `.dark` class on `<html>` and persists to localStorage.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <span className="text-sm text-pcampus-ink-secondary">Click to toggle light/dark mode</span>
    </div>
  ),
};
