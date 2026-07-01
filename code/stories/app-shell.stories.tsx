import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AppShell } from '../src/layout/app-shell';

const navItems = [
  { label: 'Dashboard', icon: '⊞', active: true, href: '#' },
  { label: 'Users', icon: '👥', href: '#', badge: 3 },
  { label: 'Settings', icon: '⚙', href: '#' },
];

const meta: Meta = { title: 'Layout/AppShell', tags: ['autodocs'] };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ height: '600px', overflow: 'hidden' }}>
      <AppShell
        serviceName="Pcampus Studio"
        navItems={navItems}
        topBarRight={<span style={{ fontSize: 14, color: 'var(--pcampus-color-text-secondary)' }}>Admin</span>}
      >
        <h1 style={{ margin: 0, fontSize: 'var(--pcampus-text-2xl)', fontFamily: 'var(--pcampus-font-sans)' }}>Dashboard</h1>
      </AppShell>
    </div>
  ),
};
