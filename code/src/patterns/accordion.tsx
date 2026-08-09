import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from '../icons/curated';
import { Icon } from '../icons/icon';

export interface AccordionItem {
  id: string;
  /** Primary label on the row. */
  title: React.ReactNode;
  /** Optional one-line summary shown under the title when collapsed or open. */
  subtitle?: React.ReactNode;
  /** Optional leading node (e.g. a number badge, icon, drag handle). */
  leading?: React.ReactNode;
  /** Optional trailing actions (buttons). Clicks here do not toggle the row. */
  actions?: React.ReactNode;
  /** Expanded content. */
  body: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 'single' (default) keeps one row open; 'multiple' allows many. */
  type?: 'single' | 'multiple';
  /** Uncontrolled: ids open on first render. */
  defaultOpenIds?: string[];
  /** Controlled open ids. When set, use with onOpenChange. */
  openIds?: string[];
  onOpenChange?: (openIds: string[]) => void;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultOpenIds,
  openIds,
  onOpenChange,
  className,
}) => {
  const [internal, setInternal] = useState<string[]>(
    defaultOpenIds ?? (type === 'single' && items[0] ? [items[0].id] : [])
  );
  const controlled = openIds !== undefined;
  const open = controlled ? (openIds as string[]) : internal;

  const setOpen = (next: string[]) => {
    if (!controlled) setInternal(next);
    onOpenChange?.(next);
  };

  const toggle = (id: string) => {
    const isOpen = open.includes(id);
    if (type === 'single') {
      setOpen(isOpen ? [] : [id]);
    } else {
      setOpen(isOpen ? open.filter((x) => x !== id) : [...open, id]);
    }
  };

  return (
    <div
      className={clsx('flex flex-col gap-2 font-pcampus-sans', className)}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-pcampus-md border border-pcampus-hairline bg-pcampus-surface-subtle"
          >
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              className="flex items-center gap-3 px-3.5 py-3 cursor-pointer select-none"
              onClick={() => toggle(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(item.id);
                }
              }}
            >
              {item.leading ? (
                <span className="shrink-0 flex items-center">{item.leading}</span>
              ) : null}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-pcampus-ink leading-snug">
                  {item.title}
                </div>
                {item.subtitle ? (
                  <div className="text-xs text-pcampus-muted truncate">
                    {item.subtitle}
                  </div>
                ) : null}
              </div>
              <div className="ml-auto flex items-center gap-1">
                {item.actions ? (
                  <span
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.actions}
                  </span>
                ) : null}
                <Icon
                  icon={ChevronDown}
                  size="sm"
                  aria-hidden
                  className={clsx(
                    'text-pcampus-muted transition-transform duration-150',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>
            </div>
            {isOpen ? (
              <div className="px-3.5 pb-4 pt-0.5">{item.body}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = 'Accordion';
