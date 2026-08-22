import Link from 'next/link';
import { requirePlatformAdmin } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePlatformAdmin();

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="h-16 border-b border-zinc-800 bg-[#0c0c0e] px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[conic-gradient(from_25deg,#ea4335_0_25%,#fbbc04_0_50%,#34a853_0_75%,#1a73e8_0)] flex items-center justify-center text-white font-black text-xs ring-4 ring-white/30 ring-inset">
              A
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">Operator AyoReview</span>
              <span className="text-[10px] text-[#fbbc04] block font-mono font-semibold">Portal Admin Platform</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 text-xs">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Ringkasan
            </Link>
            <Link
              href="/admin/cards"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Inventaris & Kartu Fisik
            </Link>
            <Link
              href="/admin/organizations"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Organisasi
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Pengguna
            </Link>
          </nav>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dasbor Bisnis
        </Link>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
