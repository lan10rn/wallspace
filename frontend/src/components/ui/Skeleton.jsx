import React from 'react';
import { cn } from './Button';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-surface-containerHighest/60',
        className
      )}
      {...props}
    />
  );
}
