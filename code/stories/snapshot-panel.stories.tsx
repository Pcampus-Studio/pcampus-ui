import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SnapshotPanel } from '../src/layout/snapshot-panel';

const meta: Meta<typeof SnapshotPanel> = { title: 'Layout/SnapshotPanel', component: SnapshotPanel, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SnapshotPanel>;

export const Default: Story = {
  args: {
    sections: [
      {
        title: 'Basic Info',
        rows: [
          { label: 'Name', value: 'Nattha P.' },
          { label: 'Email', value: 'nattha@pcampus.co', copyable: true },
          { label: 'Role', value: 'Admin' },
          { label: 'Status', value: 'Active' },
        ],
      },
      {
        title: 'Account',
        rows: [
          { label: 'Created', value: '2024-01-15' },
          { label: 'Last login', value: '2 hours ago' },
        ],
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    sections: [{ rows: [] }],
  },
};
