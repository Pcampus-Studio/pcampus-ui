import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type DataTableColumn } from '../src/data';

type Row = { id: string; name: string };

const columns: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name },
  {
    id: 'actions',
    header: 'Actions',
    align: 'right',
    cell: () => <button type="button">Edit</button>,
  },
];

const data: Row[] = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
];

describe('DataTable', () => {
  it('renders columns and rows', () => {
    render(
      <DataTable columns={columns} data={data} getRowId={(r) => r.id} aria-label="Rows" />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('calls onRowClick', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        onRowClick={onRowClick}
      />
    );
    await user.click(screen.getByText('Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('shows skeleton rows while loading', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} loading loadingRows={3} />
    );
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  it('shows EmptyState when empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyTitle="Nothing here"
        emptyDescription="Add a row."
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Add a row.')).toBeInTheDocument();
  });

  it('shows Alert on error', () => {
    render(
      <DataTable columns={columns} data={[]} error="Network failed" />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network failed')).toBeInTheDocument();
  });
});
