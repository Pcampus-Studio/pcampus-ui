import React from 'react';
import { clsx } from 'clsx';

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-pcampus-lg border border-pcampus-hairline">
      <table
        ref={ref}
        className={clsx(
          'w-full border-collapse font-pcampus-sans text-sm text-pcampus-ink',
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export type THeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const THead = React.forwardRef<HTMLTableSectionElement, THeadProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={clsx('bg-pcampus-canvas-soft text-left', className)}
      {...props}
    />
  )
);
THead.displayName = 'THead';

export type TBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TBody = React.forwardRef<HTMLTableSectionElement, TBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={clsx('bg-pcampus-surface-card', className)} {...props} />
  )
);
TBody.displayName = 'TBody';

export type TrProps = React.HTMLAttributes<HTMLTableRowElement> & {
  interactive?: boolean;
};

export const Tr = React.forwardRef<HTMLTableRowElement, TrProps>(
  ({ className, interactive, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        'border-t border-pcampus-hairline',
        interactive &&
          'cursor-pointer transition-colors hover:bg-pcampus-canvas-soft focus-visible:outline-none focus-visible:bg-pcampus-canvas-soft',
        className
      )}
      {...props}
    />
  )
);
Tr.displayName = 'Tr';

export type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const Th = React.forwardRef<HTMLTableCellElement, ThProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-pcampus-muted whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
);
Th.displayName = 'Th';

export type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const Td = React.forwardRef<HTMLTableCellElement, TdProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx('px-4 py-3 align-middle text-pcampus-body', className)}
      {...props}
    />
  )
);
Td.displayName = 'Td';
