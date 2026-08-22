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

  const placementMap: Record<string, string> = {
    cashier: 'Kasir / POS',
    table: 'Meja Pelanggan',
    entrance: 'Pintu Masuk Utama',
    counter: 'Konter Barista',
    waiting_area: 'Ruang Tunggu',
    receipt: 'Penjepit Struk',
    custom: 'Titik Khusus',
  };

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
    const headers = ['Tanggal', 'Total_Kunjungan', 'Pindaian_QR', 'Ketukan_NFC'];
    const rows = data.trend.map((t) => [t.date, t.total, t.qr, t.nfc]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ayoreview-analytics-${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Analitik & Wawasan Interaksi"
        subtitle="Rincian interaksi ulasan Google di seluruh cabang usaha Anda"
        actions={
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor CSV
          </button>
        }
      />

      <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Timeframe Controls */}
        <div className="flex items-center justify-between bg-[#121215] border border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-zinc-200 font-medium">
            <Calendar className="w-4 h-4 text-[#1a73e8]" />
            <span>Pilih Rentang Waktu Analitik:</span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  days === d
                    ? 'bg-[#1a73e8] text-white shadow'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {d} Hari
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
              <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1a73e8]" />
                  Interaksi berdasarkan Area Penempatan
                </h3>
                <p className="text-xs text-zinc-300 mb-5">
                  Ketahui titik fisik yang menghasilkan ulasan Google terbanyak
                </p>

                <div className="space-y-3">
                  {data.placements.map((p) => {
                    const pct = Math.round(
                      (p.interactions / (data.overview.allTime || 1)) * 100
                    );
                    return (
                      <div
                        key={p.placement}
                        className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
                          <span>{placementMap[p.placement] || p.placement}</span>
                          <span>
                            {p.interactions.toLocaleString('id-ID')} kunjungan{' '}
                            <span className="text-zinc-400 font-normal">({p.card_count} kartu)</span>
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(pct, 100)}%` }}
                            className="bg-[#1a73e8] h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Locations Performance */}
              <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#34a853]" />
                  Peringkat Performa Lokasi
                </h3>
                <p className="text-xs text-zinc-300 mb-5">
                  Peringkat interaksi ulasan di berbagai cabang usaha Anda
                </p>

                <div className="space-y-3">
                  {data.locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white tracking-tight">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-zinc-300">
                          {loc.city} · {loc.active_card_count} kartu aktif
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#34a853]">
                          {loc.total_interactions.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-zinc-400">Total Kunjungan</div>
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
