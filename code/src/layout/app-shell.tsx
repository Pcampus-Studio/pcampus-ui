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
  /** When true, renders as a non-interactive placeholder (future service) */
  disabled?: boolean;
}

export interface AppShellProps {
  serviceName: string;
  /** If provided, wraps the service name in a link (e.g. href="/" for home). */
  serviceHref?: string;
  logo?: React.ReactNode;
  navItems: NavItem[];
  topBarRight?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<{ item: NavItem; collapsed: boolean; indent?: boolean }> = ({ item, collapsed, indent }) => {
  const Tag = item.href ? 'a' : 'button';

  if (item.disabled) {
    return (
      <span
        title={collapsed ? item.label : undefined}
        className={clsx(
          'flex items-center gap-3 rounded-pcampus-md text-base font-pcampus-sans transition-all duration-fast ease-default w-full opacity-40 cursor-not-allowed select-none',
          collapsed ? 'p-3 justify-center' : 'py-3 px-5 justify-start',
          indent && !collapsed && 'pl-9',
        )}
      >
        {item.icon && <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>}
        {!collapsed && <span className="flex-1">{item.label}</span>}
      </span>
    );
  }

  return (
    <Tag
      href={item.href}
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      aria-current={item.active ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 rounded-pcampus-md text-base font-pcampus-sans text-left transition-all duration-fast ease-default w-full cursor-pointer no-underline border-none',
        collapsed ? 'p-3 justify-center' : 'py-3 px-5 justify-start',
        indent && !collapsed && 'pl-9',
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

/** Renders a collapsible nav group when NavItem has children. */
const NavGroup: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const [open, setOpen] = useState(true);
  const hasActiveChild = item.children?.some((c) => c.active);
  const labelCls = clsx(
    'flex items-center gap-3 rounded-pcampus-md text-base font-pcampus-sans text-left transition-all duration-fast ease-default cursor-pointer no-underline border-none bg-transparent',
    hasActiveChild ? 'text-pcampus-primary' : 'text-pcampus-body hover:bg-pcampus-canvas-soft',
  );

  return (
    <div>
      <div
        title={collapsed ? item.label : undefined}
        className={clsx('flex items-center', collapsed ? 'p-3 justify-center' : 'pr-2')}
      >
        {/* Label / navigate area */}
        {item.href ? (
          <a
            href={item.href}
            className={clsx(labelCls, collapsed ? 'p-3' : 'flex-1 py-3 pl-5 pr-2')}
          >
            {item.icon && (
              <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
            )}
            {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
          </a>
        ) : (
          <span className={clsx(labelCls, collapsed ? 'p-3' : 'flex-1 py-3 pl-5 pr-2')}>
            {item.icon && (
              <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
            )}
            {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
          </span>
        )}

        {/* Chevron toggle — hidden when sidebar collapsed */}
        {!collapsed && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse' : 'Expand'}
            className="p-2 rounded-pcampus-md bg-transparent border-none cursor-pointer text-pcampus-muted hover:text-pcampus-ink text-xs transition-colors"
          >
            {open ? '▾' : '▸'}
          </button>
        )}
      </div>

      {!collapsed && open && item.children && (
        <div className="flex flex-col gap-1 mt-0.5">
          {item.children.map((child, i) => (
            <NavLink key={i} item={child} collapsed={false} indent />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppShell: React.FC<AppShellProps> = ({
  serviceName,
  serviceHref,
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
          {serviceHref ? (
            <a
              href={serviceHref}
              className="fontWeight-600 text-base font-semibold text-pcampus-ink no-underline hover:text-pcampus-primary transition-colors"
            >
              {serviceName}
            </a>
          ) : (
            <span className="fontWeight-600 text-base font-semibold text-pcampus-ink">
              {serviceName}
            </span>
          )}
        </div>
        {topBarRight && <div className="flex items-center gap-3">{topBarRight}</div>}
      </header>

      {/* Sidebar */}
      <nav
        aria-label="Main navigation"
        className="border-r border-pcampus-hairline overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1 bg-pcampus-canvas transition-[width] duration-panel ease-default"
      >
        {navItems.map((item, i) =>
          item.children?.length ? (
            <NavGroup key={i} item={item} collapsed={collapsed} />
          ) : (
            <NavLink key={i} item={item} collapsed={collapsed} />
          )
        )}
      </nav>

      {/* Content */}
      <main className="overflow-y-auto p-8 bg-pcampus-canvas-soft">
        {children}
      </main>
    </div>
  );
};

AppShell.displayName = 'AppShell';
