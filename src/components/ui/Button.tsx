'use client';
import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'secondary';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    const variants = {
      primary:   'btn btn-primary',
      secondary: 'btn btn-secondary',
      ghost:     'btn btn-ghost border border-base-content/10',
      outline:   'btn btn-outline btn-secondary',
      danger:    'btn btn-error btn-outline',
    };
    const sizes = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          variants[variant],
          sizes[size],
          'gap-2 transition-all',
          loading && 'loading loading-spinner',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
