import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';
import { generateQrPngDataUrl } from '@/lib/qr';
import Link from 'next/link';
import { Smartphone, ArrowLeft, Star } from 'lucide-react';
import { headers } from 'next/headers';
import { Logo } from '@/components/ui/logo';
import { PrintButton } from './print-button';

export const dynamic = 'force-dynamic';

export default async function PrintCardTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePlatformAdmin();
  const { id } = await params;
  const card = await dbRepo.getAnyCardById(id);

  if (!card) {
    return <div className="p-8 text-black">Kartu tidak ditemukan.</div>;
  }

  // Derive base URL from request origin with env override — never hardcode a domain
  const headerStore = await headers();
  const host = headerStore.get('host') || 'localhost:3000';
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const originFromRequest = `${protocol}://${host}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || originFromRequest;
  const qrUrl = `${appUrl}/q/${card.public_id}`;
  const pngDataUrl = await generateQrPngDataUrl(qrUrl, { width: 800, margin: 1 });

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 p-8 flex flex-col items-center justify-center font-sans">
      {/* Non-printable action bar */}
      <div className="no-print w-full max-w-md flex items-center justify-between mb-8">
        <Link
          href={`/admin/cards`}
          className="flex items-center gap-1.5 text-xs text-muted-ink hover:text-zinc-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Inventaris Kartu
        </Link>
        <PrintButton />
      </div>

      {/* Official AyoReview 5-Star Acrylic Template (10 x 15 cm ratio) */}
      <div className="w-full max-w-[360px] h-[540px] bg-white border-2 border-zinc-300 rounded p-8 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden print:w-[360px]">
        {/* Top subtle decorative strip */}
        <div className="w-full flex justify-between items-center text-[10px] text-muted-ink font-mono">
          <span>{card.inventory_code}</span>
          <span>{card.business_name || 'AyoReview'}</span>
        </div>

        {/* 5-Star Hospitality Visual */}
        <div className="flex flex-col items-center my-auto space-y-3">
          <div className="flex items-center gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-6 h-6 fill-warning text-warning" />
            ))}
          </div>
          <span className="sr-only">Ulasan lima bintang</span>

          <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">
            Puas dengan kunjungan Anda?
          </h2>

          <p className="text-muted-ink text-xs font-medium max-w-[220px]">
            Ketuk ponsel pada dudukan atau pindai kode QR untuk memberi ulasan Google
          </p>

          {/* High-DPI QR Container — pure white quiet zone for maximum scanability */}
          <div className="p-3.5 bg-white mt-2">
            <img
              src={pngDataUrl}
              alt="Pindai untuk memberi Ulasan Google"
              className="w-44 h-44 object-contain"
            />
          </div>

          <div className="flex items-center gap-2 text-zinc-800 text-xs font-bold pt-1">
            <Smartphone className="w-4 h-4 text-action animate-pulse" />
            <span>Ketukan NFC Aktif</span>
          </div>
        </div>

        {/* Bottom Logo & Inventory Bar */}
        <div className="w-full pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] text-muted-ink font-medium">
          <span className="font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
            <Logo size={16} className="rounded" />
            AyoReview
          </span>
          <span className="font-mono text-[10px] text-muted-ink">{card.public_id}</span>
        </div>
      </div>
    </div>
  );
}
