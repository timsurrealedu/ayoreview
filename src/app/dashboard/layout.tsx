import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { dbRepo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = dbRepo.getOrganization();

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <DashboardSidebar organizationName={org?.name} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
