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
        title="Paket & Tagihan"
        subtitle={`Langganan AyoReview dan batas kapasitas untuk ${org.name}`}
      />

      <main className="p-8 space-y-8 max-w-5xl w-full mx-auto">
        <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border border-[#1a73e8]/30 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a73e8] bg-[#1a73e8]/10 px-2.5 py-1 rounded-full border border-[#1a73e8]/30">
              Paket Komersial Aktif ({org.plan.toUpperCase()})
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-2">
              Paket AyoReview {org.plan.toUpperCase()}
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-md">
              Akses penuh ke pengalihan ulasan dinamis, pelacakan NFC / QR fisik, dan analitik interaksi waktu nyata.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-white">Rp 0</div>
            <div className="text-[11px] text-zinc-400">Status: {org.status.toUpperCase()}</div>
          </div>
        </div>

        {/* Tier Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121215] border border-[#1a73e8]/40 rounded-2xl p-6 shadow-md relative">
            <div className="text-xs font-bold text-[#1a73e8] uppercase tracking-wide mb-1">
              Paket Saat Ini
            </div>
            <h3 className="text-lg font-black text-white">Paket Percontohan</h3>
            <p className="text-xs text-zinc-300 mt-1 mb-4">
              Untuk validasi awal toko & operasional
            </p>
            <ul className="space-y-2 text-xs text-zinc-200 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34a853] shrink-0" /> 1 Organisasi Bisnis
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34a853] shrink-0" /> Hingga 5 Cabang Lokasi
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34a853] shrink-0" /> Hingga 25 Kartu Fisik
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34a853] shrink-0" /> Analitik Real-time & Kode QR
              </li>
            </ul>
          </div>

          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">
              Segera Hadir
            </div>
            <h3 className="text-lg font-black text-white">Pemula</h3>
            <p className="text-xs text-zinc-300 mt-1 mb-4">
              Untuk usaha dengan satu lokasi
            </p>
            <div className="text-xl font-bold text-white mb-4">
              Rp 49.000 <span className="text-xs font-normal text-zinc-400">/ bulan</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 1 Bisnis
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 2 Cabang Lokasi
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 10 Kartu Fisik
              </li>
            </ul>
          </div>

          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">
              Segera Hadir
            </div>
            <h3 className="text-lg font-black text-white">Bisnis Multi-Cabang</h3>
            <p className="text-xs text-zinc-300 mt-1 mb-4">
              Untuk jaringan resto & waralaba
            </p>
            <div className="text-xl font-bold text-white mb-4">
              Rp 149.000 <span className="text-xs font-normal text-zinc-400">/ bulan</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 5 Bisnis
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 10 Cabang Lokasi
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-500 shrink-0" /> 100 Kartu Fisik
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
