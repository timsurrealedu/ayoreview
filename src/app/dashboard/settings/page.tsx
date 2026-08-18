import { dbRepo } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/header';
import { Store, User, Shield, Key, Bell, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const org = dbRepo.getOrganization();
  const user = dbRepo.getDemoUser();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Settings & Organization Profile"
        subtitle="Manage merchant credentials and platform preferences"
      />

      <main className="p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" /> Organization Profile
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Primary business identity for all locations and review cards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Organization Name</label>
              <input
                type="text"
                disabled
                value={org.name}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Subscription Plan</label>
              <input
                type="text"
                disabled
                value={`${org.plan.toUpperCase()} (${org.status})`}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-emerald-400 font-semibold uppercase font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Account Owner
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Primary contact for support, pilot reporting, and hardware deployment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Owner Name</label>
              <input
                type="text"
                disabled
                value={user?.name || 'Timothy Surreal'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'timothy@reviewtap.id'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">ReviewTap V1 Redirect Security:</span> Active domain whitelisting and bot filtering enabled on all NFC and QR endpoints.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
