import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Order, OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const statusTone: Record<OrderStatus, 'info' | 'success' | 'warning' | 'error'> = {
  pending_payment: 'warning',
  paid: 'info',
  paid_unfulfilled: 'error',
  shipped: 'info',
  completed: 'success',
  cancelled: 'error',
};

const statusLabel: Record<OrderStatus, string> = {
  pending_payment: 'Menunggu Bayar',
  paid: 'Dibayar',
  paid_unfulfilled: 'Perlu Kartu',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

function formatIdr(amount: number) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminOrdersPage() {
  await requirePlatformAdmin();
  const orders: Order[] = await dbRepo.listOrders();

  const pendingFulfillment = orders.filter((o) => o.status === 'paid_unfulfilled').length;
  const revenue = orders
    .filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Pesanan Masuk</h1>
        <p className="text-xs text-muted-ink mt-1">
          Pesanan kartu fisik dari web. Urutan aksi: cetak kartu yang sudah tertaut → kirim → tandai status.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line rounded p-4">
          <div className="text-[11px] text-muted-ink font-medium">Total Pesanan</div>
          <div className="text-2xl font-black text-ink mt-1">{orders.length}</div>
        </div>
        <div className="bg-surface border border-line rounded p-4">
          <div className="text-[11px] text-muted-ink font-medium">Perlu Kartu (stok habis)</div>
          <div className="text-2xl font-black text-error mt-1">{pendingFulfillment}</div>
        </div>
        <div className="bg-surface border border-line rounded p-4">
          <div className="text-[11px] text-muted-ink font-medium">Pendapatan Kartu</div>
          <div className="text-2xl font-black text-success mt-1">{formatIdr(revenue)}</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-line rounded p-10 text-center text-xs text-muted-ink">
          Belum ada pesanan masuk.
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-line rounded shadow-sm">
          <table className="w-full text-xs min-w-[860px]">
            <thead>
              <tr className="border-b border-line text-left text-muted-ink">
                <th className="px-4 py-3 font-semibold">Kode</th>
                <th className="px-4 py-3 font-semibold">Bisnis</th>
                <th className="px-4 py-3 font-semibold">Pemesan</th>
                <th className="px-4 py-3 font-semibold">Alamat Kirim</th>
                <th className="px-4 py-3 font-semibold">Nominal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Masuk</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-b-0 hover:bg-subtle transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-ink whitespace-nowrap">{o.order_code}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{o.business_name}</td>
                  <td className="px-4 py-3 text-ink">
                    <div>{o.merchant_name}</div>
                    <div className="text-muted-ink">{o.merchant_email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-ink max-w-xs truncate" title={o.shipping_address}>
                    {o.shipping_address}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">{formatIdr(o.amount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-muted-ink whitespace-nowrap">{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
