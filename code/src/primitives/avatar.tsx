import React from 'react';
import { clsx } from 'clsx';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  className?: string;
}

const sizeClass = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-[12px]',
  lg: 'w-14 h-14 text-base',
} as const;

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const second = words[1]?.[0] ?? '';
  return (first + second).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className,
}) => {
  const borderRadiusClass = shape === 'circle' ? 'rounded-pcampus-full' : 'rounded-pcampus-md';

  const avatarClasses = clsx(
    'shrink-0 overflow-hidden inline-flex items-center justify-center font-pcampus-sans font-semibold',
    sizeClass[size],
    borderRadiusClass,
    className
  );

  if (src) {
    return (
      <span className={avatarClasses}>
        <img
          src={src}
          alt={name ?? ''}
          className="w-full h-full object-cover"
        />
      </span>
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <span
      className={clsx(
        avatarClasses,
        'bg-[var(--pcampus-color-primary-subtle)] text-pcampus-primary select-none'
      )}
      aria-label={name ?? 'avatar'}
    >
      {initials}
    </span>
  );
};

Avatar.displayName = 'Avatar';
