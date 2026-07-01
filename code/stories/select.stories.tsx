import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../src/primitives/select';

const opts = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3 (disabled)', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = { args: { options: opts, placeholder: 'Choose an option…' } };
export const WithLabel: Story = { args: { label: 'Category', options: opts, placeholder: 'Select…' } };
export const WithError: Story = { args: { label: 'Category', error: 'Please select an option', options: opts } };
export const Disabled: Story = { args: { label: 'Category', options: opts, disabled: true } };
