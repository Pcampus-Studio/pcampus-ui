import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState } from '../src/primitives/empty-state';

const meta: Meta<typeof EmptyState> = { title: 'Primitives/EmptyState', component: EmptyState, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: '📭',
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
    action: { label: 'Clear filters', onClick: () => {} },
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'Add your first item to get started.',
  },
};
