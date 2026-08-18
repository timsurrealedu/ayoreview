import { dbRepo } from '@/lib/db';
import Link from 'next/link';
import { 
  Building2, 
  CreditCard, 
  MapPin, 
  Activity, 
  Layers, 
  Users, 
  CheckCircle,
  TrendingUp,
  Plus
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const stats = dbRepo.getSystemOverview();

  return (
    <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          System Overview & Hardware Metrics
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          ReviewTap platform inventory and customer interaction health across all pilot merchants
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium mb-1">Total Interactions</div>
          <div className="text-3xl font-black text-emerald-400">
            {stats.totalInteractions.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Cumulative QR & NFC events</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium mb-1">Today&apos;s Platform Visits</div>
          <div className="text-3xl font-black text-white">
            {stats.todayInteractions.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Across all pilot merchants</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium mb-1">Cards Deployed / Total</div>
          <div className="text-3xl font-black text-white">
            {stats.activeCards} <span className="text-zinc-400 text-lg font-normal">/ {stats.totalCards}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Active in venues vs unassigned</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium mb-1">Businesses & Locations</div>
          <div className="text-3xl font-black text-white">
            {stats.totalBusinesses} <span className="text-zinc-400 text-lg font-normal">({stats.totalLocations} locs)</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Managed pilot organizations</div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Physical Hardware Inventory
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Batch generate blank NFC tags and acrylic stands with inventory codes (RT-000000) for pre-printing before merchant deployment.
            </p>
          </div>
          <Link
            href="/admin/cards"
            className="w-full text-center px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition"
          >
            Manage Hardware Inventory
          </Link>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Merchant Organizations
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Inspect merchant accounts, modify subscription statuses, and assign enterprise location limits.
            </p>
          </div>
          <Link
            href="/admin/organizations"
            className="w-full text-center px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition"
          >
            View Organizations
          </Link>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <Users className="w-5 h-5 text-sky-400" />
              Registered Users
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Manage user authentication records, pilot onboarding status, and member permissions.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="w-full text-center px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition"
          >
            View Users List
          </Link>
        </div>
      </div>
    </main>
  );
}
