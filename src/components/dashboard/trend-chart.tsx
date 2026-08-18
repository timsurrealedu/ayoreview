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

export function TrendChart({ data }: { data: DailyTrendPoint[] }) {
  const [filter, setFilter] = useState<'total' | 'qr' | 'nfc'>('total');

  const formattedData = data.map((d) => ({
    ...d,
    displayDate: d.date.slice(5), // MM-DD
  }));

  return (
    <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            Review Page Visits Trend
            <span className="text-[11px] font-normal text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/50">
              30 Days
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Daily Google review destination redirects across all physical cards
          </p>
        </div>

        {/* Source Filter Switcher */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setFilter('total')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'total'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Visits
          </button>
          <button
            onClick={() => setFilter('qr')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'qr'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            QR Scans
          </button>
          <button
            onClick={() => setFilter('nfc')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'nfc'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            NFC Taps
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="qrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="nfcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              labelStyle={{ color: '#a1a1aa', fontWeight: 600 }}
            />
            {filter === 'total' && (
              <Area
                type="monotone"
                dataKey="total"
                name="Total Visits"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalGrad)"
              />
            )}
            {filter === 'qr' && (
              <Area
                type="monotone"
                dataKey="qr"
                name="QR Scans"
                stroke="#34d399"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#qrGrad)"
              />
            )}
            {filter === 'nfc' && (
              <Area
                type="monotone"
                dataKey="nfc"
                name="NFC Taps"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#nfcGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
