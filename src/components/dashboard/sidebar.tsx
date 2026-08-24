'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, LayoutDashboard, LogOut, Menu, Package, ShieldCheck, Store, Users, X } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '@/components/ui/logo';

type Shell = 'merchant' | 'admin';
const navigation = {
  merchant: [{ label: 'Kartu Saya', href: '/my', icon: CreditCard }],
  admin: [{ label: 'Ringkasan', href: '/admin', icon: LayoutDashboard }, { label: 'Pesanan Masuk', href: '/admin/orders', icon: Package }, { label: 'Inventaris & Kartu Fisik', href: '/admin/cards', icon: CreditCard }, { label: 'Organisasi', href: '/admin/organizations', icon: Store }, { label: 'Pengguna', href: '/admin/users', icon: Users }],
} satisfies Record<Shell, Array<{ label: string; href: string; icon: typeof LayoutDashboard }>>;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({ isPlatformAdmin, shell = 'merchant', userName, userEmail }: { isPlatformAdmin?: boolean; shell?: Shell; userName?: string | null; userEmail?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', closeOnEscape); triggerRef.current?.focus(); };
  }, [open]);

  const admin = shell === 'admin';
  const title = admin ? 'Operator AyoReview' : 'AyoReview';
  const subtitle = admin ? 'Portal Admin Platform' : 'Portal Pemilik Usaha';
  const home = admin ? '/admin' : '/my';
  const panel = (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex min-h-16 items-center justify-between border-b border-line px-5">
        <Link href={home} className="flex min-h-11 items-center gap-2.5"><Logo size={32} className="shrink-0" /><span><span className="block text-sm font-bold leading-none text-ink">{title}</span><span className="mt-1 block font-mono text-[10px] font-medium text-muted-ink">{subtitle}</span></span></Link>
        <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded text-ink md:hidden" aria-label="Tutup navigasi"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav aria-label={subtitle} className="space-y-1">
          {navigation[shell].map(({ label, href, icon: Icon }) => { const active = isCurrent(pathname, href); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={clsx('flex min-h-11 items-center gap-3 rounded px-3 text-xs font-semibold transition-colors', active ? 'bg-action-soft text-action' : 'text-ink hover:bg-subtle')}><Icon className="h-4 w-4 shrink-0" /><span>{label}</span></Link>; })}
          {!admin && isPlatformAdmin && <Link href="/admin" className="flex min-h-11 items-center gap-3 rounded px-3 text-xs font-semibold text-warning hover:bg-warning-soft"><ShieldCheck className="h-4 w-4" />Admin Platform</Link>}
        </nav>
      </div>
      <div className="space-y-2 border-t border-line p-3">
        {(userName || userEmail) && <div className="px-3 py-1"><div className="truncate text-xs font-semibold text-ink">{userName}</div><div className="truncate text-[11px] text-muted-ink">{userEmail}</div></div>}
        <form action="/api/auth/signout" method="POST"><button type="submit" className="flex min-h-11 w-full items-center gap-2 rounded px-3 text-xs font-semibold text-error hover:bg-error-soft"><LogOut className="h-4 w-4" />Keluar</button></form>
      </div>
    </div>
  );
  return <><a href="#main-content" className="fixed left-3 top-3 z-[70] -translate-y-20 rounded bg-action px-4 py-3 text-sm font-bold text-white focus:translate-y-0">Lewati ke konten utama</a><header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-line bg-surface px-4 md:hidden"><Link href={home} className="flex min-h-11 items-center gap-2"><Logo size={32} className="shrink-0" /><span className="text-sm font-bold text-ink">{title}</span></Link><button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-label="Buka navigasi" aria-expanded={open} aria-controls={`${shell}-navigation`} className="flex h-11 w-11 items-center justify-center rounded border border-line text-ink"><Menu className="h-5 w-5" /></button></header><aside className="hidden min-h-screen w-64 shrink-0 border-r border-line md:block">{panel}</aside>{open && <div className="fixed inset-0 z-50 md:hidden"><button type="button" className="absolute inset-0 bg-ink/35" onClick={() => setOpen(false)} aria-label="Tutup navigasi" /><aside id={`${shell}-navigation`} role="dialog" aria-modal="true" aria-label={subtitle} className="relative h-full w-[min(20rem,88vw)] shadow-2xl">{panel}</aside></div>}</>;
}
