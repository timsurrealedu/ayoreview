import Link from 'next/link';
import { AlertCircle, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function FallbackPage({
  params,
}: {
  params: Promise<{ reason: string }>;
}) {
  const { reason } = await params;

  let title = 'Tautan Ulasan Tidak Tersedia';
  let message = 'Tautan AyoReview ini sedang tidak aktif atau sedang dalam pemeliharaan.';
  let icon = <AlertCircle className="w-12 h-12 text-warning" />;

  if (reason === 'not-found') {
    title = 'Kartu Tidak Ditemukan';
    message = 'Kartu AyoReview ini tidak ditemukan dalam sistem kami. Silakan hubungi pengelola usaha.';
    icon = <HelpCircle className="w-12 h-12 text-muted-ink" />;
  } else if (reason === 'unconfigured') {
    title = 'Pengaturan Belum Selesai';
    message = 'Kartu ulasan ini sudah terdaftar, tetapi tujuan ulasan Google belum dikonfigurasi.';
    icon = <AlertCircle className="w-12 h-12 text-action" />;
  }

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col items-center justify-between p-6 sm:p-12 font-sans">
      <div className="w-full max-w-md flex justify-between items-center text-xs tracking-wider uppercase text-muted-ink">
        <span className="font-bold tracking-tight text-ink flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[conic-gradient(from_25deg,#ea4335_0_25%,#fbbc04_0_50%,#34a853_0_75%,#1a73e8_0)] flex items-center justify-center text-ink font-black text-[10px] ring-2 ring-white/30 ring-inset">
            A
          </div>
          AyoReview
        </span>
        <span className="rounded border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink">
          Pengalihan Terproteksi
        </span>
      </div>

      <main className="w-full max-w-md my-auto text-center py-10 px-6 rounded bg-surface border border-line shadow-2xl space-y-4">
        <div className="inline-flex p-4 rounded bg-surface border border-line mx-auto">
          {icon}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-ink">
          {title}
        </h1>
        <p className="text-ink text-sm leading-relaxed max-w-sm mx-auto">
          {message}
        </p>

        <div className="pt-4 border-t border-line flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-sm shadow-md transition"
          >
            Pelajari AyoReview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="w-full max-w-md text-center text-xs text-muted-ink flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>Titik Interaksi Pelanggan Berbasis NFC & QR Resmi</span>
      </footer>
    </div>
  );
}
