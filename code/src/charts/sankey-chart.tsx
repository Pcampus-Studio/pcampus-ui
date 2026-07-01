import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Rectangle, Layer } from 'recharts';
import { chartColors } from './colors';

export interface SankeyChartProps {
  nodes: Array<{ id?: string; name: string }>;
  links: Array<{ source: string | number; target: string | number; value: number }>;
  height?: number;
  nodeColor?: string;
  linkColor?: string;
}

interface SankeyNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: { name: string; color?: string };
  containerWidth?: number;
}

// Custom Node for Sankey Chart
const SankeyNode = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  payload,
  containerWidth = 800,
}: SankeyNodeProps) => {
  const isOut = x > containerWidth / 2;
  return (
    <Layer key={`sankey-node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={payload?.color || chartColors.palette[index % chartColors.palette.length]}
        stroke="var(--pcampus-color-border)"
        strokeWidth={1}
      />
      <text
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        textAnchor={isOut ? 'end' : 'start'}
        fill="var(--pcampus-color-text)"
        fontSize="11px"
        alignmentBaseline="middle"
      >
        {payload?.name}
      </text>
    </Layer>
  );
};

export const SankeyChart: React.FC<SankeyChartProps> = ({
  nodes,
  links,
  height = 420,
  nodeColor,
  linkColor = 'rgba(143, 155, 179, 0.2)',
}) => {
  if (!nodes || nodes.length === 0 || !links || links.length === 0) {
    return null;
  }

  const nodeIndexMap = new Map<string | number, number>();
  nodes.forEach((node, index) => {
    const key = node.id || node.name;
    nodeIndexMap.set(key, index);
  });

  const formattedNodes = nodes.map((node, index) => ({
    ...node,
    color: nodeColor || chartColors.palette[index % chartColors.palette.length],
  }));

  const formattedLinks = links
    .map((link) => {
      const sourceIdx = typeof link.source === 'number' ? link.source : nodeIndexMap.get(link.source);
      const targetIdx = typeof link.target === 'number' ? link.target : nodeIndexMap.get(link.target);
      return {
        source: sourceIdx ?? 0,
        target: targetIdx ?? 0,
        value: link.value,
      };
    })
    .filter((l) => l.source !== undefined && l.target !== undefined);

  return (
    <div style={{ width: '100%', height }} className="font-pcampus-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={{ nodes: formattedNodes, links: formattedLinks }}
          node={<SankeyNode />}
          link={{ stroke: linkColor }}
          nodePadding={14}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
        >
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
              props: { payload?: { source?: { name: string }; target?: { name: string } } }
            ) => {
              if (props.payload?.source && props.payload?.target) {
                return [`${value} sessions`, `${props.payload.source.name} → ${props.payload.target.name}`];
              }
              return [value, name];
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

SankeyChart.displayName = 'SankeyChart';
