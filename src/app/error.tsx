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
    <div role="alert" aria-live="assertive" className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <h2 className="text-lg font-bold text-error">Terjadi kesalahan tak terduga</h2>
      <p className="text-xs text-muted-ink max-w-sm">
        Sistem pemantauan kami telah mencatat masalah ini.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-subtle hover:bg-subtle text-ink font-semibold text-xs rounded border border-line transition"
      >
        Coba lagi
      </button>
    </div>
  );
}
