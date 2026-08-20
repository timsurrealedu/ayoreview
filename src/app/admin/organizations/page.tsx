import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationsPage() {
  await requirePlatformAdmin();
  const orgs = await dbRepo.getAllOrganizations();

  return (
    <main className="p-8 space-y-6 max-w-6xl w-full mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Organisasi & Langganan Percontohan
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Kelola akun bisnis dan paket komersial percontohan
        </p>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-900/60">
              <th className="py-3 px-5">Nama Organisasi</th>
              <th className="py-3 px-4">Paket</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-zinc-800/20 transition">
                <td className="py-4 px-5 font-bold text-white text-sm">
                  {org.name}
                </td>
                <td className="py-4 px-4 font-mono uppercase font-semibold text-emerald-400">
                  {org.plan}
                </td>
                <td className="py-4 px-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {org.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-zinc-400">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orgs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-500 text-xs">
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
