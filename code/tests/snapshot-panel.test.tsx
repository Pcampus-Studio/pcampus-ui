import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SnapshotPanel } from '../src/layout/snapshot-panel';

describe('SnapshotPanel', () => {
  const sections = [
    {
      title: 'Info',
      rows: [
        { label: 'Name', value: 'Nattha' },
        { label: 'Role', value: 'Admin' },
      ],
    },
  ];

  it('renders label-value rows', () => {
    render(<SnapshotPanel sections={sections} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Nattha')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<SnapshotPanel sections={sections} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('shows skeleton rows when loading', () => {
    render(<SnapshotPanel sections={sections} loading />);
    // skeleton uses aria-hidden spans
    const skeletonItems = document.querySelectorAll('span[aria-hidden="true"]');
    expect(skeletonItems.length).toBeGreaterThan(0);
  });

  it('renders multiple sections', () => {
    const multi = [
      { title: 'Section A', rows: [{ label: 'A', value: '1' }] },
      { title: 'Section B', rows: [{ label: 'B', value: '2' }] },
    ];
    render(<SnapshotPanel sections={multi} />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });
});
