import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { chartColors } from './colors';

export interface FunnelMiniChartProps {
  data: Array<{ value: number }>;
  width?: string | number;
  height?: number;
  color?: string;
}

export const FunnelMiniChart: React.FC<FunnelMiniChartProps> = ({
  data,
  width = '100%',
  height = 120,
  color = chartColors.primary,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Reverse data so the top steps in the funnel appear on top visually
  const formattedData = data
    .map((d, index) => ({
      id: index,
      value: d.value,
    }))
    .reverse();

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={formattedData}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="id" hide />
          <Bar
            dataKey="value"
            fill={color}
            radius={[0, 4, 4, 0]}
            barSize={12}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

FunnelMiniChart.displayName = 'FunnelMiniChart';
