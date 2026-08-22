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
        <div className="flex flex-col items-start justify-between gap-4 rounded border border-line bg-surface p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <span className="rounded border border-action/25 bg-action-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-action">
              Paket Komersial Aktif ({org.plan.toUpperCase()})
            </span>
            <h2 className="text-xl font-bold text-ink tracking-tight mt-2">
              Paket AyoReview {org.plan.toUpperCase()}
            </h2>
            <p className="text-xs text-ink mt-1 max-w-md">
              Akses penuh ke pengalihan ulasan dinamis, pelacakan NFC / QR fisik, dan analitik interaksi waktu nyata.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-ink">Rp 0</div>
            <div className="text-[11px] text-muted-ink">Status: {org.status.toUpperCase()}</div>
          </div>
        </div>

        {/* Tier Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-[#1a73e8]/40 rounded p-6 shadow-md relative">
            <div className="text-xs font-bold text-[#1a73e8] uppercase tracking-wide mb-1">
              Paket Saat Ini
            </div>
            <h3 className="text-lg font-black text-ink">Paket Percontohan</h3>
            <p className="text-xs text-ink mt-1 mb-4">
              Untuk validasi awal toko & operasional
            </p>
            <ul className="space-y-2 text-xs text-ink mb-6">
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

          <div className="bg-surface border border-line rounded p-6 shadow-sm">
            <div className="text-xs font-bold text-muted-ink uppercase tracking-wide mb-1">
              Segera Hadir
            </div>
            <h3 className="text-lg font-black text-ink">Pemula</h3>
            <p className="text-xs text-ink mt-1 mb-4">
              Untuk usaha dengan satu lokasi
            </p>
            <div className="text-xl font-bold text-ink mb-4">
              Rp 49.000 <span className="text-xs font-normal text-muted-ink">/ bulan</span>
            </div>
            <ul className="space-y-2 text-xs text-ink">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 1 Bisnis
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 2 Cabang Lokasi
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 10 Kartu Fisik
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-line rounded p-6 shadow-sm">
            <div className="text-xs font-bold text-muted-ink uppercase tracking-wide mb-1">
              Segera Hadir
            </div>
            <h3 className="text-lg font-black text-ink">Bisnis Multi-Cabang</h3>
            <p className="text-xs text-ink mt-1 mb-4">
              Untuk jaringan resto & waralaba
            </p>
            <div className="text-xl font-bold text-ink mb-4">
              Rp 149.000 <span className="text-xs font-normal text-muted-ink">/ bulan</span>
            </div>
            <ul className="space-y-2 text-xs text-ink">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 5 Bisnis
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 10 Cabang Lokasi
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-muted-ink shrink-0" /> 100 Kartu Fisik
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
