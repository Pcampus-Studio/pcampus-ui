import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartColors } from './colors';

export interface LineChartProps {
  data: Array<Record<string, number | string>>;
  lines: Array<{ key: string; label: string; color?: string }>;
  xKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xKey,
  height = 300,
  showGrid = true,
  showLegend = true,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%', height }} className="font-pcampus-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--pcampus-color-border-subtle)"
            />
          )}
          <XAxis
            dataKey={xKey}
            stroke="var(--pcampus-color-text-tertiary)"
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="var(--pcampus-color-text-tertiary)"
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--pcampus-color-surface-card)',
              color: 'var(--pcampus-color-text)',
              border: '1px solid var(--pcampus-color-border)',
              borderRadius: 'var(--pcampus-radius-md)',
              fontSize: '12px',
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                color: 'var(--pcampus-color-text)',
                fontSize: '12px',
              }}
            />
          )}
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color || chartColors.palette[index % chartColors.palette.length]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              isAnimationActive={true}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

LineChart.displayName = 'LineChart';
