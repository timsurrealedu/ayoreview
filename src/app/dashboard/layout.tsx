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
    <div className="flex min-h-screen bg-[#09090b]">
      <DashboardSidebar organizationName={org?.name || 'My Organization'} isPlatformAdmin={user.is_platform_admin} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
