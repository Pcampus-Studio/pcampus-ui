import React, { useState } from 'react';
import { clsx } from 'clsx';

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
  className?: string;
}

const NavLink: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const Tag = item.href ? 'a' : 'button';

  return (
    <Tag
      href={item.href}
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      aria-current={item.active ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 rounded-pcampus-md text-base font-pcampus-sans text-left transition-all duration-fast ease-default w-full cursor-pointer no-underline border-none',
        collapsed ? 'p-3 justify-center' : 'py-3 px-5 justify-start',
        item.active
          ? 'text-pcampus-primary bg-[var(--pcampus-color-primary-subtle)]'
          : 'text-pcampus-body bg-transparent hover:bg-pcampus-canvas-soft'
      )}
    >
      {item.icon && <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>}
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && (
            <span className="bg-pcampus-primary text-pcampus-on-primary rounded-pcampus-full text-[10px] font-semibold px-1.5 py-[1px] min-w-[18px] text-center">
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
  className,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggle = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onSidebarToggle?.(next);
  };

  return (
    <div
      style={{
        gridTemplateRows: 'var(--pcampus-layout-nav-height) 1fr',
        gridTemplateColumns: `${
          collapsed ? 'var(--pcampus-layout-sidebar-collapsed)' : 'var(--pcampus-layout-sidebar-width)'
        } 1fr`,
      }}
      className={clsx(
        'grid min-h-screen font-pcampus-sans bg-pcampus-canvas transition-[grid-template-columns] duration-panel ease-default',
        className
      )}
    >
      {/* Top bar */}
      <header className="col-span-full h-[var(--pcampus-layout-nav-height)] flex items-center justify-between px-6 border-b border-pcampus-hairline bg-pcampus-canvas sticky top-0 z-[var(--pcampus-z-sticky)] gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="bg-transparent border-none cursor-pointer text-pcampus-muted text-lg p-1 hover:text-pcampus-ink transition-colors"
          >
            ☰
          </button>
          {logo}
          <span className="fontWeight-600 text-base font-semibold text-pcampus-ink">
            {serviceName}
          </span>
        </div>
        {topBarRight && <div className="flex items-center gap-3">{topBarRight}</div>}
      </header>

      {/* Sidebar */}
      <nav
        aria-label="Main navigation"
        className="border-r border-pcampus-hairline overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1 bg-pcampus-canvas transition-[width] duration-panel ease-default"
      >
        {navItems.map((item, i) => (
          <NavLink key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Content */}
      <main className="overflow-y-auto p-8 bg-pcampus-canvas-soft">
        {children}
      </main>
    </div>
  );
};

AppShell.displayName = 'AppShell';
