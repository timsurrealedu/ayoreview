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
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Locations', href: '/dashboard/locations', icon: MapPin },
  { label: 'Review Cards', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const bottomNavItems = [
  { label: 'Account & Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Plan & Billing', href: '/dashboard/billing', icon: Receipt },
  { label: 'Platform Admin', href: '/admin', icon: ShieldCheck },
];

export function DashboardSidebar({ organizationName }: { organizationName?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-[#0c0c0e] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-zinc-950 font-black text-sm">
              RT
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base block leading-none">
                ReviewTap
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-wide uppercase">
                Hardware SaaS V1
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
              <div className="text-[10px] text-zinc-400">Pilot Organization</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-2">
            Merchant Workspace
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
          System & Settings
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

        <div className="pt-2 px-2">
          <Link
            href="/onboarding"
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:border-emerald-500/50 transition group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Setup Wizard
            </span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
