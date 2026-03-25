'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'fm-dark' | 'fm-light';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('fm-dark');

  useEffect(() => {
    const stored = localStorage.getItem('fm-theme') as Theme | null;
    const initial = stored ?? 'fm-dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggle() {
    const next: Theme = theme === 'fm-dark' ? 'fm-light' : 'fm-dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fm-theme', next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'fm-dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
