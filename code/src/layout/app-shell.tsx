import React, { useState } from 'react';

export interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

export interface AppShellProps {
  serviceName: string;
  logo?: React.ReactNode;
  navItems: NavItem[];
  topBarRight?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  children: React.ReactNode;
}

const NavLink: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const Tag = item.href ? 'a' : 'button';

  return (
    <Tag
      href={item.href}
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      aria-current={item.active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--pcampus-space-3)',
        padding: collapsed ? 'var(--pcampus-space-3)' : 'var(--pcampus-space-3) var(--pcampus-space-5)',
        borderRadius: 'var(--pcampus-radius-md)',
        fontSize: 'var(--pcampus-text-base)',
        fontFamily: 'var(--pcampus-font-sans)',
        color: item.active ? 'var(--pcampus-color-primary)' : 'var(--pcampus-color-text-secondary)',
        background: item.active ? 'var(--pcampus-color-primary-subtle)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        width: '100%',
        textAlign: 'left',
        transition: `all var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      {item.icon && <span style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>}
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge !== undefined && (
            <span
              style={{
                background: 'var(--pcampus-color-primary)',
                color: 'var(--pcampus-color-text-inverse)',
                borderRadius: 'var(--pcampus-radius-full)',
                fontSize: 'var(--pcampus-text-2xs)',
                fontWeight: 600,
                padding: '1px 6px',
                minWidth: 18,
                textAlign: 'center',
              }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Tag>
  );
};

export const AppShell: React.FC<AppShellProps> = ({
  serviceName,
  logo,
  navItems,
  topBarRight,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  children,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggle = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onSidebarToggle?.(next);
  };

  const sidebarWidth = collapsed
    ? 'var(--pcampus-layout-sidebar-collapsed)'
    : 'var(--pcampus-layout-sidebar-width)';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'var(--pcampus-layout-nav-height) 1fr',
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        minHeight: '100vh',
        fontFamily: 'var(--pcampus-font-sans)',
        background: 'var(--pcampus-color-surface)',
        transition: `grid-template-columns var(--pcampus-duration-panel) var(--pcampus-ease-default)`,
      }}
    >
      {/* Top bar */}
      <header
        style={{
          gridColumn: '1 / -1',
          height: 'var(--pcampus-layout-nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--pcampus-space-6)',
          borderBottom: '1px solid var(--pcampus-color-border)',
          background: 'var(--pcampus-color-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--pcampus-z-sticky)' as unknown as number,
          gap: 'var(--pcampus-space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pcampus-space-3)' }}>
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--pcampus-color-text-tertiary)', fontSize: 18, padding: 4,
            }}
          >
            ☰
          </button>
          {logo}
          <span style={{ fontWeight: 600, fontSize: 'var(--pcampus-text-md)', color: 'var(--pcampus-color-text)' }}>
            {serviceName}
          </span>
        </div>
        {topBarRight && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pcampus-space-3)' }}>{topBarRight}</div>}
      </header>

      {/* Sidebar */}
      <nav
        aria-label="Main navigation"
        style={{
          borderRight: '1px solid var(--pcampus-color-border)',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--pcampus-space-4) var(--pcampus-space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pcampus-space-1)',
          background: 'var(--pcampus-color-surface)',
          transition: `width var(--pcampus-duration-panel) var(--pcampus-ease-default)`,
        }}
      >
        {navItems.map((item, i) => (
          <NavLink key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Content */}
      <main
        style={{
          overflowY: 'auto',
          padding: 'var(--pcampus-space-8)',
          background: 'var(--pcampus-color-surface-subtle)',
        }}
      >
        {children}
      </main>
    </div>
  );
};

AppShell.displayName = 'AppShell';
