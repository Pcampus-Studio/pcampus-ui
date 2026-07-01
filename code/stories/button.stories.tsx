import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/primitives/button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Button' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Button' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Button' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Button' } };
export const Loading: Story = { args: { loading: true, children: 'Saving…' } };
export const Small: Story = { args: { size: 'sm', children: 'Small' } };
export const Large: Story = { args: { size: 'lg', children: 'Large' } };
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };
