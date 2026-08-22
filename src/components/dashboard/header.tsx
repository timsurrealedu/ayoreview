'use client';

import { ReactNode } from 'react';

export function DashboardHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="h-16 border-b border-line bg-canvas/90 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex flex-col justify-center">
        <h1 className="text-base sm:text-lg font-bold text-ink tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-ink leading-tight mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {actions}
      </div>
    </header>
  );
}
