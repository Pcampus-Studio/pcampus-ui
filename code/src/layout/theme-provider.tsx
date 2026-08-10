import React, { useEffect, useRef } from 'react';

export interface ThemeProviderProps {
  theme?: 'light' | 'dark' | 'system';
  tokenOverrides?: Record<string, string>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = 'system',
  tokenOverrides,
  children,
}) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    if (theme !== 'system') {
      root.setAttribute('data-theme', theme);
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
