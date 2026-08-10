'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { duration } from '../motion';

const iconTransition = {
  duration: duration.fast / 1000,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const stored = window.localStorage.getItem('theme');
    const isDark =
      stored === 'dark' ||
      root.getAttribute('data-theme') === 'dark' ||
      root.classList.contains('dark');
    const next = isDark ? 'dark' : 'light';
    setTheme(next);
    root.setAttribute('data-theme', next);
    root.classList.toggle('dark', next === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    const root = document.documentElement;
    root.setAttribute('data-theme', next);
    root.classList.toggle('dark', next === 'dark');
    window.localStorage.setItem('theme', next);
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-pcampus-hairline bg-pcampus-surface-card/50" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-pcampus-hairline bg-pcampus-surface-card/60 text-pcampus-ink shadow-sm backdrop-blur-sm transition-all hover:bg-pcampus-canvas-soft hover:shadow"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : 90,
          opacity: theme === 'light' ? 1 : 0,
        }}
        transition={iconTransition}
        className="absolute"
      >
        <SunIcon />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : -90,
          opacity: theme === 'dark' ? 1 : 0,
        }}
        transition={iconTransition}
        className="absolute"
      >
        <MoonIcon />
      </motion.div>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-[18px] w-[18px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-[18px] w-[18px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
}

ThemeToggle.displayName = 'ThemeToggle';
