'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { SourceSplitCard } from '@/components/dashboard/source-split';
import { 
  Download, 
  BarChart3, 
  MapPin, 
  CreditCard, 
  TrendingUp,
  Layers,
  Calendar
} from 'lucide-react';
import { AnalyticsOverview, DailyTrendPoint, CardWithStats, LocationWithStats } from '@/lib/types';

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    overview: AnalyticsOverview;
    trend: DailyTrendPoint[];
    topCards: CardWithStats[];
    placements: { placement: string; interactions: number; card_count: number }[];
    locations: LocationWithStats[];
  } | null>(null);

  const fetchAnalytics = async (range: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${range}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ['Date', 'Total_Visits', 'QR_Scans', 'NFC_Taps'];
    const rows = data.trend.map((t) => [t.date, t.total, t.qr, t.nfc]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reviewtap-analytics-${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Analytics & Interaction Insights"
        subtitle="Detailed breakdown of customer touchpoint engagement across stores"
        actions={
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        }
      />

      <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Timeframe Controls */}
        <div className="flex items-center justify-between bg-[#121215] border border-zinc-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Select Analytics Timeframe:</span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  days === d
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {data && (
          <>
            {/* Trend and Source Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendChart data={data.trend} />
              </div>
              <div>
                <SourceSplitCard
                  qrTotal={data.overview.qrTotal}
                  nfcTotal={data.overview.nfcTotal}
                  qrPercentage={data.overview.qrPercentage}
                  nfcPercentage={data.overview.nfcPercentage}
                />
              </div>
            </div>

            {/* Placement Breakdown & Locations Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Placements */}
              <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Interaction by Placement Zone
                </h3>
                <p className="text-xs text-zinc-400 mb-5">
                  Understand which physical spots in your venue drive the most Google review visits
                </p>

                <div className="space-y-3">
                  {data.placements.map((p) => {
                    const pct = Math.round(
                      (p.interactions / (data.overview.allTime || 1)) * 100
                    );
                    return (
                      <div
                        key={p.placement}
                        className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
                          <span className="capitalize">{p.placement}</span>
                          <span>
                            {p.interactions.toLocaleString()} visits{' '}
                            <span className="text-zinc-400 font-normal">({p.card_count} cards)</span>
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(pct, 100)}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Locations Performance */}
              <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Location Performance Ranking
                </h3>
                <p className="text-xs text-zinc-400 mb-5">
                  Review engagement ranked across multiple store branches
                </p>

                <div className="space-y-3">
                  {data.locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white tracking-tight">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {loc.city} · {loc.active_card_count} active cards
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">
                          {loc.total_interactions.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-zinc-400">Total Visits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
