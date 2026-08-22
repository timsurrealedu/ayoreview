import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';
import Link from 'next/link';
import { CreditCard, Building2, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  await requirePlatformAdmin();
  const stats = await dbRepo.getSystemOverview();

  return (
    <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">
          Ringkasan Sistem & Metrik Perangkat
        </h1>
        <p className="text-xs text-muted-ink mt-1">
          Kondisi inventaris platform dan interaksi pelanggan di seluruh bisnis percontohan
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded p-5 shadow-sm">
          <div className="text-muted-ink text-xs font-medium mb-1">Total Interaksi</div>
          <div className="text-3xl font-black text-success">
            {stats.totalInteractions.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Akumulasi peristiwa QR & NFC</div>
        </div>

        <div className="bg-surface border border-line rounded p-5 shadow-sm">
          <div className="text-muted-ink text-xs font-medium mb-1">Kunjungan Platform Hari Ini</div>
          <div className="text-3xl font-black text-ink">
            {stats.todayInteractions.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Di seluruh bisnis percontohan</div>
        </div>

        <div className="bg-surface border border-line rounded p-5 shadow-sm">
          <div className="text-muted-ink text-xs font-medium mb-1">Kartu Terpasang / Total</div>
          <div className="text-3xl font-black text-ink">
            {stats.activeCards} <span className="text-muted-ink text-lg font-normal">/ {stats.totalCards}</span>
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Aktif di lokasi dibanding belum ditetapkan</div>
        </div>

        <div className="bg-surface border border-line rounded p-5 shadow-sm">
          <div className="text-muted-ink text-xs font-medium mb-1">Bisnis & Lokasi</div>
          <div className="text-3xl font-black text-ink">
            {stats.totalBusinesses} <span className="text-muted-ink text-lg font-normal">({stats.totalLocations} locs)</span>
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Organisasi percontohan yang dikelola</div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-line rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-ink font-bold text-base mb-2">
              <CreditCard className="w-5 h-5 text-warning" />
              Physical Hardware Inventory
            </div>
            <p className="text-xs text-muted-ink leading-relaxed mb-6">
              Buat tag NFC kosong dan dudukan akrilik secara massal dengan kode inventaris (RT-000000) sebelum dipasang di bisnis.
            </p>
          </div>
          <Link
            href="/admin/cards"
            className="w-full text-center px-4 py-2.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition"
          >
            Kelola Inventaris Perangkat
          </Link>
        </div>

        <div className="bg-surface border border-line rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-ink font-bold text-base mb-2">
              <Building2 className="w-5 h-5 text-success" />
              Organisasi Bisnis
            </div>
            <p className="text-xs text-muted-ink leading-relaxed mb-6">
              Periksa akun bisnis, ubah status langganan, dan tetapkan batas lokasi perusahaan.
            </p>
          </div>
          <Link
            href="/admin/organizations"
            className="w-full text-center px-4 py-2.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition"
          >
            Lihat Organisasi
          </Link>
        </div>

        <div className="bg-surface border border-line rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-ink font-bold text-base mb-2">
              <Users className="w-5 h-5 text-action" />
              Pengguna Terdaftar
            </div>
            <p className="text-xs text-muted-ink leading-relaxed mb-6">
              Kelola autentikasi pengguna, status orientasi percontohan, dan izin anggota.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="w-full text-center px-4 py-2.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition"
          >
            Lihat Daftar Pengguna
          </Link>
        </div>
      </div>
    </main>
  );
}
