import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { Logo } from '@/components/ui/logo';

export default async function MyLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <header className="border-b border-line bg-surface">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} className="rounded" />
            <span className="font-bold text-ink tracking-tight text-sm">AyoReview</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-ink font-medium hidden sm:block">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-xs font-semibold text-error hover:bg-error-soft rounded px-2.5 py-1.5 transition">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
