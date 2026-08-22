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
          <div className="text-[#1a73e8] font-black text-2xl">AyoReview</div>
          <h2 className="text-xl font-bold">Terjadi kesalahan sistem</h2>
          <p className="text-xs text-zinc-300">
            Kesalahan sistem telah dicatat secara otomatis. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
