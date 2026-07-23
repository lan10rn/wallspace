import React from 'react';
import { cn } from './Button';

export const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-4 text-muted-foreground pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-full bg-surface-containerHigh/80 px-4 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border border-border/40 hover:border-border',
          Icon ? 'pl-11' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export const Select = React.forwardRef(({ className, children, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-full bg-surface-containerHigh px-4 text-sm text-foreground border border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer hover:bg-surface-containerHighest pr-8',
          Icon ? 'pl-9' : '',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3.5 text-muted-foreground pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
});
Select.displayName = 'Select';
