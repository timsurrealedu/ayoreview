'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-canvas text-ink flex items-center justify-center min-h-screen font-sans p-6">
        <div role="alert" aria-live="assertive" className="max-w-md w-full rounded border border-error/25 bg-surface p-6 text-center shadow-lg space-y-4">
          <div className="text-action font-black text-2xl">AyoReview</div>
          <h2 className="text-xl font-bold">Terjadi kesalahan sistem</h2>
          <p className="text-xs text-ink">
            Kesalahan sistem telah dicatat secara otomatis. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-action hover:bg-action-hover text-white font-bold text-xs rounded shadow transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
