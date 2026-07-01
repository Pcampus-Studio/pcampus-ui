import React, { useState, useRef } from 'react';
import {
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/react';

export interface TooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 400,
  disabled = false,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { delay: { open: delay, close: 0 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, focus, dismiss, role,
  ]);

  if (disabled) return children;

  return (
    <>
      {React.cloneElement(children, {
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
            background: 'var(--pcampus-gray-900)',
            color: 'var(--pcampus-color-text-inverse)',
            borderRadius: 'var(--pcampus-radius-sm)',
            padding: '4px 8px',
            fontSize: 'var(--pcampus-text-xs)',
            fontFamily: 'var(--pcampus-font-sans)',
            zIndex: 'var(--pcampus-z-overlay)' as unknown as number,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            animation: `pcampus-fade-in var(--pcampus-duration-fast) var(--pcampus-ease-enter)`,
          }}
          {...getFloatingProps()}
        >
          <style>{`@keyframes pcampus-fade-in { from { opacity:0; } to { opacity:1; } }`}</style>
          {content}
        </div>
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';
