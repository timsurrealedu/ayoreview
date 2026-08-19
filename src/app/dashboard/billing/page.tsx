import { dbRepo } from '@/lib/db';
import { requireOrgMembership } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard/header';
import { Receipt, Check, ShieldCheck, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const { org } = await requireOrgMembership();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Plan & Billing"
        subtitle={`ReviewTap subscription and capacity limits for ${org.name}`}
      />

      <main className="p-8 space-y-8 max-w-5xl w-full mx-auto">
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Active Commercial Plan ({org.plan.toUpperCase()})
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-2">
              ReviewTap {org.plan.toUpperCase()} Tier
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Full access to dynamic review redirection, physical NFC / QR tracking, and real-time interaction analytics.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-white">Rp 0</div>
            <div className="text-[11px] text-zinc-400">Status: {org.status.toUpperCase()}</div>
          </div>
        </div>

        {/* Tier Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121215] border border-emerald-500/40 rounded-2xl p-6 shadow-md relative">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-1">
              Current Plan
            </div>
            <h3 className="text-lg font-black text-white">Pilot Tier</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              For initial store validation
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Business Organization
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Locations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 25 Physical Cards
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time Analytics & QR
              </li>
            </ul>
          </div>

          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">
              Upcoming
            </div>
            <h3 className="text-lg font-black text-white">Starter</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              For single-location venues
            </p>
            <div className="text-xl font-bold text-white mb-4">
              Rp 49.000 <span className="text-xs font-normal text-zinc-400">/ mo</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 1 Business
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 2 Locations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 10 Physical Cards
              </li>
            </ul>
          </div>

          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">
              Upcoming
            </div>
            <h3 className="text-lg font-black text-white">Business Multi-Store</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              For chains & franchises
            </p>
            <div className="text-xl font-bold text-white mb-4">
              Rp 149.000 <span className="text-xs font-normal text-zinc-400">/ mo</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 5 Businesses
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 10 Locations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 100 Physical Cards
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
