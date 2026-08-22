import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { CreditCard, Receipt, LogOut, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-[#121215] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-6">
          <Link href="/my" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#1a73e8]/30">
              AR
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block">AyoReview</span>
              <span className="text-[10px] text-zinc-400 font-medium">Portal Pemilik Usaha</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs">
            <Link
              href="/my"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition"
            >
              <CreditCard className="w-4 h-4 text-[#1a73e8]" />
              Kartu Saya
            </Link>
            <Link
              href="/my/billing"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition"
            >
              <Receipt className="w-4 h-4 text-[#1a73e8]" />
              Langganan & Tagihan
            </Link>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div className="px-2">
            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-[#121215]">
          <Link href="/my" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white font-black text-xs">
              AR
            </div>
            <span className="font-bold text-white text-sm">AyoReview</span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/my" className="text-zinc-300 hover:text-white">Kartu</Link>
            <Link href="/my/billing" className="text-zinc-300 hover:text-white">Langganan</Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-rose-400">Keluar</button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
