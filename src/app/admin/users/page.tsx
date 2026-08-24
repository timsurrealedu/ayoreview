import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requirePlatformAdmin();
  const users = await dbRepo.getAllUsers();

  return (
    <main className="p-8 space-y-6 max-w-6xl w-full mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">
          Direktori Pengguna Platform
        </h1>
        <p className="text-muted-ink mt-0.5">
          Registrasi akun dan kredensial autentikasi pengguna platform
        </p>
      </div>

      <div className="bg-surface border border-line rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-semibold text-[10px] bg-surface/60">
              <th className="py-3 px-5">Nama Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-subtle/20 transition">
                <td className="py-4 px-5 font-bold text-ink text-sm">
                  {u.name}
                </td>
                <td className="py-4 px-4 text-ink font-mono">
                  {u.email}
                </td>
                <td className="py-4 px-4 font-mono text-muted-ink">
                  {u.is_platform_admin ? (
                    <span className="font-bold text-warning">Admin Platform</span>
                  ) : (
                    <span>Pengguna Bisnis</span>
                  )}
                </td>
                <td className="py-4 px-4 text-muted-ink">
                  {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-ink text-xs">
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
