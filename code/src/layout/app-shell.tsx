import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface NavItem {
  label: string;
  /** Secondary line under label (service-level nav only). */
  subtitle?: string;
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
  /** Optional className override for the main content area. */
  mainClassName?: string;
}

const navTitle = (item: NavItem) =>
  item.subtitle ? `${item.label} — ${item.subtitle}` : item.label;

const NavExpandToggle: React.FC<{ open: boolean; onToggle: () => void }> = ({ open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={open ? 'Collapse' : 'Expand'}
    aria-expanded={open}
    className="flex items-center justify-center shrink-0 w-9 h-9 mr-1 rounded-pcampus-md bg-transparent border-none cursor-pointer text-pcampus-muted hover:text-pcampus-ink transition-colors"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
      aria-hidden
    >
      {open ? <path d="M6 9l6 6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  </button>
);

const NavItemText: React.FC<{
  item: NavItem;
  emphasized?: boolean;
  child?: boolean;
}> = ({ item, emphasized, child }) => (
  <span className={clsx('flex-1 min-w-0', child ? 'block' : 'flex flex-col gap-0.5')}>
    <span className={clsx(emphasized && 'font-medium')}>{item.label}</span>
    {!child && item.subtitle && (
      <span className="block text-[11px] leading-tight text-pcampus-muted">{item.subtitle}</span>
    )}
  </span>
);

const navRowCls = (active: boolean, collapsed: boolean, indent?: boolean) =>
  clsx(
    'flex items-start gap-3 rounded-pcampus-md text-base font-pcampus-sans text-left transition-all duration-fast ease-default w-full',
    collapsed ? 'p-3 justify-center items-center' : 'py-2.5 px-5 justify-start',
    indent && !collapsed && 'py-1 px-2 text-sm',
    active
      ? 'text-pcampus-primary bg-[var(--pcampus-color-primary-subtle)]'
      : 'text-pcampus-body bg-transparent hover:bg-pcampus-canvas-soft',
  );

const NavLink: React.FC<{ item: NavItem; collapsed: boolean; indent?: boolean }> = ({
  item,
  collapsed,
  indent,
}) => {
  const Tag = item.href ? 'a' : 'button';
  const active = !!item.active;

  if (item.disabled) {
    return (
      <span
        title={collapsed ? navTitle(item) : undefined}
        className={clsx(
          navRowCls(false, collapsed, indent),
          'opacity-40 cursor-not-allowed select-none',
        )}
      >
        {!indent && item.icon && (
          <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">{item.icon}</span>
        )}
        {!collapsed && <NavItemText item={item} child={indent} />}
      </span>
    );
  }

  return (
    <Tag
      href={item.href}
      onClick={item.onClick}
      title={collapsed ? navTitle(item) : undefined}
      aria-current={active ? 'page' : undefined}
      className={clsx(navRowCls(active, collapsed, indent), 'cursor-pointer no-underline border-none')}
    >
      {!indent && item.icon && (
        <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">{item.icon}</span>
      )}
      {!collapsed && (
        <>
          <NavItemText item={item} emphasized={!indent} child={indent} />
          {!indent && item.badge !== undefined && (
            <span className="bg-pcampus-primary text-pcampus-on-primary rounded-pcampus-full text-[10px] font-semibold px-1.5 py-[1px] min-w-[18px] text-center shrink-0">
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
  const hasActiveChild = item.children?.some((c) => c.active) ?? false;
  const headerActive = !!item.active || hasActiveChild;
  const labelCls = clsx(
    navRowCls(headerActive, collapsed),
    'cursor-pointer no-underline border-none',
  );

  return (
    <div>
      <div
        title={collapsed ? navTitle(item) : undefined}
        className={clsx('flex items-center', collapsed ? 'p-3 justify-center' : 'pr-1')}
      >
        {item.href ? (
          <a href={item.href} className={clsx(labelCls, collapsed ? 'p-3' : 'flex-1 py-2.5 pl-5 pr-2')}>
            {item.icon && (
              <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">{item.icon}</span>
            )}
            {!collapsed && <NavItemText item={item} emphasized />}
          </a>
        ) : (
          <span className={clsx(labelCls, collapsed ? 'p-3' : 'flex-1 py-2.5 pl-5 pr-2')}>
            {item.icon && (
              <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">{item.icon}</span>
            )}
            {!collapsed && <NavItemText item={item} emphasized />}
          </span>
        )}

        {!collapsed && <NavExpandToggle open={open} onToggle={() => setOpen((o) => !o)} />}
      </div>

      {!collapsed && open && item.children && (
        <div
          className="flex flex-col gap-0 mt-0.5 ml-7 pl-2 border-l border-pcampus-hairline"
          role="group"
          aria-label={`${item.label} sub-navigation`}
        >
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
  mainClassName,
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
        className,
      )}
    >
      <header className="col-span-full h-[var(--pcampus-layout-nav-height)] flex items-center justify-between px-6 border-b border-pcampus-hairline bg-pcampus-canvas sticky top-0 z-[var(--pcampus-z-sticky)] gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
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
            <span className="fontWeight-600 text-base font-semibold text-pcampus-ink">{serviceName}</span>
          )}
        </div>
        {topBarRight && <div className="flex items-center gap-3">{topBarRight}</div>}
      </header>

      <nav
        aria-label="Main navigation"
        className="border-r border-pcampus-hairline overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1 bg-pcampus-canvas transition-[width] duration-panel ease-default"
      >
        {navItems.map((item, i) =>
          item.children?.length ? (
            <NavGroup key={i} item={item} collapsed={collapsed} />
          ) : (
            <NavLink key={i} item={item} collapsed={collapsed} />
          ),
        )}
      </nav>

      <main className={mainClassName ?? 'overflow-y-auto p-8 bg-pcampus-canvas-soft'}>{children}</main>
    </div>
  );
};

AppShell.displayName = 'AppShell';
