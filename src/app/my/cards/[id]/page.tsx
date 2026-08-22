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
import { StatusBadge } from '@/components/ui/status-badge';

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayoreview.id';
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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-ink transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Kartu Saya
      </Link>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-line p-6 rounded shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-ink tracking-tight">
              {card.business_name || card.name}
            </h1>
            {subCheck.inGracePeriod ? <StatusBadge tone="warning">Masa Tenggang 7 Hari ({subCheck.daysRemainingInGrace} hari tersisa)</StatusBadge> : card.subscription_status === 'active' ? <StatusBadge tone="success">Aktif</StatusBadge> : <StatusBadge>{card.subscription_status || 'Pending'}</StatusBadge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-ink mt-1 font-mono">
            <span>Kode: <strong className="text-[#fbbc04] font-semibold">{card.inventory_code}</strong></span>
            <span>•</span>
            <span>ID: <strong className="text-ink">{card.public_id}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/q/${card.public_id}?test=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Uji Tautan
          </a>
        </div>
      </div>

      {/* Main Grid: QR & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Preview Column */}
        <div className="bg-surface border border-line p-6 rounded space-y-4 text-center">
          <h2 className="text-sm font-bold text-ink text-left flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#1a73e8]" /> Kode QR Kartu
          </h2>

          <div className="bg-white p-4 rounded inline-block shadow-lg mx-auto">
            <img src={qrDataUrl} alt="AyoReview QR" className="w-48 h-48 mx-auto" />
          </div>

          <div className="text-[11px] font-mono text-ink truncate max-w-full px-2">
            {qrTargetUrl}
          </div>

          <a
            href={qrDataUrl}
            download={`ayoreview-${card.inventory_code}.png`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
          >
            <Download className="w-4 h-4" /> Unduh PNG Resolusi Tinggi
          </a>
        </div>

        {/* Analytics & Configuration Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interaction Overview */}
          <div className="bg-surface border border-line p-6 rounded space-y-4">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1a73e8]" /> Metrik Interaksi Pelanggan
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-surface border border-line p-3.5 rounded">
                <div className="text-[10px] text-muted-ink uppercase font-semibold">Hari Ini</div>
                <div className="text-xl font-bold text-ink mt-1">{analytics.today}</div>
              </div>
              <div className="bg-surface border border-line p-3.5 rounded">
                <div className="text-[10px] text-muted-ink uppercase font-semibold">7 Hari</div>
                <div className="text-xl font-bold text-ink mt-1">{analytics.last7Days}</div>
              </div>
              <div className="bg-surface border border-line p-3.5 rounded">
                <div className="text-[10px] text-muted-ink uppercase font-semibold">30 Hari</div>
                <div className="text-xl font-bold text-ink mt-1">{analytics.last30Days}</div>
              </div>
              <div className="bg-surface border border-line p-3.5 rounded">
                <div className="text-[10px] text-muted-ink uppercase font-semibold">Sepanjang Waktu</div>
                <div className="text-xl font-bold text-[#34a853] mt-1">{analytics.allTime}</div>
              </div>
            </div>

            {/* Source Breakdown (NFC vs QR) */}
            <div className="bg-surface border border-line p-4 rounded space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-ink flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#1a73e8]" /> Tap NFC: {analytics.nfcTotal} ({analytics.nfcPercentage}%)
                </span>
                <span className="text-ink flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#fbbc04]" /> Scan QR: {analytics.qrTotal} ({analytics.qrPercentage}%)
                </span>
              </div>
              <div className="w-full bg-subtle h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#1a73e8] h-full transition-all"
                  style={{ width: `${analytics.nfcPercentage}%` }}
                />
                <div
                  className="bg-[#fbbc04] h-full transition-all"
                  style={{ width: `${analytics.qrPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Place & Target Details */}
          <div className="bg-surface border border-line p-6 rounded space-y-3 text-xs">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1a73e8]" /> Konfigurasi Google Places
            </h2>
            <div className="space-y-2 text-ink bg-surface border border-line p-4 rounded">
              <div>
                <span className="text-muted-ink block text-[10px] uppercase font-bold">Google Place ID</span>
                <span className="font-mono text-ink text-xs">{card.place_id || 'Tidak ditentukan'}</span>
              </div>
              <div className="pt-2 border-t border-line">
                <span className="text-muted-ink block text-[10px] uppercase font-bold">Tujuan Form Ulasan Langsung</span>
                <a
                  href={targetGoogleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a73e8] hover:text-[#4285f4] hover:underline break-all block mt-0.5"
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
