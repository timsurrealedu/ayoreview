'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function ErrorPage({
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
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <h2 className="text-lg font-bold text-white">Terjadi kesalahan tak terduga</h2>
      <p className="text-xs text-zinc-400 max-w-sm">
        Sistem pemantauan kami telah mencatat masalah ini.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-700 transition"
      >
        Coba lagi
      </button>
    </div>
  );
}
