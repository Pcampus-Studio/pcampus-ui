import React, { useState } from 'react';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
} from '@floating-ui/react';

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  closeOnClickOutside?: boolean;
}

export const Popover: React.FC<PopoverProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  content,
  placement = 'bottom',
  closeOnClickOutside = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setUncontrolledOpen(val);
    onOpenChange?.(val);
  };

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { enabled: closeOnClickOutside });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

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
            padding: 'var(--pcampus-space-4)',
            fontFamily: 'var(--pcampus-font-sans)',
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

Popover.displayName = 'Popover';
