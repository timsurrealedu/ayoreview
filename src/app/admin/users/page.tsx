import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requirePlatformAdmin();
  const users = await dbRepo.getAllUsers();

  return (
    <main className="p-8 space-y-6 max-w-6xl w-full mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Direktori Pengguna Platform
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Account registrations and authentication credentials
        </p>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-900/60">
              <th className="py-3 px-5">Nama Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/20 transition">
                <td className="py-4 px-5 font-bold text-white text-sm">
                  {u.name}
                </td>
                <td className="py-4 px-4 text-zinc-300 font-mono">
                  {u.email}
                </td>
                <td className="py-4 px-4 font-mono text-zinc-400">
                  {u.is_platform_admin ? (
                    <span className="text-amber-400 font-bold">Admin Platform</span>
                  ) : (
                    <span>Pengguna Bisnis</span>
                  )}
                </td>
                <td className="py-4 px-4 text-zinc-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-500 text-xs">
                  Pengguna tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
