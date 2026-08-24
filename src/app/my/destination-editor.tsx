'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, MapPin, PenLine, X } from 'lucide-react';
import { validateGoogleReviewUrl } from '@/lib/url-validator';

export function DestinationEditor({
  publicId,
  businessName,
  merchantEmail,
  isLinked,
}: {
  publicId: string;
  businessName: string;
  merchantEmail: string;
  isLinked: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const check = validateGoogleReviewUrl(url);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!check.isValid || !check.sanitizedUrl) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/setup/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId,
          placeId: check.sanitizedUrl,
          businessName,
          email: merchantEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memperbarui tujuan ulasan');
      }
      setOpen(false);
      setUrl('');
      setFeedback({ tone: 'ok', text: 'Tujuan ulasan diperbarui.' });
      router.refresh();
    } catch (err) {
      setFeedback({ tone: 'error', text: err instanceof Error ? err.message : 'Gagal memperbarui tujuan ulasan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {!open ? (
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-ink font-medium min-w-0">
            <MapPin className="w-3.5 h-3.5 text-action shrink-0" />
            <span className="truncate">{isLinked ? businessName || 'Tujuan terpasang' : 'Belum ada tujuan'}</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition shrink-0"
          >
            <PenLine className="w-3 h-3" />
            Ubah Tujuan
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2 pt-1">
          <label htmlFor={`dest-${publicId}`} className="block text-[11px] font-bold text-ink">
            Tempel tautan ulasan Google baru
          </label>
          <div className="flex gap-2">
            <input
              id={`dest-${publicId}`}
              type="url"
              required
              autoFocus
              placeholder="https://g.page/r/.../review"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 min-w-0 bg-surface border border-line rounded px-3 py-2 text-ink placeholder:text-muted-ink font-mono text-xs focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
            />
            <button
              type="submit"
              disabled={loading || !check.isValid}
              aria-label="Simpan tujuan ulasan"
              className="inline-flex items-center justify-center px-3 py-2 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setUrl('');
                setFeedback(null);
              }}
              aria-label="Batal ubah tujuan"
              className="inline-flex items-center justify-center px-3 py-2 rounded bg-subtle hover:bg-subtle text-ink border border-line transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {url.trim() && !check.isValid && (
            <p role="alert" className="text-[11px] font-semibold text-error">
              Harus berupa tautan Google yang valid (g.page, maps.app.goo.gl, atau search.google.com).
            </p>
          )}
        </form>
      )}
      {feedback && !open && (
        <p role="status" className={feedback.tone === 'ok' ? 'text-[11px] font-semibold text-success' : 'text-[11px] font-semibold text-error'}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
