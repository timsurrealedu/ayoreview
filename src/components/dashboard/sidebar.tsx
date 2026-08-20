'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Receipt, 
  ShieldCheck, 
  Store,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Lokasi', href: '/dashboard/locations', icon: MapPin },
  { label: 'Kartu Ulasan', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Analitik', href: '/dashboard/analytics', icon: BarChart3 },
];

const bottomNavItems = [
  { label: 'Akun & Pengaturan', href: '/dashboard/settings', icon: Settings },
  { label: 'Paket & Tagihan', href: '/dashboard/billing', icon: Receipt },
];

const adminNavItem = { label: 'Admin Platform', href: '/admin', icon: ShieldCheck };

export function DashboardSidebar({ organizationName, isPlatformAdmin }: { organizationName?: string; isPlatformAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-[#0c0c0e] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[conic-gradient(from_25deg,#ea4335_0_25%,#fbbc04_0_50%,#34a853_0_75%,#1a73e8_0)] flex items-center justify-center text-white font-black text-sm ring-4 ring-white/30 ring-inset">
              R
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base block leading-none">
                ReviewTap
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-wide uppercase">
                Konsol Pengalihan
              </span>
            </div>
          </Link>
        </div>

        {/* Organization / Business Switcher Badge */}
        <div className="px-4 py-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {organizationName || 'Timothy Hospitality'}
              </div>
              <div className="text-[10px] text-zinc-400">Organisasi Percontohan</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-2">
            Ruang Kerja Bisnis
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-emerald-400' : 'text-zinc-400')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Nav & Admin Shortcut */}
      <div className="p-3 border-t border-zinc-800/80 space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-1">
          Sistem & Pengaturan
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              )}
            >
              <Icon className="w-4 h-4 text-zinc-400" />
              {item.label}
            </Link>
          );
        })}

        {/* Platform Admin — only visible to platform operators */}
        {isPlatformAdmin && (() => {
          const Icon = adminNavItem.icon;
          const isActive = pathname === adminNavItem.href;
          return (
            <Link
              key={adminNavItem.href}
              href={adminNavItem.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              )}
            >
              <Icon className="w-4 h-4 text-zinc-400" />
              {adminNavItem.label}
            </Link>
          );
        })()}

        <div className="pt-2 px-2 space-y-1.5">
          <Link
            href="/onboarding"
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:border-emerald-500/50 transition group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Panduan Pengaturan
            </span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/signout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-rose-400 hover:bg-zinc-900/50 transition cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
