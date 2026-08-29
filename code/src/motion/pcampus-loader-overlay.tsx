import React from 'react';
import { clsx } from 'clsx';
import { PcampusLoader, type PcampusLoaderProps } from './pcampus-loader';

export interface PcampusLoaderOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `contain` fills the nearest positioned ancestor. `viewport` covers the screen. */
  cover?: 'contain' | 'viewport';
  size?: PcampusLoaderProps['size'];
  color?: PcampusLoaderProps['color'];
}

/**
 * Full-area loading veil with the Pcampus mark.
 * Parent must be `relative` when `cover="contain"`.
 */
export const PcampusLoaderOverlay = React.forwardRef<HTMLDivElement, PcampusLoaderOverlayProps>(
  (
    {
      cover = 'contain',
      size = 120,
      color = 'var(--pcampus-color-text)',
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-center justify-center bg-[var(--pcampus-color-overlay)]',
        cover === 'viewport'
          ? 'fixed inset-0 z-[var(--pcampus-z-overlay)]'
          : 'absolute inset-0 z-[var(--pcampus-z-overlay)]',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      {...rest}
    >
      <PcampusLoader size={size} color={color} />
    </div>
  ),
);

PcampusLoaderOverlay.displayName = 'PcampusLoaderOverlay';
