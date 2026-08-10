import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DataTable, type DataTableColumn } from '../src/data';
import { Button } from '../src/primitives/button';
import { StatusBadge } from '../src/patterns/status-badge';

type Row = {
  id: string;
  name: string;
  status: 'ok' | 'warn' | 'err';
  updated: string;
};

const rows: Row[] = [
  { id: '1', name: 'newsletter-subscribers', status: 'ok', updated: '2h ago' },
  { id: '2', name: 'trial-users', status: 'warn', updated: '1d ago' },
  { id: '3', name: 'bounced', status: 'err', updated: '3d ago' },
];

const columns: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Audience', cell: (r) => r.name },
  {
    id: 'status',
    header: 'Status',
    cell: (r) => (
      <StatusBadge status={r.status}>
        {r.status === 'ok' ? 'Healthy' : r.status === 'warn' ? 'Needs attention' : 'Failing'}
      </StatusBadge>
    ),
  },
  { id: 'updated', header: 'Updated', cell: (r) => r.updated },
  {
    id: 'actions',
    header: 'Actions',
    align: 'right',
    cell: () => (
      <Button size="sm" variant="ghost">
        Open
      </Button>
    ),
  },
];

const meta: Meta<typeof DataTable<Row>> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTable<Row>>;

export const Default: Story = {
  args: {
    columns,
    data: rows,
    getRowId: (r) => r.id,
    'aria-label': 'Audiences',
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    loadingRows: 4,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyTitle: 'No audiences yet',
    emptyDescription: 'Create an audience to start sending campaigns.',
    emptyAction: { label: 'Create audience', onClick: () => {} },
  },
};

export const ErrorState: Story = {
  args: {
    columns,
    data: [],
    error: 'Supabase request timed out. Retry in a moment.',
  },
};

export const ClickableRows: Story = {
  args: {
    columns,
    data: rows,
    getRowId: (r) => r.id,
    onRowClick: (r) => alert(`Open ${r.name}`),
  },
};
