import React from 'react';
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { chartColors } from './colors';

export interface FunnelChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  height = 360,
  showValues = true,
  showPercentages = true,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const formattedData = data.map((d, index) => {
    const percentage = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
    return {
      ...d,
      name: d.label,
      value: d.value,
      percentage: Math.round(percentage),
      fill: d.color || chartColors.palette[index % chartColors.palette.length],
    };
  });

  return (
    <div style={{ width: '100%', height }} className="font-pcampus-sans">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--pcampus-color-surface-card)',
              color: 'var(--pcampus-color-text)',
              border: '1px solid var(--pcampus-color-border)',
              borderRadius: 'var(--pcampus-radius-md)',
              fontSize: '12px',
            }}
            formatter={(
              value: number | string,
              name: string,
              props: { payload?: { percentage?: number } }
            ) => {
              const pct = props.payload?.percentage;
              const text = showPercentages && pct !== undefined ? `${value} (${pct}%)` : `${value}`;
              return [text, name];
            }}
          />
          <Funnel
            dataKey="value"
            data={formattedData}
            isAnimationActive={true}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              position="inside"
              fill="var(--pcampus-color-text-inverse)"
              stroke="none"
              dataKey="name"
              fontSize={12}
            />
            {showValues && (
              <LabelList
                position="right"
                fill="var(--pcampus-color-text)"
                stroke="none"
                dataKey="value"
                fontSize={11}
                formatter={(value: number) => {
                  const pct = Math.round((value / maxValue) * 100);
                  return showPercentages ? `${value} (${pct}%)` : `${value}`;
                }}
              />
            )}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

FunnelChart.displayName = 'FunnelChart';
