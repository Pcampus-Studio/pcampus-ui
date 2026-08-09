import React from 'react';
import { clsx } from 'clsx';
import { Alert } from '../primitives/alert';
import { EmptyState } from '../primitives/empty-state';
import { Skeleton } from '../primitives/skeleton';
import { Table, TBody, Td, Th, THead, Tr } from './table';

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Align cell content. Actions columns typically use `right`. */
  align?: 'left' | 'right' | 'center';
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable row key. Defaults to index when omitted. */
  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  /** Skeleton row count while loading. Default 5. */
  loadingRows?: number;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  emptyIcon?: React.ReactNode;
  className?: string;
  /** Accessible name for the table. */
  'aria-label'?: string;
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
} as const;

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  loading = false,
  loadingRows = 5,
  error,
  emptyTitle = 'No results',
  emptyDescription,
  emptyAction,
  emptyIcon,
  className,
  'aria-label': ariaLabel,
}: DataTableProps<T>) {
  if (error) {
    return (
      <Alert
        variant="error"
        title="Could not load data"
        description={error}
        className={className}
      />
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className={clsx('rounded-pcampus-lg border border-pcampus-hairline bg-pcampus-surface-card', className)}>
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <Table className={className} aria-label={ariaLabel} aria-busy={loading || undefined}>
      <THead>
        <Tr>
          {columns.map((col) => (
            <Th
              key={col.id}
              className={clsx(alignClass[col.align ?? 'left'], col.headerClassName)}
            >
              {col.header}
            </Th>
          ))}
        </Tr>
      </THead>
      <TBody>
        {loading
          ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
              <Tr key={`skeleton-${rowIndex}`}>
                {columns.map((col) => (
                  <Td key={col.id} className={alignClass[col.align ?? 'left']}>
                    <Skeleton height={14} width={col.align === 'right' ? '40%' : '70%'} />
                  </Td>
                ))}
              </Tr>
            ))
          : data.map((row, index) => {
              const id = getRowId?.(row, index) ?? String(index);
              const interactive = Boolean(onRowClick);
              return (
                <Tr
                  key={id}
                  interactive={interactive}
                  tabIndex={interactive ? 0 : undefined}
                  onClick={interactive ? () => onRowClick?.(row) : undefined}
                  onKeyDown={
                    interactive
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick?.(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => (
                    <Td
                      key={col.id}
                      className={clsx(alignClass[col.align ?? 'left'], col.className)}
                    >
                      {col.cell(row)}
                    </Td>
                  ))}
                </Tr>
              );
            })}
      </TBody>
    </Table>
  );
}

DataTable.displayName = 'DataTable';
