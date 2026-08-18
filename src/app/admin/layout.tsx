import Link from 'next/link';
import { 
  ShieldCheck, 
  Layers, 
  CreditCard, 
  Building2, 
  Users, 
  ArrowLeft,
  Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="h-16 border-b border-zinc-800 bg-[#0c0c0e] px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xs">
              RT
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">ReviewTap Operator</span>
              <span className="text-[10px] text-amber-400 block font-mono">Platform Admin Portal</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 text-xs">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Overview
            </Link>
            <Link
              href="/admin/cards"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Physical Inventory & Cards
            </Link>
            <Link
              href="/admin/organizations"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Organizations
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Users
            </Link>
          </nav>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Merchant Dashboard
        </Link>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
