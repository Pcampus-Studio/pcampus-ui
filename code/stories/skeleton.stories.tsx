import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../src/primitives/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    radius: { control: 'select', options: ['sm', 'md', 'full'] },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { width: '200px', height: '16px' } };
export const Circle: Story = { args: { width: '40px', height: '40px', radius: 'full' } };
export const MultiLine: Story = { args: { lines: 4, height: '14px' } };
export const Pill: Story = { args: { width: '120px', height: '28px', radius: 'full' } };
