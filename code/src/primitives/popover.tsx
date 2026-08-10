import React, { useState } from 'react';
import { clsx } from 'clsx';
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
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  content,
  placement = 'bottom',
  closeOnClickOutside = true,
  className,
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
          }}
          className={clsx(
            'bg-pcampus-canvas rounded-pcampus-lg shadow-lg border border-pcampus-hairline z-[var(--pcampus-z-overlay)] p-4 font-pcampus-sans animate-pcampus-fade-in',
            className
          )}
          {...getFloatingProps()}
        >
          {content}
        </div>
      )}
    </>
  );
};

Popover.displayName = 'Popover';
