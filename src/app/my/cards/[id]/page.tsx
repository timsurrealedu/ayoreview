import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { generateQrPngDataUrl } from '@/lib/qr';
import { buildReviewUrl } from '@/lib/places';
import { checkCardSubscriptionStatus } from '@/lib/subscription';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  QrCode, 
  Activity, 
  Smartphone, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Building2 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyCardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const userCards = await dbRepo.setupSearchCardsByEmail(user.email);
  const card = userCards.find((c) => c.id === id);

  if (!card) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reviewtap.id';
  const qrTargetUrl = `${appUrl}/q/${card.public_id}`;
  const qrDataUrl = await generateQrPngDataUrl(qrTargetUrl, { width: 400 });

  const targetGoogleUrl = card.place_id
    ? buildReviewUrl(card.place_id)
    : card.google_review_url || qrTargetUrl;

  const analytics = await dbRepo.setupGetCardAnalytics(card.id);
  const subCheck = checkCardSubscriptionStatus(card as any);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/my"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Kartu Saya
      </Link>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121215] border border-zinc-800/80 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {card.business_name || card.name}
            </h1>
            {subCheck.inGracePeriod ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Masa Tenggang 7 Hari ({subCheck.daysRemainingInGrace} hari tersisa)
              </span>
            ) : card.subscription_status === 'active' ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Aktif
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {card.subscription_status || 'Pending'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
            <span>Kode: <strong className="text-amber-400">{card.inventory_code}</strong></span>
            <span>•</span>
            <span>ID: <strong className="text-zinc-300">{card.public_id}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/q/${card.public_id}?test=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Uji Tautan
          </a>
        </div>
      </div>

      {/* Main Grid: QR & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Preview Column */}
        <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded-2xl space-y-4 text-center">
          <h2 className="text-sm font-bold text-white text-left flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-400" /> Kode QR Kartu
          </h2>

          <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto">
            <img src={qrDataUrl} alt="ReviewTap QR" className="w-48 h-48 mx-auto" />
          </div>

          <div className="text-[11px] font-mono text-zinc-400 truncate max-w-full px-2">
            {qrTargetUrl}
          </div>

          <a
            href={qrDataUrl}
            download={`reviewtap-${card.inventory_code}.png`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition"
          >
            <Download className="w-4 h-4" /> Unduh PNG Resolusi Tinggi
          </a>
        </div>

        {/* Analytics & Configuration Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interaction Overview */}
          <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Metrik Interaksi Pelanggan
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Hari Ini</div>
                <div className="text-xl font-bold text-white mt-1">{analytics.today}</div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">7 Hari</div>
                <div className="text-xl font-bold text-white mt-1">{analytics.last7Days}</div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">30 Hari</div>
                <div className="text-xl font-bold text-white mt-1">{analytics.last30Days}</div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Sepanjang Waktu</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{analytics.allTime}</div>
              </div>
            </div>

            {/* Source Breakdown (NFC vs QR) */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-400" /> Tap NFC: {analytics.nfcTotal} ({analytics.nfcPercentage}%)
                </span>
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Scan QR: {analytics.qrTotal} ({analytics.qrPercentage}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-sky-400 h-full transition-all"
                  style={{ width: `${analytics.nfcPercentage}%` }}
                />
                <div
                  className="bg-amber-400 h-full transition-all"
                  style={{ width: `${analytics.qrPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Place & Target Details */}
          <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded-2xl space-y-3 text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Konfigurasi Google Places
            </h2>
            <div className="space-y-2 text-zinc-300 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Google Place ID</span>
                <span className="font-mono text-white text-xs">{card.place_id || 'Tidak ditentukan'}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tujuan Form Ulasan Langsung</span>
                <a
                  href={targetGoogleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline break-all block mt-0.5"
                >
                  {targetGoogleUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
