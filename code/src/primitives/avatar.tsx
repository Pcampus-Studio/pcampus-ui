import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
};

const fontSizeMap: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'var(--pcampus-text-2xs)',
  sm: 'var(--pcampus-text-xs)',
  md: 'var(--pcampus-text-sm)',
  lg: 'var(--pcampus-text-base)',
};

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
}) => {
  const px = sizeMap[size];
  const borderRadius = shape === 'circle' ? 'var(--pcampus-radius-full)' : 'var(--pcampus-radius-md)';

  const baseStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius,
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--pcampus-font-sans)',
    fontWeight: 600,
    fontSize: fontSizeMap[size],
  };

  if (src) {
    return (
      <span style={baseStyle}>
        <img
          src={src}
          alt={name ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <span
      style={{
        ...baseStyle,
        background: 'var(--pcampus-color-primary-subtle)',
        color: 'var(--pcampus-color-primary)',
        userSelect: 'none',
      }}
      aria-label={name ?? 'avatar'}
    >
      {initials}
    </span>
  );
};

Avatar.displayName = 'Avatar';
