import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Icon,
  Send,
  Copy,
  Plus,
  Search,
  Globe,
  Calendar,
  Users,
  Activity,
  Settings,
  Pencil,
  Check,
  AlertCircle,
  Download,
  Save,
  FlaskConical,
  Sparkles,
} from '../src/icons';

const curated = [
  { name: 'Send', icon: Send },
  { name: 'Copy', icon: Copy },
  { name: 'Plus', icon: Plus },
  { name: 'Search', icon: Search },
  { name: 'Globe', icon: Globe },
  { name: 'Calendar', icon: Calendar },
  { name: 'Users', icon: Users },
  { name: 'Activity', icon: Activity },
  { name: 'Settings', icon: Settings },
  { name: 'Pencil', icon: Pencil },
  { name: 'Check', icon: Check },
  { name: 'AlertCircle', icon: AlertCircle },
  { name: 'Download', icon: Download },
  { name: 'Save', icon: Save },
  { name: 'FlaskConical', icon: FlaskConical },
  { name: 'Sparkles', icon: Sparkles },
] as const;

const meta: Meta<typeof Icon> = {
  title: 'Icons/Icon',
  component: Icon,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: Send,
    size: 'md',
    className: 'text-pcampus-primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-pcampus-ink">
      <Icon icon={Send} size="xs" />
      <Icon icon={Send} size="sm" />
      <Icon icon={Send} size="md" />
      <Icon icon={Send} size="lg" />
    </div>
  ),
};

export const CuratedMailSet: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 max-w-lg text-pcampus-body">
      {curated.map(({ name, icon }) => (
        <div key={name} className="flex flex-col items-center gap-2 text-xs">
          <Icon icon={icon} size="lg" className="text-pcampus-ink" />
          {name}
        </div>
      ))}
    </div>
  ),
};
