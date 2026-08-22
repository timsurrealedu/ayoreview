import { requireUser } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

export default async function MyDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <div className="min-h-screen bg-canvas text-ink md:flex"><DashboardSidebar shell="merchant" userName={user.name} userEmail={user.email} /><main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main></div>;
}
