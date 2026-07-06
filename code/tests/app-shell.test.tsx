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

  it('renders nav group children with tree guide', () => {
    render(
      <AppShell
        serviceName="Test"
        navItems={[
          {
            label: 'Pulse',
            href: '#',
            children: [
              { label: 'Workspace', href: '#', active: true },
              { label: 'Next Actions', href: '#' },
            ],
          },
        ]}
      >
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByRole('group', { name: 'Pulse sub-navigation' })).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Next Actions')).toBeInTheDocument();
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
