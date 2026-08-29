import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  PageHeader,
  KpiCard,
  StatusBadge,
  Stepper,
  Timeline,
  FilterBar,
} from '../src/patterns';

describe('page patterns', () => {
  it('PageHeader renders title, subtitle, actions', () => {
    render(
      <PageHeader
        title="Audiences"
        subtitle="Manage segments"
        actions={<button type="button">New</button>}
      />
    );
    expect(screen.getByRole('heading', { name: 'Audiences' })).toBeInTheDocument();
    expect(screen.getByText('Manage segments')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });

  it('KpiCard renders value and delta', () => {
    render(
      <KpiCard label="Delivered" value="1.2k" delta="+3%" deltaDirection="up" />
    );
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
    expect(screen.getByText('+3%')).toBeInTheDocument();
  });

  it('StatusBadge maps semantic statuses', () => {
    render(<StatusBadge status="ok">Verified</StatusBadge>);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('Stepper marks current step', () => {
    render(
      <Stepper
        current={1}
        steps={[
          { id: 'a', label: 'One' },
          { id: 'b', label: 'Two' },
          { id: 'c', label: 'Three' },
        ]}
      />
    );
    expect(screen.getByText('Two').closest('li')).toHaveAttribute('aria-current', 'step');
  });

  it('Stepper calls onStepClick with the step id', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <Stepper
        current={1}
        onStepClick={onStepClick}
        steps={[
          { id: 'a', label: 'One' },
          { id: 'b', label: 'Two' },
        ]}
      />
    );
    await user.click(screen.getByRole('button', { name: 'One' }));
    expect(onStepClick).toHaveBeenCalledWith('a');
  });

  it('Stepper does not click a disabled step', () => {
    const onStepClick = vi.fn();
    render(
      <Stepper
        onStepClick={onStepClick}
        steps={[
          { id: 'a', label: 'One' },
          { id: 'b', label: 'Two', disabled: true },
        ]}
      />
    );
    expect(screen.queryByRole('button', { name: 'Two' })).not.toBeInTheDocument();
    expect(screen.getByText('Two').closest('[aria-disabled="true"]')).toBeTruthy();
  });

  it('Timeline renders events', () => {
    render(
      <Timeline
        items={[
          { id: '1', title: 'Sent', meta: 'now', status: 'ok' },
          { id: '2', title: 'Opened', description: '42%', status: 'info' },
        ]}
      />
    );
    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('FilterBar search and filter pills', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onFilterChange = vi.fn();
    render(
      <FilterBar
        searchValue=""
        onSearchChange={onSearchChange}
        filters={[
          { id: 'all', label: 'All', active: true },
          { id: 'active', label: 'Active' },
        ]}
        onFilterChange={onFilterChange}
      />
    );
    await user.type(screen.getByRole('textbox'), 'news');
    expect(onSearchChange).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(onFilterChange).toHaveBeenCalledWith('active');
  });
});
