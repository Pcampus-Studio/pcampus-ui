import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../src/primitives/spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'white', 'neutral'] },
  },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Primary: Story = { args: { size: 'md', color: 'primary' } };
export const Small: Story = { args: { size: 'sm', color: 'primary' } };
export const Large: Story = { args: { size: 'lg', color: 'primary' } };
export const White: Story = {
  args: { size: 'md', color: 'white' },
  decorators: [(S) => <div style={{ background: 'var(--pcampus-color-primary)', padding: 16, borderRadius: 8 }}><S /></div>],
};
export const Neutral: Story = { args: { size: 'md', color: 'neutral' } };
