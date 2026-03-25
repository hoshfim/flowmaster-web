'use client';
import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:  string;
  error?:  string;
  help?:   string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, help, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={inputId} className="label pb-1">
            <span className="label-text text-xs uppercase tracking-widest text-base-content/50">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input input-bordered w-full',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && (
          <label className="label pt-1">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {help && !error && (
          <label className="label pt-1">
            <span className="label-text-alt text-base-content/40">{help}</span>
          </label>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
