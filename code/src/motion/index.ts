// Duration presets (ms numbers for programmatic use)
export const duration = {
  micro:     100,
  fast:      150,
  panel:     220,
  story:     300,
  chainLink:  40,
  shimmer:  2000,
  pulse:    3000,
} as const;

// Easing functions (CSS strings)
export const ease = {
  standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  enter:    'cubic-bezier(0.0, 0.0, 0.2, 1)',
  exit:     'cubic-bezier(0.4, 0.0, 1, 1)',
} as const;

// Transition presets (for React style props or Framer Motion)
export const transition = {
  panel:   { duration: duration.panel / 1000,   ease: ease.standard },
  overlay: { duration: duration.story / 1000,   ease: ease.enter },
  micro:   { duration: duration.micro / 1000,   ease: ease.standard },
} as const;

export * from './hooks/use-motion-preference';
export * from './pcampus-loader';
