'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  className?: string;
}

export function CircularProgress({ value, className }: CircularProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress on value change
    const animationFrame = requestAnimationFrame(() => setProgress(value));
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let colorClass = 'text-primary';
  if (value < 70) colorClass = 'text-yellow-400';
  if (value < 50) colorClass = 'text-red-500';

  return (
    <div className={cn('relative h-32 w-32', className)}>
      <svg className="h-full w-full" viewBox="0 0 120 120">
        <circle
          className="text-border"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={cn('transition-all duration-1000 ease-out', colorClass)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center font-headline font-bold',
          colorClass
        )}
      >
        <span className="text-4xl">{Math.round(progress)}</span>
        <span className="text-sm">%</span>
      </div>
    </div>
  );
}
