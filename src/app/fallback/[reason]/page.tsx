import { AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const dynamic = 'force-dynamic';

const recoveryCopy: Record<string, { title: string; message: string; icon: React.ReactNode }> = {
  'not-found': {
    title: 'Kartu Tidak Ditemukan',
    message:
      'Kode pada kartu ini tidak terdaftar di sistem AyoReview. Jika Anda pelanggan, mohon beri tahu pihak usaha ini agar kartunya dapat diperiksa.',
    icon: <HelpCircle className="w-12 h-12 text-muted-ink" />,
  },
  unconfigured: {
    title: 'Kartu Sedang Disiapkan',
    message:
      'Kartu ulasan milik usaha ini belum selesai dihubungkan ke profil Google mereka. Silakan kembali lagi nanti, atau beri ulasan langsung melalui Google Maps.',
    icon: <AlertCircle className="w-12 h-12 text-action" />,
  },
  inactive: {
    title: 'Kartu Sedang Tidak Aktif',
    message:
      'Kartu ulasan milik usaha ini sedang tidak aktif. Mohon informasikan pihak pengelola usaha agar dapat mengaktifkannya kembali.',
    icon: <AlertCircle className="w-12 h-12 text-warning" />,
  },
};

export default async function FallbackPage({
  params,
}: {
  params: Promise<{ reason: string }>;
}) {
  const { reason } = await params;
  const copy = recoveryCopy[reason];

  if (!copy) {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md text-center py-10 px-6 rounded bg-surface border border-line shadow-xl space-y-3">
          <HelpCircle className="w-10 h-10 text-muted-ink mx-auto" />
          <h1 className="text-xl font-bold tracking-tight">Halaman Tidak Ditemukan</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col items-center justify-between p-6 sm:p-12 font-sans">
      <div className="w-full max-w-md flex justify-between items-center text-xs tracking-wider uppercase text-muted-ink">
        <span className="font-bold tracking-tight text-ink flex items-center gap-2">
          <Logo size={24} className="rounded-md" />
          AyoReview
        </span>
      </div>

      <main className="w-full max-w-md my-auto text-center py-10 px-6 rounded bg-surface border border-line shadow-2xl space-y-4">
        <div className="inline-flex p-4 rounded bg-subtle border border-line mx-auto">
          {copy.icon}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="text-muted-ink text-sm leading-relaxed max-w-sm mx-auto">
          {copy.message}
        </p>
      </main>

      <footer className="w-full max-w-md text-center text-xs text-muted-ink flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>Titik Interaksi Pelanggan Berbasis NFC & QR Resmi</span>
      </footer>
    </div>
  );
}
