import React, { useEffect, useRef } from 'react';

export interface ThemeProviderProps {
  theme?: 'light' | 'dark' | 'system';
  tokenOverrides?: Record<string, string>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = 'dark',
  tokenOverrides,
  children,
}) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Apply theme to <html>: data-theme (tokens) + .dark (ThemeToggle / Tailwind)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Inject token overrides
  useEffect(() => {
    if (!tokenOverrides || Object.keys(tokenOverrides).length === 0) {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
      return;
    }

    const overrideCSS = `:root {\n${Object.entries(tokenOverrides)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}`;

    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.setAttribute('data-pcampus-theme-override', '');
      document.head.appendChild(styleRef.current);
    }

    styleRef.current.textContent = overrideCSS;

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [tokenOverrides]);

  return <>{children}</>;
};

ThemeProvider.displayName = 'ThemeProvider';
