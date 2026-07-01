import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface SplitPanelProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  leftWidth?: string;
  rightCollapsed?: boolean;
  onRightToggle?: (collapsed: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  left,
  right,
  leftWidth = '360px',
  rightCollapsed: controlledCollapsed,
  onRightToggle,
  children,
  className,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggle = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onRightToggle?.(next);
  };

  if (children) {
    return <div className={clsx('flex-1 overflow-y-auto', className)}>{children}</div>;
  }

  return (
    <div className={clsx('flex h-full overflow-hidden font-pcampus-sans', className)}>
      {/* Left panel */}
      <div
        style={{ width: leftWidth }}
        className="shrink-0 border-r border-pcampus-hairline overflow-y-auto relative"
      >
        {left}
        {/* Toggle collapse button */}
        {right && (
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-pcampus-full bg-pcampus-canvas border border-pcampus-hairline cursor-pointer flex items-center justify-center text-xs text-pcampus-muted z-10 hover:text-pcampus-ink transition-colors"
          >
            {collapsed ? '›' : '‹'}
          </button>
        )}
      </div>

      {/* Right panel */}
      {right && (
        <div
          style={{ width: collapsed ? 0 : undefined }}
          className={clsx(
            'flex-1 overflow-hidden transition-[width] duration-panel ease-default',
            collapsed ? 'overflow-y-hidden invisible' : 'overflow-y-auto visible'
          )}
        >
          {right}
        </div>
      )}
    </div>
  );
};

SplitPanel.displayName = 'SplitPanel';
