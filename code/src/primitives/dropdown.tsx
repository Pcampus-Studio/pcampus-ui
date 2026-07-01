import React, { useState, useRef, useCallback } from 'react';
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
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
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
            background: 'var(--pcampus-color-surface)',
            borderRadius: 'var(--pcampus-radius-lg)',
            boxShadow: 'var(--pcampus-shadow-overlay)',
            border: '1px solid var(--pcampus-color-border)',
            zIndex: 'var(--pcampus-z-overlay)' as unknown as number,
            minWidth: 180,
            padding: 'var(--pcampus-space-2) 0',
            fontFamily: 'var(--pcampus-font-sans)',
            animation: `pcampus-fade-in var(--pcampus-duration-fast) var(--pcampus-ease-enter)`,
          }}
          {...getFloatingProps()}
        >
          <style>{`@keyframes pcampus-fade-in { from { opacity:0;transform:translateY(-4px); } to { opacity:1;transform:translateY(0); } }`}</style>
          {items.map((item, i) => {
            const isFocused = activeIndex === i;
            if (item.separator) {
              return (
                <hr
                  key={i}
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--pcampus-color-border)',
                    margin: 'var(--pcampus-space-2) 0',
                  }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pcampus-space-3)',
                  width: '100%',
                  padding: 'var(--pcampus-space-3) var(--pcampus-space-5)',
                  fontSize: 'var(--pcampus-text-base)',
                  color: item.disabled
                    ? 'var(--pcampus-color-text-disabled)'
                    : item.destructive
                    ? 'var(--pcampus-color-error)'
                    : 'var(--pcampus-color-text)',
                  background: isFocused ? 'var(--pcampus-color-surface-subtle)' : 'transparent',
                  border: 'none',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  textDecoration: 'none',
                  textAlign: 'left',
                  transition: `background var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
                }}
              >
                {item.icon && <span style={{ flexShrink: 0 }}>{item.icon}</span>}
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
