import React from 'react';
import { clsx } from 'clsx';

export type TimelineItemStatus = 'ok' | 'warn' | 'err' | 'info' | 'muted';

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: TimelineItemStatus;
  icon?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const dotClass: Record<TimelineItemStatus, string> = {
  ok: 'bg-pcampus-success',
  warn: 'bg-pcampus-warning',
  err: 'bg-pcampus-error',
  info: 'bg-pcampus-primary',
  muted: 'bg-pcampus-hairline-strong',
};

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => (
  <ol
    className={clsx(
      'relative m-0 list-none p-0 flex flex-col font-pcampus-sans',
      className
    )}
  >
    {items.map((item, index) => {
      const status = item.status ?? 'muted';
      const isLast = index === items.length - 1;
      return (
        <li key={item.id} className="relative flex gap-3 pb-6 last:pb-0">
          {!isLast && (
            <span
              aria-hidden
              className="absolute left-[7px] top-5 bottom-0 w-px bg-pcampus-hairline"
            />
          )}
          <span className="relative z-[1] mt-1.5 shrink-0">
            {item.icon ? (
              <span className="flex items-center justify-center w-4 h-4 text-pcampus-muted [&_svg]:w-4 [&_svg]:h-4">
                {item.icon}
              </span>
            ) : (
              <span
                className={clsx(
                  'block w-2.5 h-2.5 rounded-pcampus-full ring-4 ring-pcampus-canvas',
                  dotClass[status]
                )}
              />
            )}
          </span>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-pcampus-ink">{item.title}</span>
              {item.meta && (
                <span className="text-xs text-pcampus-muted whitespace-nowrap">
                  {item.meta}
                </span>
              )}
            </div>
            {item.description && (
              <p className="m-0 text-sm text-pcampus-body">{item.description}</p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

Timeline.displayName = 'Timeline';
