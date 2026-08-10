import React, { useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useListNavigation,
  offset,
  flip,
  shift,
} from '@floating-ui/react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactElement;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click, dismiss, role, listNav,
  ]);

  const handleItemClick = useCallback((item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setOpen(false);
  }, []);

  return (
    <>
      {React.cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {open && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className={clsx(
            'bg-pcampus-canvas rounded-pcampus-lg shadow-lg border border-pcampus-hairline z-[var(--pcampus-z-overlay)] min-w-[180px] py-1 font-pcampus-sans animate-pcampus-fade-in',
            className
          )}
          {...getFloatingProps()}
        >
          {items.map((item, i) => {
            const isFocused = activeIndex === i;
            if (item.separator) {
              return (
                <hr
                  key={i}
                  className="border-none border-t border-pcampus-hairline my-1"
                />
              );
            }
            const Component = item.href ? 'a' : 'button';
            return (
              <Component
                key={i}
                ref={(el: HTMLElement | null) => { listRef.current[i] = el; }}
                href={item.href}
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled}
                {...getItemProps({
                  onClick: () => handleItemClick(item),
                })}
                className={clsx(
                  'flex items-center gap-3 w-full px-5 py-3 text-base border-none no-underline text-left transition-all duration-fast ease-default',
                  item.disabled
                    ? 'text-pcampus-muted cursor-not-allowed'
                    : item.destructive
                    ? 'text-pcampus-error cursor-pointer'
                    : 'text-pcampus-ink cursor-pointer',
                  isFocused ? 'bg-pcampus-canvas-soft' : 'bg-transparent'
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </Component>
            );
          })}
        </div>
      )}
    </>
  );
};

Dropdown.displayName = 'Dropdown';
