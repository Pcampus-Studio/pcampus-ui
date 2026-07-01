import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartColors } from './colors';

export interface BarChartProps {
  data: Array<Record<string, number | string>>;
  bars: Array<{ key: string; label: string; color?: string }>;
  xKey: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xKey,
  height = 300,
  layout = 'horizontal',
  showGrid = true,
  showLegend = true,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const isVertical = layout === 'vertical';

  return (
    <div style={{ width: '100%', height }} className="font-pcampus-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 10, left: isVertical ? 0 : -20, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--pcampus-color-border-subtle)"
            />
          )}
          {isVertical ? (
            <>
              <XAxis
                type="number"
                stroke="var(--pcampus-color-text-tertiary)"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                stroke="var(--pcampus-color-text-tertiary)"
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey={xKey}
                stroke="var(--pcampus-color-text-tertiary)"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                type="number"
                stroke="var(--pcampus-color-text-tertiary)"
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
            </>
          )}
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
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label}
              fill={bar.color || chartColors.palette[index % chartColors.palette.length]}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              barSize={16}
              isAnimationActive={true}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

BarChart.displayName = 'BarChart';
