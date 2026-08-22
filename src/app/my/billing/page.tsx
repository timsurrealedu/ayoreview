import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { checkCardSubscriptionStatus, GRACE_PERIOD_DAYS } from '@/lib/subscription';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyBillingPage() {
  const user = await requireUser();
  const cards = await dbRepo.setupSearchCardsByEmail(user.email);

  const activeCards = cards.filter((c) => c.subscription_status === 'active');
  const pastDueCards = cards.filter((c) => {
    const check = checkCardSubscriptionStatus(c as any);
    return check.inGracePeriod;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Langganan & Tagihan
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 mt-1">
          Kelola pembayaran bulanan kartu AyoReview dan status operasional ulasan bisnis Anda
        </p>
      </div>

      {/* Grace Period Alert Banner if any card is past due */}
      {pastDueCards.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            Pemberitahuan Masa Tenggang Pembayaran ({GRACE_PERIOD_DAYS} Hari)
          </div>
          <p className="text-xs leading-relaxed">
            Terdapat {pastDueCards.length} kartu dengan status pembayaran tertunda. Kartu Anda tetap aktif mengarahkan ulasan pelanggan selama masa tenggang 7 hari. Segera perbarui metode pembayaran agar pengalihan tidak terhenti.
          </p>
        </div>
      )}

      {/* Plan Summary Card */}
      <div className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a73e8] bg-[#1a73e8]/10 px-2.5 py-1 rounded-full border border-[#1a73e8]/30">
              Paket Standar AyoReview
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              Langganan Pengalihan Ulasan Otomatis
            </h2>
            <p className="text-xs text-zinc-300 mt-1">
              Rp 49.000 / kartu per bulan • Ditagih otomatis setiap bulan
            </p>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-2xl sm:text-3xl font-black text-white">
              Rp {(cards.length * 49000).toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-zinc-400">Total untuk {cards.length} kartu</div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
            Pengalihan NFC & QR tanpa batasan kuota
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
            Masa tenggang proteksi 7 hari saat pembayaran gagal
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
            Penyaringan bot cerdas dan analitik perangkat
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
            Bebas batal kapan saja tanpa denda
          </div>
        </div>
      </div>

      {/* Cards Billing Table */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Status Langganan Per Kartu
        </h2>

        <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-300 uppercase font-semibold text-[10px] bg-zinc-900">
                  <th className="py-3 px-5">Kode / Kartu</th>
                  <th className="py-3 px-4">Nama Bisnis</th>
                  <th className="py-3 px-4">Status Langganan</th>
                  <th className="py-3 px-4">ID Langganan</th>
                  <th className="py-3 px-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {cards.map((c) => {
                  const check = checkCardSubscriptionStatus(c as any);
                  return (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-[#fbbc04]">
                        {c.inventory_code}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {c.business_name || c.name}
                      </td>
                      <td className="py-3.5 px-4">
                        {check.inGracePeriod ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            Tenggang ({check.daysRemainingInGrace} hr)
                          </span>
                        ) : c.subscription_status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#34a853]/10 text-[#34a853] border border-[#34a853]/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {c.subscription_status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300 text-[11px]">
                        {c.subscription_id || 'Belum terhubung'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/s/${c.public_id}`}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium border border-zinc-700 transition"
                        >
                          Kelola / Bayar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
