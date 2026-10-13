import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, DateRangePicker, type DateRangeValue } from '../src/primitives/date-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'Primitives/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Single: Story = {
  render: function SingleStory() {
    const [value, setValue] = useState<string | null>('2026-10-12');
    return (
      <DatePicker
        label="Date"
        locale="en-GB"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const ThaiLocale: Story = {
  render: function ThaiStory() {
    const [value, setValue] = useState<string | null>('2026-10-12');
    return (
      <DatePicker
        label="วันที่"
        locale="th-TH"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Range: Story = {
  render: function RangeStory() {
    const [value, setValue] = useState<DateRangeValue>({
      start: '2026-10-11',
      end: '2026-10-13',
    });
    return (
      <DateRangePicker
        label="Date range"
        locale="en-GB"
        value={value}
        onChange={setValue}
        maxSpanDays={7}
      />
    );
  },
};
