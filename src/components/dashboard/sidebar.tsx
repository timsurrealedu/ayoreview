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
  ExternalLink,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Lokasi Usaha', href: '/dashboard/locations', icon: MapPin },
  { label: 'Kartu Ulasan', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Analitik', href: '/dashboard/analytics', icon: BarChart3 },
];

const bottomNavItems = [
  { label: 'Akun & Pengaturan', href: '/dashboard/settings', icon: Settings },
  { label: 'Paket & Tagihan', href: '/dashboard/billing', icon: Receipt },
];

const adminNavItem = { label: 'Admin Platform', href: '/admin', icon: ShieldCheck };

export function DashboardSidebar({ 
  organizationName, 
  isPlatformAdmin 
}: { 
  organizationName?: string; 
  isPlatformAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#1a73e8]/30">
              A
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block leading-none">
                AyoReview
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wide uppercase">
                Konsol Bisnis
              </span>
            </div>
          </Link>
        </div>

        {/* Business Selector / Info Badge */}
        <div className="px-3 py-3">
          <div className="px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center gap-2.5">
            <Store className="w-4 h-4 text-[#1a73e8] shrink-0" />
            <div className="truncate flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {organizationName || 'Bisnis Anda'}
              </div>
              <div className="text-[10px] text-zinc-400">Akun Terdaftar</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2.5 mb-1.5">
            Menu Utama
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    isActive
                      ? 'bg-zinc-800/90 text-white font-semibold border-l-2 border-[#1a73e8] shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-850'
                  )}
                >
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-[#1a73e8]' : 'text-zinc-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Nav & Admin Shortcut */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2.5 mb-1">
          Sistem & Tagihan
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'bg-zinc-850 text-white font-semibold border-l-2 border-[#1a73e8]'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-850/60'
              )}
            >
              <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{item.label}</span>
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
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'bg-zinc-850 text-white font-semibold border-l-2 border-[#fbbc04]'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-850/60'
              )}
            >
              <Icon className="w-4 h-4 text-[#fbbc04] shrink-0" />
              <span>{adminNavItem.label}</span>
            </Link>
          );
        })()}

        <div className="pt-2 px-1 space-y-1">
          <Link
            href="/onboarding"
            className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs font-medium hover:border-[#1a73e8] hover:text-white transition group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbc04]" /> Panduan Setup
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition" />
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/signout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-900/60 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
