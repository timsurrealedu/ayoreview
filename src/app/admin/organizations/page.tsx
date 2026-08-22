import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';
import { StatusBadge } from '@/components/ui/status-badge';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationsPage() {
  await requirePlatformAdmin();
  const orgs = await dbRepo.getAllOrganizations();

  return (
    <main className="p-8 space-y-6 max-w-6xl w-full mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">
          Organisasi & Langganan Percontohan
        </h1>
        <p className="text-muted-ink mt-0.5">
          Kelola akun bisnis dan paket komersial percontohan
        </p>
      </div>

      <div className="bg-surface border border-line rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-semibold text-[10px] bg-surface/60">
              <th className="py-3 px-5">Nama Organisasi</th>
              <th className="py-3 px-4">Paket</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-subtle/20 transition">
                <td className="py-4 px-5 font-bold text-ink text-sm">
                  {org.name}
                </td>
                <td className="py-4 px-4 font-mono uppercase font-semibold text-success">
                  {org.plan}
                </td>
                <td className="py-4 px-4">
                  <StatusBadge tone={org.status === 'active' ? 'success' : 'neutral'}>{org.status}</StatusBadge>
                </td>
                <td className="py-4 px-4 text-muted-ink">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orgs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-ink text-xs">
                  Belum ada organisasi terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
