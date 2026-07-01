import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../src/primitives/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: 'Accept terms and conditions' } };
export const Checked: Story = { args: { label: 'I agree', defaultChecked: true } };
export const WithError: Story = { args: { label: 'Accept terms', error: 'You must accept the terms' } };
export const Disabled: Story = { args: { label: 'Disabled option', disabled: true } };
export const Indeterminate: Story = { args: { label: 'Select all', indeterminate: true } };
