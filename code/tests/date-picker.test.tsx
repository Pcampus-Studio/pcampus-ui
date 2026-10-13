import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker, DateRangePicker } from '../src/primitives/date-picker';

describe('DatePicker', () => {
  it('selects a single calendar day and closes', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        locale="en-GB"
        value={null}
        onChange={onChange}
        placeholder="Select date"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Select date' }));
    await userEvent.click(screen.getByRole('button', { name: '12' }));
    expect(onChange).toHaveBeenCalled();
    const picked = onChange.mock.calls[0][0] as string;
    expect(picked).toMatch(/^\d{4}-\d{2}-12$/);
  });

  it('selects a date range in two clicks', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        locale="en-GB"
        value={{ start: null, end: null }}
        onChange={onChange}
        placeholder="Select dates"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Select dates' }));
    await userEvent.click(screen.getByRole('button', { name: '10' }));
    await userEvent.click(screen.getByRole('button', { name: '12' }));
    expect(onChange).toHaveBeenLastCalledWith({
      start: expect.stringMatching(/^\d{4}-\d{2}-10$/),
      end: expect.stringMatching(/^\d{4}-\d{2}-12$/),
    });
  });
});
