import { useState, useEffect } from 'react';

export function useMotionPreference(): 'full' | 'reduced' {
  const [preference, setPreference] = useState<'full' | 'reduced'>('full');

  useEffect(() => {
    // Check if window is defined (for SSR environments)
    if (typeof window === 'undefined') {
      return;
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreference(mq.matches ? 'reduced' : 'full');

    const handler = (e: MediaQueryListEvent) => {
      setPreference(e.matches ? 'reduced' : 'full');
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return preference;
}
