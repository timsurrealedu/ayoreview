import { requireOrgMembership } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard/header';
import { Store, User, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { user, org, role } = await requireOrgMembership();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Pengaturan & Profil Organisasi"
        subtitle="Kelola kredensial bisnis dan preferensi platform"
      />

      <main className="p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" /> Organization Profile
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identitas utama bisnis untuk semua lokasi dan kartu ulasan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Nama Organisasi</label>
              <input
                type="text"
                disabled
                value={org.name}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Paket Langganan</label>
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
              <User className="w-4 h-4 text-emerald-400" /> Account & Role
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sesi terautentikasi dan izin saat ini
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Nama Pengguna</label>
              <input
                type="text"
                disabled
                value={user.name}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Alamat Email</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Peran Organisasi</label>
              <input
                type="text"
                disabled
                value={role.toUpperCase()}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Keamanan ReviewTap V1.1:</span> Penyimpanan Supabase PostgreSQL dengan Keamanan Tingkat Baris, isolasi organisasi, dan validasi URL Google yang ketat.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
