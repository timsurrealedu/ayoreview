import { dbRepo } from '@/lib/db';
import { requireOrgMembership } from '@/lib/auth';
import { generateQrPngDataUrl } from '@/lib/qr';
import Link from 'next/link';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function PrintCardTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { org } = await requireOrgMembership();
  const { id } = await params;
  const card = await dbRepo.getCardById(id, org.id);

  if (!card) {
    return <div className="p-8 text-black">Kartu tidak ditemukan di organisasi Anda.</div>;
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
          href={`/dashboard/cards/${card.id}`}
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Card Settings
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
        >
          Cetak Kartu Dudukan
        </button>
      </div>

      {/* Official ReviewTap 5-Star Acrylic Template (10 x 15 cm ratio) */}
      <div className="w-[360px] h-[520px] bg-white border-2 border-zinc-300 rounded-3xl p-8 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden">
        {/* Top subtle decorative strip */}
        <div className="w-full flex justify-between items-center text-[10px] text-zinc-400 font-mono">
          <span>{card.inventory_code}</span>
          <span>{card.location_name || 'ReviewTap'}</span>
        </div>

        {/* 5-Star Hospitality Visual */}
        <div className="flex flex-col items-center my-auto space-y-3">
          <div className="flex items-center gap-1 text-amber-400 text-2xl tracking-wider">
            ★★★★★
          </div>

          <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">
            Puas dengan kunjungan Anda?
          </h2>

          <p className="text-zinc-600 text-xs font-medium max-w-[220px]">
            Ketuk ponsel pada dudukan atau pindai kode QR untuk memberi ulasan Google
          </p>

          {/* High-DPI QR Container */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-inner mt-2">
            <img
              src={pngDataUrl}
              alt="Pindai untuk memberi Ulasan Google"
              className="w-44 h-44 object-contain"
            />
          </div>

          <div className="flex items-center gap-2 text-zinc-800 text-xs font-bold pt-1">
            <Smartphone className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Ketukan NFC Aktif</span>
          </div>
        </div>

        {/* Bottom Logo & Inventory Bar */}
        <div className="w-full pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span className="font-bold text-zinc-900 tracking-tight flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            ReviewTap
          </span>
          <span className="font-mono text-[10px] text-zinc-400">{card.public_id}</span>
        </div>
      </div>
    </div>
  );
}
