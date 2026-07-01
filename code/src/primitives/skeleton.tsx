import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: 'sm' | 'md' | 'full';
  lines?: number;
  className?: string;
}

const radiusClass = {
  sm: 'rounded-pcampus-sm',
  md: 'rounded-pcampus-md',
  full: 'rounded-pcampus-full',
} as const;

const SkeletonBlock: React.FC<{
  width?: string | number;
  height?: string | number;
  radius?: SkeletonProps['radius'];
  className?: string;
}> = ({
  width = '100%',
  height = '16px',
  radius = 'md',
  className,
}) => {
  const customSizeStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <span
      aria-hidden="true"
      style={customSizeStyle}
      className={clsx(
        'block bg-gradient-to-r from-pcampus-canvas-soft via-pcampus-hairline-strong to-pcampus-canvas-soft bg-[length:200%_100%] animate-pcampus-shimmer',
        radiusClass[radius ?? 'md'],
        className
      )}
    />
  );
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  radius = 'md',
  lines,
  className,
}) => {
  if (lines && lines > 1) {
    return (
      <span className={clsx('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock
            key={i}
            width={i === lines - 1 && lines > 1 ? '60%' : width}
            height={height}
            radius={radius}
          />
        ))}
      </span>
    );
  }

  return (
    <SkeletonBlock
      width={width}
      height={height}
      radius={radius}
      className={className}
    />
  );
};

Skeleton.displayName = 'Skeleton';
