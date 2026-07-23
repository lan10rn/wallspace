import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      children,
      disabled,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none';

    const variants = {
      default:
        'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 rounded-full',
      material:
        'bg-primary-container text-onPrimaryContainer hover:bg-primary-container/80 rounded-full font-semibold shadow-sm hover:shadow-md',
      secondary:
        'bg-surface-containerHigh text-foreground hover:bg-surface-containerHighest rounded-full border border-border/50',
      outline:
        'border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary rounded-full',
      ghost:
        'hover:bg-surface-containerHigh text-foreground rounded-full',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md rounded-full',
    };

    const sizes = {
      default: 'h-10 px-5 py-2 text-sm',
      sm: 'h-8 px-3.5 text-xs',
      lg: 'h-12 px-7 text-base',
      icon: 'h-10 w-10 p-0 rounded-full',
      iconSm: 'h-8 w-8 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {Icon && <Icon className={cn('w-4 h-4 mr-2', size === 'icon' || size === 'iconSm' ? 'mr-0' : '')} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
