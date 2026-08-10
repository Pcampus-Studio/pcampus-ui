import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../src/primitives/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithInitials: Story = { args: { name: 'Nattha Pcp', size: 'md' } };
export const WithImage: Story = { args: { src: 'https://i.pravatar.cc/150?img=3', name: 'User', size: 'md' } };
export const Square: Story = { args: { name: 'Square User', shape: 'square', size: 'md' } };
export const ExtraSmall: Story = { args: { name: 'XS User', size: 'xs' } };
export const Large: Story = { args: { name: 'Large User', size: 'lg' } };
