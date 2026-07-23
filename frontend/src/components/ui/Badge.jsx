import React from 'react';
import { cn } from './Button';

export const Badge = ({
  className,
  variant = 'default',
  children,
  icon: Icon,
  ...props
}) => {
  const variants = {
    default: 'bg-primary/15 text-primary border-primary/20',
    secondary: 'bg-surface-containerHighest text-muted-foreground border-border/50',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    outline: 'bg-transparent text-foreground border-border',
    glow: 'bg-primary text-primary-foreground shadow-glow font-bold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};
