import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '../src/layout/app-shell';

const nav = [
  { label: 'Dashboard', active: true, href: '#' },
  { label: 'Users', href: '#' },
];

describe('AppShell', () => {
  it('renders service name', () => {
    render(
      <AppShell serviceName="Pcampus Studio" navItems={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText('Pcampus Studio')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    render(
      <AppShell serviceName="Test" navItems={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders children in main', () => {
    render(
      <AppShell serviceName="Test" navItems={nav}>
        <p>Main content</p>
      </AppShell>
    );
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('collapses sidebar on toggle button click', async () => {
    render(
      <AppShell serviceName="Test" navItems={nav}>
        <p>Content</p>
      </AppShell>
    );
    const toggle = screen.getByLabelText('Collapse sidebar');
    await userEvent.click(toggle);
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('calls onSidebarToggle when toggled', async () => {
    const mockToggle = vi.fn();
    render(
      <AppShell serviceName="Test" navItems={nav} onSidebarToggle={mockToggle}>
        <p>Content</p>
      </AppShell>
    );
    await userEvent.click(screen.getByLabelText('Collapse sidebar'));
    expect(mockToggle).toHaveBeenCalledWith(true);
  });

  it('renders nav item subtitles', () => {
    render(
      <AppShell
        serviceName="Test"
        navItems={[{ label: 'Pulse', subtitle: 'Business Intelligence', href: '#' }]}
      >
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByText('Business Intelligence')).toBeInTheDocument();
  });

  it('keeps nav groups collapsed until expanded', async () => {
    render(
      <AppShell
        serviceName="Test"
        navItems={[
          {
            label: 'Pulse',
            href: '#',
            children: [
              { label: 'Workspace', href: '#' },
              { label: 'Next Actions', href: '#' },
            ],
          },
        ]}
      >
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.queryByRole('group', { name: 'Pulse sub-navigation' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Expand'));
    expect(screen.getByRole('group', { name: 'Pulse sub-navigation' })).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Next Actions')).toBeInTheDocument();
  });

  it('keeps the current service group open after a submenu route change', () => {
    const { rerender } = render(
      <AppShell
        serviceName="Test"
        navItems={[
          {
            label: 'Mail',
            href: '#',
            active: true,
            children: [
              { label: 'Home', href: '#' },
              { label: 'Templates', href: '#' },
            ],
          },
        ]}
      >
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByRole('group', { name: 'Mail sub-navigation' })).toBeInTheDocument();

    rerender(
      <AppShell
        serviceName="Test"
        navItems={[
          {
            label: 'Mail',
            href: '#',
            active: true,
            children: [
              { label: 'Home', href: '#' },
              { label: 'Templates', href: '#', active: true },
            ],
          },
        ]}
      >
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByRole('group', { name: 'Mail sub-navigation' })).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
  });

  it('keeps the open group open and closes it only when another opens', async () => {
    render(
      <AppShell
        serviceName="Test"
        navItems={[
          {
            label: 'Mail',
            href: '#',
            children: [{ label: 'Overview', href: '#' }],
          },
          {
            label: 'Storage',
            href: '#',
            children: [{ label: 'Buckets', href: '#' }],
          },
        ]}
      >
        <p>Content</p>
      </AppShell>,
    );

    const [mailToggle, storageToggle] = screen.getAllByLabelText('Expand');
    await userEvent.click(mailToggle);
    expect(screen.getByRole('group', { name: 'Mail sub-navigation' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Storage sub-navigation' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Collapse'));
    expect(screen.getByRole('group', { name: 'Mail sub-navigation' })).toBeInTheDocument();

    await userEvent.click(storageToggle);
    expect(screen.queryByRole('group', { name: 'Mail sub-navigation' })).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Storage sub-navigation' })).toBeInTheDocument();
  });

  it('defaults main to a compact full-width work surface', () => {
    render(
      <AppShell serviceName="Test" navItems={nav}>
        <p>Content</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    const surface = main.querySelector('[data-pcampus-shell-main]');
    expect(surface).toBeTruthy();
    expect(surface).toHaveClass('pcampus-shell-main');
    expect(surface).toHaveStyle({ padding: 'var(--pcampus-layout-page-padding, 32px)' });
    expect(main).not.toHaveClass('max-w-3xl', 'max-w-5xl');
    expect(main.parentElement).toHaveClass('pcampus-shell-atmosphere');
  });

  it('applies mainClassName to main content', () => {
    render(
      <AppShell serviceName="Test" navItems={nav} mainClassName="overflow-hidden custom-main">
        <p>Content</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    expect(main).toHaveClass('overflow-hidden', 'custom-main');
  });
});
