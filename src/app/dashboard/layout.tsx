import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { requireOrgMembership } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { org, user } = await requireOrgMembership();

  return (
    <div className="min-h-screen bg-canvas text-ink md:flex">
      <DashboardSidebar organizationName={org?.name || 'Organisasi Saya'} isPlatformAdmin={user.is_platform_admin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
      </div>
    </div>
  );
}
