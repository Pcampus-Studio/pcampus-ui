import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../src/primitives/toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Primitives/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = { args: { label: 'Enable notifications', checked: false } };
export const On: Story = { args: { label: 'Enable notifications', checked: true } };
export const Small: Story = { args: { label: 'Small toggle', size: 'sm', checked: true } };
export const Disabled: Story = { args: { label: 'Disabled', disabled: true, checked: true } };
