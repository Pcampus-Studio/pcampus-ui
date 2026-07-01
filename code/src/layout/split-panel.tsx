import React, { useState } from 'react';

export interface SplitPanelProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  leftWidth?: string;
  rightCollapsed?: boolean;
  onRightToggle?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  left,
  right,
  leftWidth = '360px',
  rightCollapsed: controlledCollapsed,
  onRightToggle,
  children,
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
    return <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'var(--pcampus-font-sans)',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: leftWidth,
          flexShrink: 0,
          borderRight: '1px solid var(--pcampus-color-border)',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {left}
        {/* Toggle collapse button */}
        {right && (
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
            style={{
              position: 'absolute',
              top: '50%',
              right: -12,
              transform: 'translateY(-50%)',
              width: 24,
              height: 24,
              borderRadius: 'var(--pcampus-radius-full)',
              background: 'var(--pcampus-color-surface)',
              border: '1px solid var(--pcampus-color-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: 'var(--pcampus-color-text-tertiary)',
              zIndex: 1,
            }}
          >
            {collapsed ? '›' : '‹'}
          </button>
        )}
      </div>

      {/* Right panel */}
      {right && (
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            width: collapsed ? 0 : undefined,
            transition: `width var(--pcampus-duration-panel) var(--pcampus-ease-default)`,
            overflowY: collapsed ? 'hidden' : 'auto',
            visibility: collapsed ? 'hidden' : 'visible',
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
};

SplitPanel.displayName = 'SplitPanel';
