'use client';

import Link from 'next/link';
import { CardWithStats } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

export function TopCardsTable({ cards }: { cards: CardWithStats[] }) {
  return (
    <div className="bg-surface border border-line rounded p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">
            Performa Kartu Ulasan
          </h3>
          <p className="text-xs text-ink mt-0.5">
            Kartu fisik dengan interaksi tertinggi dalam 30 hari terakhir
          </p>
        </div>
        <Link
          href="/dashboard/cards"
          className="text-xs text-[#1a73e8] hover:text-[#4285f4] font-semibold flex items-center gap-1 hover:underline"
        >
          Lihat Semua Kartu <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-bold text-[10px]">
              <th className="pb-3 pt-2">Kartu & Penempatan</th>
              <th className="pb-3 pt-2">Lokasi Usaha</th>
              <th className="pb-3 pt-2 text-right">Interaksi (30 Hari)</th>
              <th className="pb-3 pt-2 text-right">Scan / Tap</th>
              <th className="pb-3 pt-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {cards.map((c) => (
              <tr key={c.id} className="hover:bg-subtle/50 transition">
                <td className="py-3.5 font-medium text-ink">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-subtle text-ink capitalize border border-line font-semibold">
                      {c.placement}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-ink mt-0.5">
                    {c.inventory_code} · {c.public_id}
                  </div>
                </td>
                <td className="py-3.5 text-ink">
                  {c.location_name || 'Belum ditetapkan'}
                </td>
                <td className="py-3.5 text-right font-black text-ink text-sm">
                  {c.stats.last30Days.toLocaleString()}
                </td>
                <td className="py-3.5 text-right text-ink font-medium">
                  <span className="text-[#34a853] font-bold">{c.stats.qr}</span> /{' '}
                  <span className="text-[#1a73e8] font-bold">{c.stats.nfc}</span>
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/dashboard/cards/${c.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-ink font-medium">
                  Belum ada kartu ulasan aktif. Tambahkan kartu pertama Anda untuk mulai mengumpulkan ulasan Google.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
