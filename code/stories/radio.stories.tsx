import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '../src/primitives/radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const opts = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C (disabled)', disabled: true },
];

export const Vertical: Story = { args: { name: 'group1', options: opts, value: 'a', orientation: 'vertical' } };
export const Horizontal: Story = { args: { name: 'group2', options: opts, value: 'b', orientation: 'horizontal' } };
