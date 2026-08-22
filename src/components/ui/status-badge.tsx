import { AlertCircle, CheckCircle2, CircleDot, Info, TriangleAlert } from 'lucide-react';
import clsx from 'clsx';

const tones = {
  success: { styles: 'bg-success-soft text-success border-success/25', icon: CheckCircle2 },
  warning: { styles: 'bg-warning-soft text-warning border-warning/25', icon: TriangleAlert },
  error: { styles: 'bg-error-soft text-error border-error/25', icon: AlertCircle },
  info: { styles: 'bg-action-soft text-action border-action/25', icon: Info },
  neutral: { styles: 'bg-subtle text-ink border-line', icon: CircleDot },
} as const;

export function StatusBadge({ tone = 'neutral', children, className }: { tone?: keyof typeof tones; children: React.ReactNode; className?: string }) {
  const { styles, icon: Icon } = tones[tone];
  return <span className={clsx('inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide', styles, className)}><Icon aria-hidden="true" className="h-3 w-3" />{children}</span>;
}
