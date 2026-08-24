import Link from 'next/link';
import { Clock3, RotateCcw, ShieldCheck } from 'lucide-react';
import { safeInternalPath } from '@/lib/rate-limit-presentation';
import { Logo } from '@/components/ui/logo';

export default async function RateLimitedPage({ searchParams }: { searchParams: Promise<{ path?: string; retryAfter?: string }> }) {
  const query = await searchParams;
  const retryPath = safeInternalPath(query.path);
  const retryAfter = Math.max(1, Number.parseInt(query.retryAfter || '60', 10) || 60);
  return <div className="flex min-h-[100dvh] flex-col bg-canvas p-6 text-ink sm:p-10"><header className="mx-auto flex w-full max-w-lg items-center gap-2.5 border-b border-line pb-4"><Logo size={32} className="shrink-0" /><span className="font-bold">AyoReview</span></header><main className="mx-auto my-auto w-full max-w-lg rounded border border-line bg-surface p-6 shadow-lg sm:p-8"><div className="flex h-12 w-12 items-center justify-center rounded bg-warning-soft text-warning"><Clock3 aria-hidden="true" className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-black tracking-tight">Terlalu banyak permintaan</h1><p className="mt-2 text-sm leading-relaxed text-muted-ink">Sistem membatasi lalu lintas sementara untuk menjaga layanan tetap stabil. Coba lagi dalam sekitar {retryAfter} detik.</p><dl className="mt-6 rounded border border-line bg-subtle p-4 text-xs"><div className="flex gap-3"><dt className="font-semibold text-muted-ink">Halaman</dt><dd className="min-w-0 break-all font-mono text-ink">{retryPath}</dd></div></dl><Link href={retryPath} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-action px-5 py-3 text-sm font-bold text-white hover:bg-action-hover"><RotateCcw aria-hidden="true" className="h-4 w-4" />Coba lagi</Link></main><footer className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 text-xs text-muted-ink"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-success" />Batas sementara melindungi stabilitas layanan</footer></div>;
}
