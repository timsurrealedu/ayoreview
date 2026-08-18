import { dbRepo } from '@/lib/db';
import { Users, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const user = dbRepo.getDemoUser();

  return (
    <main className="p-8 space-y-6 max-w-6xl w-full mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Platform User Directory
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Account registrations and authentication credentials
        </p>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-900/60">
              <th className="py-3 px-5">User Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            <tr className="hover:bg-zinc-800/20 transition">
              <td className="py-4 px-5 font-bold text-white text-sm">
                {user?.name || 'Timothy Surreal'}
              </td>
              <td className="py-4 px-4 text-zinc-300 font-mono">
                {user?.email || 'timothy@reviewtap.id'}
              </td>
              <td className="py-4 px-4 font-mono text-zinc-400">
                {user?.id || 'usr_demo_01'}
              </td>
              <td className="py-4 px-4 text-zinc-400">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026-08-18'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
