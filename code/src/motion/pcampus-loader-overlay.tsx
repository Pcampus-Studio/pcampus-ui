'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
 * `cover="viewport"` portals to `document.body` so AppShell overflow cannot clip it.
 */
export const PcampusLoaderOverlay = React.forwardRef<HTMLDivElement, PcampusLoaderOverlayProps>(
  (
    {
      cover = 'contain',
      size = 120,
      color = 'currentColor',
      className,
      ...rest
    },
    ref,
  ) => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
      setPortalTarget(cover === 'viewport' ? document.body : null);
    }, [cover]);

    const node = (
      <div
        ref={ref}
        className={clsx(
          'pcampus-loader-overlay',
          cover === 'viewport'
            ? 'pcampus-loader-overlay--viewport'
            : 'pcampus-loader-overlay--contain',
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
    );

    if (cover === 'viewport' && portalTarget) {
      return createPortal(node, portalTarget);
    }
    return node;
  },
);

PcampusLoaderOverlay.displayName = 'PcampusLoaderOverlay';
