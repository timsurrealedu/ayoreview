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
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Pantau performa ketukan NFC dan pemindaian QR kartu ulasan bisnis Anda
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-300 text-xs font-semibold">
            <span>Interaksi Hari Ini</span>
            <Activity className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalToday.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Ketukan & pemindaian valid</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-300 text-xs font-semibold">
            <span>7 Hari Terakhir</span>
            <TrendingUp className="w-4 h-4 text-[#34a853]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {total7Days.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Aktivitas mingguan</div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-300 text-xs font-semibold">
            <span>Total Sepanjang Waktu</span>
            <CreditCard className="w-4 h-4 text-[#fbbc04]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalAllTime.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Dari {cards.length} kartu terdaftar</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Daftar Kartu Terhubung ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-zinc-400 mx-auto">
              <CreditCard className="w-7 h-7 text-[#1a73e8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Belum Ada Kartu yang Ditautkan</h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto mt-1.5 leading-relaxed">
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
                  className="bg-[#121215] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-sm space-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-sm truncate">
                        {c.business_name || c.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-[#fbbc04] font-semibold">
                          {c.inventory_code}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="font-mono text-[11px] text-zinc-300">
                          ID: {c.public_id}
                        </span>
                      </div>
                    </div>

                    {/* Subscription Status Badge */}
                    {isPastDueGrace ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Tenggang ({subCheck.daysRemainingInGrace} hr)
                      </span>
                    ) : c.subscription_status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#34a853]/10 text-[#34a853] border border-[#34a853]/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : c.subscription_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1a73e8]/10 text-[#4285f4] border border-[#1a73e8]/30">
                        <Clock className="w-3 h-3" />
                        Uji Coba / Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        Non-aktif
                      </span>
                    )}
                  </div>

                  {/* Grace period warning message */}
                  {isPastDueGrace && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center justify-between">
                      <span>Pembayaran tertunda. Kartu tetap aktif selama masa tenggang 7 hari.</span>
                      <Link href="/my/billing" className="font-bold underline text-amber-300 ml-2 shrink-0">
                        Bayar →
                      </Link>
                    </div>
                  )}

                  {/* Quick Card Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-400 font-medium">Hari Ini</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.today}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-medium">7 Hari</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.last7Days}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-medium">Total Interaksi</div>
                      <div className="font-bold text-white mt-0.5">{c.stats.allTime}</div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                    <a
                      href={`/q/${c.public_id}?test=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Uji Tautan Ulasan
                    </a>

                    <Link
                      href={`/my/cards/${c.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#1a73e8] hover:text-[#4285f4] transition"
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
