'use client';

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DailyTrendPoint } from '@/lib/types';
import { BarChart3 } from 'lucide-react';

export function TrendChart({ data }: { data: DailyTrendPoint[] }) {
  const [filter, setFilter] = useState<'total' | 'qr' | 'nfc'>('total');

  const formattedData = data.map((d) => ({
    ...d,
    displayDate: d.date.slice(5), // MM-DD
  }));

  const totalInteractions = data.reduce((acc, curr) => acc + curr.total, 0);
  const isEmpty = totalInteractions === 0;

  return (
    <div className="bg-surface border border-line rounded p-5 sm:p-6 shadow-sm">
      {/* Chart Header & Integrated Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">
            Aktivitas Interaksi
          </h3>
          <p className="text-xs text-ink mt-0.5">
            Tren harian pengalihan ke ulasan Google (30 Hari Terakhir)
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center bg-surface p-1 rounded border border-line text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('total')}
            className={`px-3 py-1 rounded transition ${
              filter === 'total'
                ? 'bg-[#1a73e8] text-white shadow-sm'
                : 'text-muted-ink hover:text-ink'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setFilter('qr')}
            className={`px-3 py-1 rounded transition ${
              filter === 'qr'
                ? 'bg-[#34a853] text-ink shadow-sm'
                : 'text-muted-ink hover:text-ink'
            }`}
          >
            Scan QR
          </button>
          <button
            type="button"
            onClick={() => setFilter('nfc')}
            className={`px-3 py-1 rounded transition ${
              filter === 'nfc'
                ? 'bg-[#fbbc04] text-ink font-bold shadow-sm'
                : 'text-muted-ink hover:text-ink'
            }`}
          >
            Tap NFC
          </button>
        </div>
      </div>

      {/* Chart Canvas or Clean Empty State */}
      <div className="h-64 w-full relative flex items-center justify-center">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-surface/40 rounded border border-dashed border-line">
            <div className="w-12 h-12 rounded bg-subtle/80 border border-line flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-muted-ink" />
            </div>
            <h4 className="text-sm font-bold text-ink mb-1">
              Belum Ada Data Interaksi
            </h4>
            <p className="text-xs text-muted-ink max-w-sm">
              Data grafik akan otomatis muncul setelah pelanggan mulai memindai QR atau mengetuk kartu NFC di tempat usaha Anda.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="qrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34a853" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34a853" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="nfcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbc04" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fbbc04" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="displayDate"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                }}
                labelStyle={{ color: '#d4d4d8', fontWeight: 600 }}
              />
              {filter === 'total' && (
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Semua Interaksi"
                  stroke="#1a73e8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#totalGrad)"
                />
              )}
              {filter === 'qr' && (
                <Area
                  type="monotone"
                  dataKey="qr"
                  name="Scan QR"
                  stroke="#34a853"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#qrGrad)"
                />
              )}
              {filter === 'nfc' && (
                <Area
                  type="monotone"
                  dataKey="nfc"
                  name="Tap NFC"
                  stroke="#fbbc04"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#nfcGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
