import Link from 'next/link';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { dbRepo } from '@/lib/db';
import { getMidtransStatus, mapMidtransToOrderStatus } from '@/lib/midtrans';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ order?: string; mock?: string }>;
};

async function resolveOrder(orderId: string | undefined) {
  if (!orderId) return null;
  let order = await dbRepo.getOrderById(orderId);
  if (!order) return null;

  // Belt-and-suspenders: if the webhook hasn't landed yet, verify the
  // transaction directly with Midtrans before fulfilling. fulfillOrder is idempotent.
  if (order.status === 'pending_payment' && order.order_code) {
    const status = await getMidtransStatus(order.order_code);
    if (status && mapMidtransToOrderStatus(status) === 'paid') {
      order = (await dbRepo.fulfillOrder(order.id, status.transaction_id)) || order;
    }
  }

  return order;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = await resolveOrder(params.order);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col p-4 sm:p-8 font-sans">
      <header className="w-full max-w-lg mx-auto flex items-center pb-4 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-action flex items-center justify-center text-white font-black text-sm">
            A
          </div>
          <span className="font-bold text-ink tracking-tight text-sm sm:text-base">AyoReview</span>
        </Link>
      </header>

      <main className="w-full max-w-lg mx-auto my-auto py-6">
        {!order ? (
          <div className="bg-surface border border-line rounded p-8 shadow-2xl text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
            <h1 className="text-xl font-bold">Pesanan tidak ditemukan</h1>
            <p className="text-xs text-muted-ink leading-relaxed">
              Kami tidak menemukan pesanan dengan ID tersebut. Jika Anda baru saja membayar,
              tunggu beberapa saat lalu muat ulang halaman ini.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-6 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition active:scale-[0.98]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : order.status === 'pending_payment' ? (
          <div className="bg-surface border border-line rounded p-8 shadow-2xl text-center space-y-4">
            <Clock className="w-12 h-12 text-warning mx-auto" />
            <h1 className="text-xl font-bold">Pembayaran sedang diproses</h1>
            <p className="text-xs text-muted-ink leading-relaxed">
              Pesanan <span className="font-mono font-bold text-ink">{order.order_code}</span> belum
              terkonfirmasi. Halaman ini akan diperbarui otomatis setelah pembayaran terverifikasi —
              atau muat ulang dalam satu menit.
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-line rounded p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mx-auto shadow-lg shadow-success/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Pesanan Diterima!</h1>
              <p className="text-xs sm:text-sm text-muted-ink mt-2 leading-relaxed">
                Pesanan <span className="font-mono font-bold text-success">{order.order_code}</span>{' '}
                untuk <span className="font-bold text-ink">{order.business_name}</span> sudah kami
                terima dan dibayarkan.
              </p>
            </div>

            <ol className="text-left bg-subtle border border-line rounded p-4 space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                Kartu Anda sudah tertaut ke profil Google bisnis sebelum dikirim
              </li>
              <li className="flex items-start gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                Kami cetak, quality-check, lalu kirim ke alamat Anda (2–4 hari kerja)
              </li>
              <li className="flex items-start gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                Kartu tiba: taruh di kasir atau meja, pelanggan langsung bisa memberi ulasan
              </li>
            </ol>

            <Link
              href="/signup"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98]"
            >
              Buat Akun Dasbor
            </Link>
          </div>
        )}
      </main>

      <footer className="w-full max-w-lg mx-auto text-center text-xs text-muted-ink pt-2">
        Butuh bantuan? Hubungi kami dengan menyebut kode pesanan Anda.
      </footer>
    </div>
  );
}
