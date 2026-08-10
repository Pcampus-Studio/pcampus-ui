import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { chartColors } from './colors';
import { Card } from '../primitives/card';
import { clsx } from 'clsx';

export interface KpiChartProps {
  label: string;
  value: string | number;
  trend?: Array<{ value: number }>;
  trendColor?: 'positive' | 'negative' | 'neutral';
  delta?: string;
  className?: string;
}

export const KpiChart: React.FC<KpiChartProps> = ({
  label,
  value,
  trend,
  trendColor = 'neutral',
  delta,
  className,
}) => {
  const colorMap = {
    positive: chartColors.success,
    negative: chartColors.error,
    neutral: chartColors.neutral,
  };

  const deltaTextClass = {
    positive: 'text-pcampus-success',
    negative: 'text-pcampus-error',
    neutral: 'text-pcampus-muted',
  };

  const selectedColor = colorMap[trendColor];

  // Sanitize gradient ID for HTML spec safety
  const gradientId = React.useMemo(() => {
    return `kpi-grad-${label.replace(/[^a-zA-Z0-9]/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;
  }, [label]);

  const trendData = trend?.map((val, idx) => ({ id: idx, value: val }));

  return (
    <Card className={clsx('flex flex-col gap-1 font-pcampus-sans', className)}>
      <div className="text-sm font-medium text-pcampus-muted">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-pcampus-ink">
          {value}
        </span>
        {delta && (
          <span className={clsx('text-sm font-semibold', deltaTextClass[trendColor])}>
            {delta}
          </span>
        )}
      </div>
      {trendData && trendData.length > 0 && (
        <div className="h-10 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={selectedColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={selectedColor}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

KpiChart.displayName = 'KpiChart';
