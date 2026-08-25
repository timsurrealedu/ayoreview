import { requirePlatformAdmin } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformAdmin();
  return <div className="admin-shell min-h-screen bg-canvas text-ink md:flex"><DashboardSidebar shell="admin" /><main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main></div>;
}
