'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import Link from 'next/link';
import { 
  CreditCard, 
  Plus, 
  Search, 
  QrCode, 
  Smartphone, 
  ExternalLink, 
  Printer,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CardWithStats, CardPlacement, Location, Business } from '@/lib/types';
import { QrPreviewModal } from '@/components/ui/qr-preview';
import { StatusBadge } from '@/components/ui/status-badge';

function CardsListPage() {
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<CardWithStats[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');
  const [selectedCardForQr, setSelectedCardForQr] = useState<CardWithStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location_id: '',
    placement: 'cashier' as CardPlacement,
    inventory_code: '',
  });

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      const locFilter = searchParams.get('location_id');
      if (locFilter) params.set('locationId', locFilter);
      const qs = params.toString();
      const [cardsRes, locRes] = await Promise.all([
        fetch(`/api/cards${qs ? `?${qs}` : ''}`),
        fetch('/api/locations'),
      ]);
      const cardsJson = await cardsRes.json();
      const locJson = await locRes.json();
      if (cardsJson.success) setCards(cardsJson.data || []);
      if (locJson.success) {
        setLocations(locJson.data || []);
        if (locJson.data?.length > 0) {
          setFormData((prev) => ({ ...prev, location_id: locJson.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          location_id: locations[0]?.id || '',
          placement: 'cashier',
          inventory_code: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.inventory_code.toLowerCase().includes(search.toLowerCase()) ||
      c.public_id.toLowerCase().includes(search.toLowerCase()) ||
      (c.location_name && c.location_name.toLowerCase().includes(search.toLowerCase()));

    const matchesPlacement =
      selectedPlacement === 'all' || c.placement === selectedPlacement;

    return matchesSearch && matchesPlacement;
  });

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Kartu Ulasan"
        subtitle="Kelola semua kartu NFC & QR fisik di tempat usaha Anda"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-action hover:bg-action text-white text-xs font-bold shadow-lg shadow-action/25 transition-all active:scale-[0.97]"
          >
            <QrCode className="w-4 h-4" />
            Buat Kode QR Baru
          </button>
        }
      />

      <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama kartu, kode RT, atau ID publik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-line rounded pl-9 pr-4 py-2 text-xs text-ink placeholder-zinc-500 focus:outline-none focus:border-success/60 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'cashier', 'table', 'entrance', 'counter'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlacement(p)}
                className={`px-3 py-1.5 rounded text-xs font-medium capitalize whitespace-nowrap transition ${
                  selectedPlacement === p
                    ? 'bg-subtle text-ink border border-line'
                    : 'text-muted-ink hover:text-ink bg-surface/60 border border-line/60'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-surface border border-line/80 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-semibold text-[10px] bg-surface/40">
                  <th className="py-3 px-5">Nama Kartu & ID</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4">Penempatan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Kunjungan 30 Hari</th>
                  <th className="py-3 px-4 text-right">QR / NFC</th>
                  <th className="py-3 px-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-subtle/20 transition">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-ink text-sm">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-ink mt-1">
                        <span className="bg-surface px-1.5 py-0.5 rounded border border-line">
                          {c.inventory_code}
                        </span>
                        <span className="text-muted-ink">ID: {c.public_id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-ink">
                      {c.location_name ? (
                        <Link
                          href={`/dashboard/locations/${c.location_id}`}
                          className="hover:text-success hover:underline"
                        >
                          {c.location_name}
                        </Link>
                      ) : (
                        <span className="text-xs text-warning">Belum ditetapkan</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize px-2.5 py-1 rounded bg-surface border border-line text-ink text-[11px] font-medium">
                        {c.placement}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge tone={c.status === 'active' ? 'success' : c.status === 'replaced' ? 'warning' : 'neutral'}>{c.status}</StatusBadge>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-ink text-sm">
                      {c.stats.last30Days.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-muted-ink text-xs">
                      <span className="text-success font-semibold">{c.stats.qr}</span> /{' '}
                      <span className="font-semibold text-action">{c.stats.nfc}</span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCardForQr(c)}
                        className="px-2.5 py-1.5 rounded bg-subtle hover:bg-subtle text-ink text-xs font-medium border border-line transition inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> QR
                      </button>
                      <Link
                        href={`/dashboard/cards/${c.id}`}
                        className="px-3 py-1.5 rounded bg-action/10 hover:bg-action/20 text-success text-xs font-semibold border border-success/20 transition inline-flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredCards.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-ink text-xs">
                      Tidak ada kartu yang sesuai filter. Buat kartu baru di atas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Card Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-line rounded w-full max-w-md p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Tambah Kartu Ulasan
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-muted-ink hover:text-ink text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-ink font-medium mb-1">
                    Nama / Keterangan Kartu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: Kasir 01, Meja 04, Pintu Masuk"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-success"
                  />
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">
                    Lokasi yang Ditetapkan
                  </label>
                  <select
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-success"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">
                    Jenis Penempatan
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as CardPlacement })}
                    className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-success"
                  >
                    <option value="cashier">Kasir / Konter POS</option>
                    <option value="table">Meja makan / Bilik</option>
                    <option value="entrance">Pintu masuk utama / Meja penerima</option>
                    <option value="counter">Barista / Konter layanan</option>
                    <option value="waiting_area">Ruang tunggu / Antrean</option>
                    <option value="receipt">Map tagihan / Penjepit struk</option>
                    <option value="custom">Area khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">
                    Optional Physical Inventory Code (e.g. RT-000123)
                  </label>
                  <input
                    type="text"
                    placeholder="Kosongkan untuk membuat otomatis"
                    value={formData.inventory_code}
                    onChange={(e) => setFormData({ ...formData, inventory_code: e.target.value })}
                    className="w-full bg-surface border border-line rounded px-3 py-2 text-ink font-mono text-[11px] focus:outline-none focus:border-success"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded bg-subtle hover:bg-subtle text-ink text-xs font-medium transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-action hover:bg-action text-white text-xs font-semibold shadow-lg shadow-action/20 transition"
                  >
                    Buat Kartu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Preview Modal */}
        {selectedCardForQr && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setSelectedCardForQr(null)}
                  className="text-muted-ink hover:text-ink text-xs bg-subtle px-3 py-1 rounded border border-line"
                >
                  Tutup
                </button>
              </div>
              <QrPreviewModal
                publicId={selectedCardForQr.public_id}
                name={selectedCardForQr.name}
                locationName={selectedCardForQr.location_name}
                inventoryCode={selectedCardForQr.inventory_code}
              />
            </div>
          </div>
        )}

        {/* Floating Create QR Code FAB */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded bg-action hover:bg-action text-white font-bold text-xs shadow-2xl shadow-action/30 transition-all active:scale-[0.95] hover:shadow-action/50"
        >
          <QrCode className="w-4 h-4" />
          Buat Kode QR
        </button>
      </main>
    </div>
  );
}

// Wrapped export to satisfy Next.js App Router Suspense boundary requirement for useSearchParams()
export default function CardsListPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 flex flex-col"><main className="p-8 text-muted-ink text-xs">Memuat kartu...</main></div>}>
      <CardsListPage />
    </Suspense>
  );
}
