import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  PageHeader,
  KpiCard,
  StatusBadge,
  Stepper,
  Timeline,
  FilterBar,
} from '../src/patterns';
import { Button } from '../src/primitives/button';
import { Icon, Activity, Users, Mail, Plus } from '../src/icons';

const meta: Meta = {
  title: 'Patterns/Page patterns',
  tags: ['autodocs'],
};
export default meta;

export const PageHeaderDefault: StoryObj = {
  render: () => (
    <PageHeader
      title="Audiences"
      subtitle="Segments used for campaigns and transactional sends."
      actions={
        <>
          <Button variant="secondary" size="sm">
            Export
          </Button>
          <Button size="sm" leftIcon={<Icon icon={Plus} size="sm" />}>
            New audience
          </Button>
        </>
      }
    />
  ),
};

export const KpiCards: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
      <KpiCard
        label="Delivered"
        value="12.4k"
        delta="+8.2%"
        deltaDirection="up"
        icon={<Icon icon={Mail} size="sm" />}
      />
      <KpiCard
        label="Open rate"
        value="41%"
        delta="-1.1%"
        deltaDirection="down"
        icon={<Icon icon={Activity} size="sm" />}
      />
      <KpiCard
        label="Subscribers"
        value="3,812"
        delta="0%"
        deltaDirection="neutral"
        icon={<Icon icon={Users} size="sm" />}
        hint="Last 7 days"
      />
    </div>
  ),
};

export const StatusBadges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="ok">Verified</StatusBadge>
      <StatusBadge status="warn">Pending</StatusBadge>
      <StatusBadge status="err">Failed</StatusBadge>
      <StatusBadge status="info">Processing</StatusBadge>
      <StatusBadge status="muted">Draft</StatusBadge>
      <StatusBadge status="neutral">Archived</StatusBadge>
    </div>
  ),
};

export const StepperDefault: StoryObj = {
  render: () => (
    <Stepper
      current={1}
      steps={[
        { id: '1', label: 'Domain', description: 'Add DNS records' },
        { id: '2', label: 'Verify', description: 'Wait for DNS' },
        { id: '3', label: 'Send', description: 'Start delivering' },
      ]}
    />
  ),
};

export const TimelineDefault: StoryObj = {
  render: () => (
    <Timeline
      className="max-w-md"
      items={[
        {
          id: '1',
          title: 'Campaign sent',
          description: 'Delivered to 1,204 recipients.',
          meta: '10:42',
          status: 'ok',
        },
        {
          id: '2',
          title: 'Bounce spike',
          description: 'Hard bounces exceeded 2%.',
          meta: '09:15',
          status: 'warn',
        },
        {
          id: '3',
          title: 'Domain verified',
          description: 'DKIM + SPF passed.',
          meta: 'Yesterday',
          status: 'info',
        },
      ]}
    />
  ),
};

export const FilterBarInteractive: StoryObj = {
  render: function FilterBarStory() {
    const [q, setQ] = useState('');
    const [active, setActive] = useState('all');
    return (
      <FilterBar
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Search audiences…"
        filters={[
          { id: 'all', label: 'All', active: active === 'all', count: 12 },
          { id: 'active', label: 'Active', active: active === 'active', count: 8 },
          { id: 'paused', label: 'Paused', active: active === 'paused', count: 4 },
        ]}
        onFilterChange={setActive}
        trailing={
          <Button size="sm" variant="secondary">
            Columns
          </Button>
        }
      />
    );
  },
};
