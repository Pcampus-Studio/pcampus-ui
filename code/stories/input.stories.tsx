import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/primitives/input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text…' } };
export const WithLabel: Story = { args: { label: 'Email address', placeholder: 'you@example.com', hint: 'We never share your email.' } };
export const WithError: Story = { args: { label: 'Email', error: 'This field is required', placeholder: 'you@example.com' } };
export const Disabled: Story = { args: { label: 'Name', value: 'Read-only', disabled: true } };
export const Small: Story = { args: { size: 'sm', placeholder: 'Small input' } };
export const Large: Story = { args: { size: 'lg', placeholder: 'Large input' } };
