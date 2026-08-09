import React from 'react';
import { Badge, type BadgeProps } from '../primitives/badge';

export type StatusBadgeStatus =
  | 'ok'
  | 'warn'
  | 'err'
  | 'info'
  | 'muted'
  | 'neutral';

export interface StatusBadgeProps {
  status?: StatusBadgeStatus;
  children?: React.ReactNode;
  size?: BadgeProps['size'];
  /** Show status dot. Default true. */
  dot?: boolean;
  className?: string;
}

const statusToVariant: Record<StatusBadgeStatus, BadgeProps['variant']> = {
  ok: 'success',
  warn: 'warning',
  err: 'error',
  info: 'primary',
  muted: 'default',
  neutral: 'neutral',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'neutral',
  children,
  size = 'sm',
  dot = true,
  className,
}) => (
  <Badge
    variant={statusToVariant[status]}
    size={size}
    dot={dot}
    className={className}
  >
    {children}
  </Badge>
);

StatusBadge.displayName = 'StatusBadge';
