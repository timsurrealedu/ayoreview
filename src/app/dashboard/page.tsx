import { dbRepo } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/header';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { SourceSplitCard } from '@/components/dashboard/source-split';
import { TopCardsTable } from '@/components/dashboard/top-cards-table';
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
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const org = dbRepo.getOrganization();
  const overview = dbRepo.getAnalyticsOverview(org.id);
  const trend = dbRepo.getDailyTrend(org.id, 30);
  const topCards = dbRepo.getTopCards(org.id, 5);
  const locations = dbRepo.getLocationsWithStats(org.id);
  const businesses = dbRepo.getBusinesses(org.id);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Dashboard Overview"
        subtitle={`Real-time engagement metrics for ${org.name}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/cards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Manage Cards
            </Link>
            <Link
              href="/dashboard/locations"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Location
            </Link>
          </div>
        }
      />

      <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
              <span>Today&apos;s Review Visits</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" /> +{overview.todayGrowthPct}%
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {overview.today.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Google review destinations reached today
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-2">
              Last 7 Days
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {overview.last7Days.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Weekly customer interactions
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-2">
              Last 30 Days
            </div>
            <div className="text-3xl font-black text-white tracking-tight text-emerald-400">
              {overview.last30Days.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Monthly Review Page Visits (North Star)
            </div>
          </div>

          {/* All Time */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-2">
              All-Time Total
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {overview.allTime.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Cumulative hardware engagements
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
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Locations Performance
                </h3>
                <Link
                  href="/dashboard/locations"
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Manage
                </Link>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Active review destinations across your stores
              </p>

              <div className="space-y-3">
                {locations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/dashboard/locations/${loc.id}`}
                    className="block p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {loc.name}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {loc.total_interactions} visits
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{loc.city}</span>
                      <span>{loc.active_card_count} active cards</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 mt-4">
              <Link
                href="/onboarding"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Launch 3-Minute Onboarding Wizard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
