import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { checkCardSubscriptionStatus } from '@/lib/subscription';
import { 
  CreditCard, 
  ExternalLink, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

import { ActivateCardModal } from '@/components/ui/activate-card-modal';
import { StatusBadge } from '@/components/ui/status-badge';

export const dynamic = 'force-dynamic';

export default async function MyCardsDashboardPage() {
  const user = await requireUser();
  const cards = await dbRepo.setupSearchCardsByEmail(user.email);

  // Aggregate stats across merchant's cards
  let totalToday = 0;
  let total7Days = 0;
  let totalAllTime = 0;

  cards.forEach((c) => {
    totalToday += c.stats.today;
    total7Days += c.stats.last7Days;
    totalAllTime += c.stats.allTime;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Kartu Ulasan Saya
          </h1>
          <p className="text-xs sm:text-sm text-ink mt-1">
            Pantau performa ketukan NFC dan pemindaian QR kartu ulasan bisnis Anda
          </p>
        </div>
        <div>
          <ActivateCardModal />
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line p-5 rounded">
          <div className="flex items-center justify-between text-ink text-xs font-semibold">
            <span>Interaksi Hari Ini</span>
            <Activity className="w-4 h-4 text-action" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink mt-2">
            {totalToday.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Ketukan & pemindaian valid</div>
        </div>

        <div className="bg-surface border border-line p-5 rounded">
          <div className="flex items-center justify-between text-ink text-xs font-semibold">
            <span>7 Hari Terakhir</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink mt-2">
            {total7Days.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Aktivitas mingguan</div>
        </div>

        <div className="bg-surface border border-line p-5 rounded">
          <div className="flex items-center justify-between text-ink text-xs font-semibold">
            <span>Total Sepanjang Waktu</span>
            <CreditCard className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink mt-2">
            {totalAllTime.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-muted-ink mt-1">Dari {cards.length} kartu terdaftar</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-ink uppercase tracking-wider">
          Daftar Kartu Terhubung ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="bg-surface border border-line rounded p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded bg-surface border border-line flex items-center justify-center text-muted-ink mx-auto">
              <CreditCard className="w-7 h-7 text-action" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Belum Ada Kartu yang Ditautkan</h3>
              <p className="text-xs text-ink max-w-md mx-auto mt-1.5 leading-relaxed">
                Pindai kode QR atau dekatkan ponsel ke kartu fisik AyoReview Anda untuk mulai menghubungkan lokasi Google Bisnis Anda.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((c) => {
              const subCheck = checkCardSubscriptionStatus(c as any);
              const isPastDueGrace = subCheck.inGracePeriod;

              return (
                <div
                  key={c.id}
                  className="bg-surface border border-line hover:border-line rounded p-5 shadow-sm space-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-ink text-sm truncate">
                        {c.business_name || c.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-warning font-semibold">
                          {c.inventory_code}
                        </span>
                        <span className="text-muted-ink">•</span>
                        <span className="font-mono text-[11px] text-ink">
                          ID: {c.public_id}
                        </span>
                      </div>
                    </div>

                    {/* Subscription Status Badge */}
                    {isPastDueGrace ? <StatusBadge tone="warning">Tenggang ({subCheck.daysRemainingInGrace} hr)</StatusBadge> : c.subscription_status === 'active' ? <StatusBadge tone="success">Aktif</StatusBadge> : c.subscription_status === 'pending' ? <StatusBadge tone="info">Uji Coba / Pending</StatusBadge> : <StatusBadge tone="error">Non-aktif</StatusBadge>}
                  </div>

                  {/* Grace period warning message */}
                  {isPastDueGrace && (
                    <div role="status" className="flex items-center justify-between rounded border border-warning/25 bg-warning-soft p-3 text-xs text-warning">
                      <span>Pembayaran tertunda. Kartu tetap aktif selama masa tenggang 7 hari.</span>
                      <Link href="/my/billing" className="ml-2 shrink-0 font-bold underline">
                        Bayar →
                      </Link>
                    </div>
                  )}

                  {/* Quick Card Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-surface border border-line p-3 rounded text-center text-xs">
                    <div>
                      <div className="text-[10px] text-muted-ink font-medium">Hari Ini</div>
                      <div className="font-bold text-ink mt-0.5">{c.stats.today}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-ink font-medium">7 Hari</div>
                      <div className="font-bold text-ink mt-0.5">{c.stats.last7Days}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-ink font-medium">Total Interaksi</div>
                      <div className="font-bold text-ink mt-0.5">{c.stats.allTime}</div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                    <a
                      href={`/q/${c.public_id}?test=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ink hover:text-ink transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Uji Tautan Ulasan
                    </a>

                    <Link
                      href={`/my/cards/${c.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-action hover:text-action-hover transition"
                    >
                      Detail & QR <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
