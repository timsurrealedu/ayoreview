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
  let icon = <AlertCircle className="w-12 h-12 text-[#fbbc04]" />;

  if (reason === 'not-found') {
    title = 'Kartu Tidak Ditemukan';
    message = 'Kartu AyoReview ini tidak ditemukan dalam sistem kami. Silakan hubungi pengelola usaha.';
    icon = <HelpCircle className="w-12 h-12 text-zinc-400" />;
  } else if (reason === 'unconfigured') {
    title = 'Pengaturan Belum Selesai';
    message = 'Kartu ulasan ini sudah terdaftar, tetapi tujuan ulasan Google belum dikonfigurasi.';
    icon = <AlertCircle className="w-12 h-12 text-[#1a73e8]" />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-white flex flex-col items-center justify-between p-6 sm:p-12 font-sans">
      <div className="w-full max-w-md flex justify-between items-center text-xs tracking-wider uppercase text-zinc-400">
        <span className="font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[conic-gradient(from_25deg,#ea4335_0_25%,#fbbc04_0_50%,#34a853_0_75%,#1a73e8_0)] flex items-center justify-center text-white font-black text-[10px] ring-2 ring-white/30 ring-inset">
            A
          </div>
          AyoReview
        </span>
        <span className="text-[11px] bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800 text-zinc-300 font-semibold">
          Pengalihan Terproteksi
        </span>
      </div>

      <main className="w-full max-w-md my-auto text-center py-10 px-6 rounded-3xl bg-[#121215] border border-zinc-800 shadow-2xl space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto">
          {icon}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          {title}
        </h1>
        <p className="text-zinc-300 text-sm leading-relaxed max-w-sm mx-auto">
          {message}
        </p>

        <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm shadow-md transition"
          >
            Pelajari AyoReview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="w-full max-w-md text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#34a853]" />
        <span>Titik Interaksi Pelanggan Berbasis NFC & QR Resmi</span>
      </footer>
    </div>
  );
}
