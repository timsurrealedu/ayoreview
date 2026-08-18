'use client';

import Link from 'next/link';
import { CardWithStats } from '@/lib/types';
import { ArrowUpRight, Smartphone, QrCode } from 'lucide-react';

export function TopCardsTable({ cards }: { cards: CardWithStats[] }) {
  return (
    <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Top Performing Review Cards
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cards driving the highest Google review destination visits (Last 30 Days)
          </p>
        </div>
        <Link
          href="/dashboard/cards"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
        >
          View All Cards <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="pb-3 pt-2">Card & Placement</th>
              <th className="pb-3 pt-2">Location</th>
              <th className="pb-3 pt-2 text-right">30D Visits</th>
              <th className="pb-3 pt-2 text-right">QR / NFC</th>
              <th className="pb-3 pt-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {cards.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                <td className="py-3.5 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 capitalize border border-zinc-700/50">
                      {c.placement}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    {c.inventory_code} · {c.public_id}
                  </div>
                </td>
                <td className="py-3.5 text-zinc-400">
                  {c.location_name || 'Unassigned'}
                </td>
                <td className="py-3.5 text-right font-bold text-white text-sm">
                  {c.stats.last30Days.toLocaleString()}
                </td>
                <td className="py-3.5 text-right text-zinc-400">
                  <span className="text-emerald-400 font-medium">{c.stats.qr}</span> /{' '}
                  <span className="text-sky-400 font-medium">{c.stats.nfc}</span>
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/dashboard/cards/${c.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700 transition"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-400">
                  No active cards found. Create your first card in Setup Wizard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
