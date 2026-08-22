import { dbRepo } from '@/lib/db';
import { requireOrgMembership } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard/header';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { SourceSplitCard } from '@/components/dashboard/source-split';
import { TopCardsTable } from '@/components/dashboard/top-cards-table';
import { ActivateCardModal } from '@/components/ui/activate-card-modal';
import Link from 'next/link';
import { 
  Plus, 
  TrendingUp, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Smartphone,
  ExternalLink,
  Store,
  Sparkles,
  AlertCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { org } = await requireOrgMembership();
  const params = await searchParams;
  const adminError = params.error === 'unauthorized_admin_access' ? 'Anda tidak memiliki hak akses operator platform.' : null;
  const [overview, trend, topCards, locations, businesses] = await Promise.all([
    dbRepo.getAnalyticsOverview(org.id),
    dbRepo.getDailyTrend(org.id, 30),
    dbRepo.getTopCards(org.id, 5),
    dbRepo.getLocationsWithStats(org.id),
    dbRepo.getBusinesses(org.id),
  ]);

  const hasInteractions = overview.allTime > 0;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Ringkasan"
        subtitle={`Pantau performa kartu ulasan dan interaksi pelanggan ${org.name}`}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            <ActivateCardModal />
            <Link
              href="/dashboard/cards"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md shadow-[#1a73e8]/20 transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Kartu</span>
            </Link>
          </div>
        }
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Error Banner */}
        {adminError && (
          <div role="alert" aria-live="assertive" className="flex items-center gap-2.5 rounded border border-error/25 bg-error-soft p-4 text-xs text-error">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-semibold">{adminError}</span>
          </div>
        )}

        {/* 4 Distinct, Purposeful KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Interaksi */}
          <div className="bg-surface border border-line rounded p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-ink text-xs font-bold uppercase tracking-wider">
              <span>Total Interaksi</span>
              <Activity className="w-4 h-4 text-[#1a73e8]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {overview.allTime.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-ink pt-1">
              <span>Total Scan QR & Tap NFC</span>
              {overview.todayGrowthPct > 0 && (
                <span className="text-[#34a853] font-bold">+{overview.todayGrowthPct}%</span>
              )}
            </div>
          </div>

          {/* 2. Kunjungan Ulasan (30 Hari) */}
          <div className="bg-surface border border-line rounded p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-ink text-xs font-bold uppercase tracking-wider">
              <span>Kunjungan Ulasan</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1a73e8]/20 text-[#4285f4] border border-[#1a73e8]/30">
                30 Hari
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#34a853] tracking-tight">
              {overview.last30Days.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-muted-ink pt-1">
              Pengalihan sukses ke ulasan Google
            </div>
          </div>

          {/* 3. Scan QR */}
          <div className="bg-surface border border-line rounded p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-ink text-xs font-bold uppercase tracking-wider">
              <span>Scan QR</span>
              <QrCode className="w-4 h-4 text-[#34a853]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {overview.qrTotal.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-muted-ink pt-1">
              {hasInteractions ? `${overview.qrPercentage}% dari total interaksi` : '—% dari total interaksi'}
            </div>
          </div>

          {/* 4. Tap NFC */}
          <div className="bg-surface border border-line rounded p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-ink text-xs font-bold uppercase tracking-wider">
              <span>Tap NFC</span>
              <Smartphone className="w-4 h-4 text-[#1a73e8]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {overview.nfcTotal.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-muted-ink pt-1">
              {hasInteractions ? `${overview.nfcPercentage}% dari total interaksi` : '—% dari total interaksi'}
            </div>
          </div>
        </div>

        {/* Charts & Ratio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendChart data={trend} />
          </div>
          <div>
            <SourceSplitCard
              qrTotal={overview.qrTotal}
              nfcTotal={overview.nfcTotal}
              qrPercentage={overview.qrPercentage}
              nfcPercentage={overview.nfcPercentage}
            />
          </div>
        </div>

        {/* Top Cards & Locations Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopCardsTable cards={topCards} />
          </div>

          {/* Multi-Location Overview */}
          <div className="bg-surface border border-line rounded p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-ink tracking-tight">
                  Performa Lokasi Usaha
                </h3>
                <Link
                  href="/dashboard/locations"
                  className="text-xs text-[#1a73e8] hover:text-[#4285f4] font-semibold hover:underline"
                >
                  Kelola
                </Link>
              </div>
              <p className="text-xs text-ink mb-4">
                Cabang terdaftar dan kartu yang aktif
              </p>

              <div className="space-y-2.5">
                {locations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/dashboard/locations/${loc.id}`}
                    className="block p-3 rounded bg-surface/90 border border-line hover:border-[#1a73e8] transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-ink tracking-tight">
                        {loc.name}
                      </span>
                      <span className="text-xs font-black text-[#34a853]">
                        {loc.total_interactions.toLocaleString('id-ID')} interaksi
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-ink">
                      <span>{loc.city}</span>
                      <span>{loc.active_card_count} kartu aktif</span>
                    </div>
                  </Link>
                ))}
                {locations.length === 0 && (
                  <div className="text-center py-6 text-muted-ink text-xs font-medium bg-surface/50 rounded border border-dashed border-line">
                    Belum ada lokasi usaha. Tambahkan lokasi cabang Anda di menu Lokasi Usaha.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-line mt-4">
              <Link
                href="/onboarding"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded bg-surface border border-line text-ink text-xs font-bold hover:bg-subtle hover:border-[#1a73e8] transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fbbc04]" />
                Buka Panduan Setup Bisnis
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
