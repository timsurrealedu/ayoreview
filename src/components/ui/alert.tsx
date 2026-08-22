import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ children }: { children: React.ReactNode }) {
  return <div role="alert" aria-live="assertive" className="flex items-start gap-2.5 rounded border border-error/25 bg-error-soft p-3.5 text-xs font-semibold text-error"><AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{children}</span></div>;
}
