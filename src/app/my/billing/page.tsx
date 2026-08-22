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
import { StatusBadge } from '@/components/ui/status-badge';

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
        <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          Langganan & Tagihan
        </h1>
        <p className="text-xs sm:text-sm text-ink mt-1">
          Kelola pembayaran bulanan kartu AyoReview dan status operasional ulasan bisnis Anda
        </p>
      </div>

      {/* Grace Period Alert Banner if any card is past due */}
      {pastDueCards.length > 0 && (
        <div role="status" className="space-y-2 rounded border border-warning/25 bg-warning-soft p-4 text-warning">
          <div className="flex items-center gap-2 text-sm font-bold">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Pemberitahuan Masa Tenggang Pembayaran ({GRACE_PERIOD_DAYS} Hari)
          </div>
          <p className="text-xs leading-relaxed">
            Terdapat {pastDueCards.length} kartu dengan status pembayaran tertunda. Kartu Anda tetap aktif mengarahkan ulasan pelanggan selama masa tenggang 7 hari. Segera perbarui metode pembayaran agar pengalihan tidak terhenti.
          </p>
        </div>
      )}

      {/* Plan Summary Card */}
      <div className="bg-surface border border-line p-6 sm:p-8 rounded shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="rounded border border-action/25 bg-action-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-action">
              Paket Standar AyoReview
            </span>
            <h2 className="text-xl font-bold text-ink mt-2">
              Langganan Pengalihan Ulasan Otomatis
            </h2>
            <p className="text-xs text-ink mt-1">
              Rp 49.000 / kartu per bulan • Ditagih otomatis setiap bulan
            </p>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-2xl sm:text-3xl font-black text-ink">
              Rp {(cards.length * 49000).toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-muted-ink">Total untuk {cards.length} kartu</div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink">
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
        <h2 className="text-xs font-bold text-ink uppercase tracking-wider">
          Status Langganan Per Kartu
        </h2>

        <div className="bg-surface border border-line rounded overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink uppercase font-semibold text-[10px] bg-surface">
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
                    <tr key={c.id} className="hover:bg-subtle/40 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-[#fbbc04]">
                        {c.inventory_code}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ink">
                        {c.business_name || c.name}
                      </td>
                      <td className="py-3.5 px-4">
                        {check.inGracePeriod ? (
                          <StatusBadge tone="warning">Tenggang ({check.daysRemainingInGrace} hr)</StatusBadge>
                        ) : c.subscription_status === 'active' ? (
                          <StatusBadge tone="success">Aktif</StatusBadge>
                        ) : (
                          <StatusBadge>{c.subscription_status || 'Pending'}</StatusBadge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink text-[11px]">
                        {c.subscription_id || 'Belum terhubung'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/s/${c.public_id}`}
                          className="px-2.5 py-1 rounded bg-subtle hover:bg-subtle text-ink text-[11px] font-medium border border-line transition"
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
