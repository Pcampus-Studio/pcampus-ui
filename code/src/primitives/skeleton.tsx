import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: 'sm' | 'md' | 'full';
  lines?: number;
}

const radiusMap: Record<NonNullable<SkeletonProps['radius']>, string> = {
  sm: 'var(--pcampus-radius-sm)',
  md: 'var(--pcampus-radius-md)',
  full: 'var(--pcampus-radius-full)',
};

const shimmerKeyframes = `
@keyframes pcampus-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
`;

const SkeletonBlock: React.FC<{ width?: string | number; height?: string | number; radius?: SkeletonProps['radius'] }> = ({
  width = '100%',
  height = '16px',
  radius = 'md',
}) => {
  const style: React.CSSProperties = {
    display: 'block',
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: radiusMap[radius ?? 'md'],
    background: `linear-gradient(
      90deg,
      var(--pcampus-color-surface-subtle) 0%,
      var(--pcampus-color-border-subtle) 50%,
      var(--pcampus-color-surface-subtle) 100%
    )`,
    backgroundSize: '200% 100%',
    animation: `pcampus-shimmer var(--pcampus-duration-shimmer) var(--pcampus-ease-linear) infinite`,
  };

  return <span style={style} aria-hidden="true" />;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  radius = 'md',
  lines,
}) => {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      {lines && lines > 1 ? (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pcampus-space-3)' }}>
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBlock
              key={i}
              width={i === lines - 1 && lines > 1 ? '60%' : width}
              height={height}
              radius={radius}
            />
          ))}
        </span>
      ) : (
        <SkeletonBlock width={width} height={height} radius={radius} />
      )}
    </>
  );
};

Skeleton.displayName = 'Skeleton';
