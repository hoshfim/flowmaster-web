'use client';
import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { toggle, isDark } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`btn btn-ghost btn-sm btn-circle transition-all hover:scale-110 ${className}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark
        ? <Sun size={16} className="text-base-content/60 hover:text-warning transition-colors" />
        : <Moon size={16} className="text-base-content/60 hover:text-secondary transition-colors" />
      }
    </button>
  );
}
