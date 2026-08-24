'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2, Printer } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';

const nextAction: Partial<Record<OrderStatus, { label: string; status: OrderStatus; className: string }>> = {
  paid: { label: 'Tandai Dikirim', status: 'shipped', className: 'bg-action hover:bg-action-hover text-white' },
  paid_unfulfilled: { label: 'Tandai Dikirim', status: 'shipped', className: 'bg-action hover:bg-action-hover text-white' },
  review: { label: 'Tandai Dikirim', status: 'shipped', className: 'bg-action hover:bg-action-hover text-white' },
  shipped: { label: 'Tandai Selesai', status: 'completed', className: 'bg-success hover:brightness-95 text-ink' },
};

export function OrderActions({ orderId, status, allocatedCardId }: { orderId: string; status: OrderStatus; allocatedCardId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const action = nextAction[status];

  const update = async (nextStatus: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memperbarui status');
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex items-center gap-1.5">
        {action && (
          <button
            type="button"
            onClick={() => update(action.status)}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition disabled:opacity-50 ${action.className}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {action.label}
          </button>
        )}
        {allocatedCardId && (
          <Link
            href={`/admin/cards/${allocatedCardId}/print`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </Link>
        )}
        {!action && !allocatedCardId && (
          <span className="text-muted-ink text-xs">—</span>
        )}
      </div>
      {allocatedCardId && (
        <Link
          href={`/admin/cards/${allocatedCardId}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-ink hover:text-action transition"
        >
          <ExternalLink className="w-3 h-3" />
          Kartu tertaut
        </Link>
      )}
      {error && <span className="text-error text-xs font-medium">{error}</span>}
    </div>
  );
}
