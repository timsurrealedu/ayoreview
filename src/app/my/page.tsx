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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Kartu Ulasan Saya
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Pantau performa ketukan NFC dan pemindaian QR kartu ulasan bisnis Anda
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Interaksi Hari Ini</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalToday.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Ketukan & pemindaian valid</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>7 Hari Terakhir</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {total7Days.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Aktivitas mingguan</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Sepanjang Waktu</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalAllTime.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Dari {cards.length} kartu terdaftar</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">
          Daftar Kartu Terhubung ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Belum Ada Kartu yang Ditautkan</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                Pindai kode QR atau tempelkan kartu fisik ReviewTap Anda untuk mulai menghubungkan lokasi bisnis Google Anda.
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
                  className="bg-[#121215] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 shadow-sm space-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-sm truncate">
                        {c.business_name || c.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-amber-400 font-semibold">
                          {c.inventory_code}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          ID: {c.public_id}
                        </span>
                      </div>
                    </div>

                    {/* Subscription Status Badge */}
                    {isPastDueGrace ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Tenggang ({subCheck.daysRemainingInGrace} hr)
                      </span>
                    ) : c.subscription_status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : c.subscription_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Clock className="w-3 h-3" />
                        Trial / Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Non-aktif
                      </span>
                    )}
                  </div>

                  {/* Grace period warning message */}
                  {isPastDueGrace && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                      <span>Pembayaran tertunda. Kartu tetap aktif selama masa tenggang 7 hari.</span>
                      <Link href="/my/billing" className="font-bold underline text-amber-200 ml-2 shrink-0">
                        Bayar →
                      </Link>
                    </div>
                  )}

                  {/* Quick Card Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-400">Hari Ini</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.today}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">7 Hari</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.last7Days}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">Total Interaksi</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.allTime}</div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                    <a
                      href={`/q/${c.public_id}?test=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Uji Tautan Ulasan
                    </a>

                    <Link
                      href={`/my/cards/${c.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition"
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
