import Link from 'next/link';
import { AlertCircle, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function FallbackPage({
  params,
}: {
  params: Promise<{ reason: string }>;
}) {
  const { reason } = await params;

  let title = 'Review Link Unavailable';
  let message = 'This ReviewTap link is currently inactive or being updated.';
  let icon = <AlertCircle className="w-12 h-12 text-amber-500" />;

  if (reason === 'not-found') {
    title = 'Card Not Found';
    message = 'We could not locate this ReviewTap card in our system. Please check with the business staff.';
    icon = <HelpCircle className="w-12 h-12 text-zinc-400" />;
  } else if (reason === 'unconfigured') {
    title = 'Setup Incomplete';
    message = 'This review card is registered but the Google review destination has not been configured yet.';
    icon = <AlertCircle className="w-12 h-12 text-sky-500" />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-6 sm:p-12 font-sans">
      <div className="w-full max-w-md flex justify-between items-center text-xs tracking-wider uppercase text-zinc-400">
        <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ReviewTap
        </span>
        <span className="text-[11px] bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">Protected Redirect</span>
      </div>

      <main className="w-full max-w-md my-auto text-center py-12 px-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
        <div className="inline-flex p-4 rounded-2xl bg-zinc-800/50 mb-6 ring-1 ring-zinc-700/50">
          {icon}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-3">
          {title}
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {message}
        </p>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-medium text-sm hover:bg-zinc-100 active:scale-[0.98] transition-all"
          >
            Learn About ReviewTap
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="w-full max-w-md text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Hardware-Enabled Customer Touchpoints</span>
      </footer>
    </div>
  );
}
