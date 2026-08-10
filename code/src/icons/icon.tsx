import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon, LucideProps } from 'lucide-react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<LucideProps, 'size' | 'ref'> {
  /** Lucide icon component, e.g. `Send` from `@pcampus-studio/ui`. */
  icon: LucideIcon;
  size?: IconSize | number;
  className?: string;
}

const sizePx: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * Thin sizing wrapper around lucide icons.
 * Icons use `currentColor` — set color via parent `text-*` utilities.
 */
export const Icon: React.FC<IconProps> = ({
  icon: Lucide,
  size = 'md',
  className,
  strokeWidth = 2,
  ...props
}) => {
  const px = typeof size === 'number' ? size : sizePx[size];
  return (
    <Lucide
      size={px}
      strokeWidth={strokeWidth}
      aria-hidden={props['aria-label'] || props['aria-labelledby'] ? undefined : true}
      className={clsx('shrink-0 inline-block', className)}
      {...props}
    />
  );
};

Icon.displayName = 'Icon';
