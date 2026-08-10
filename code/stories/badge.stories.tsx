import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/primitives/badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { variant: 'default', children: 'Default' } };
export const Primary: Story = { args: { variant: 'primary', children: 'Primary' } };
export const Success: Story = { args: { variant: 'success', children: 'Success' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Warning' } };
export const Error: Story = { args: { variant: 'error', children: 'Error' } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'Neutral' } };
export const WithDot: Story = { args: { variant: 'success', dot: true, children: 'Active' } };
export const Small: Story = { args: { size: 'sm', children: 'Small' } };
