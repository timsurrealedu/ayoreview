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
      <body className="bg-[#09090b] text-white flex items-center justify-center min-h-screen font-sans p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-emerald-500 font-black text-2xl">ReviewTap</div>
          <h2 className="text-xl font-bold">Terjadi kesalahan</h2>
          <p className="text-xs text-zinc-400">
            Kesalahan sistem telah dicatat. Silakan coba lagi.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
