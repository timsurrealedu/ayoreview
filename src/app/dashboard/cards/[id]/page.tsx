'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import Link from 'next/link';
import { 
  CreditCard, 
  MapPin, 
  Star, 
  Save, 
  Check, 
  ArrowLeft, 
  Printer, 
  QrCode, 
  Smartphone,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { CardWithStats, CardPlacement, CardStatus, Location } from '@/lib/types';
import { QrPreviewModal } from '@/components/ui/qr-preview';

export default function CardDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [card, setCard] = useState<CardWithStats | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [placement, setPlacement] = useState<CardPlacement>('cashier');
  const [status, setStatus] = useState<CardStatus>('active');
  const [locationId, setLocationId] = useState<string>('');

  const fetchCard = async () => {
    try {
      const [cardRes, locRes] = await Promise.all([
        fetch(`/api/cards/${id}`),
        fetch(`/api/locations`),
      ]);
      const cardJson = await cardRes.json();
      const locJson = await locRes.json();

      if (cardJson.success && cardJson.data) {
        const c = cardJson.data;
        setCard(c);
        setName(c.name);
        setPlacement(c.placement);
        setStatus(c.status);
        setLocationId(c.location_id || '');
      }
      if (locJson.success) {
        setLocations(locJson.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          placement,
          status,
          location_id: locationId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchCard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-300 text-xs">Memuat detail kartu...</div>;
  }

  if (!card) {
    return <div className="p-8 text-zinc-300 text-xs">Kartu tidak ditemukan.</div>;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ayoreview.id';

  const statusLabels: Record<CardStatus, string> = {
    active: 'Aktif',
    inactive: 'Non-aktif',
    lost: 'Hilang',
    replaced: 'Diganti',
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={card.name}
        subtitle={`${card.inventory_code} · ID Publik: ${card.public_id}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href={`/dashboard/cards/${card.id}/print`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Templat Dudukan Akrilik
            </Link>
            <Link
              href="/dashboard/cards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </Link>
          </div>
        }
      />

      <main className="p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* KPI Row for this Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-300 text-xs font-semibold mb-1">Hari Ini</div>
            <div className="text-2xl font-black text-white">{card.stats.today}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Kunjungan ulasan hari ini</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-300 text-xs font-semibold mb-1">7 Hari Terakhir</div>
            <div className="text-2xl font-black text-white">{card.stats.last7Days}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Interaksi kartu mingguan</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-300 text-xs font-semibold mb-1">30 Hari Terakhir</div>
            <div className="text-2xl font-black text-[#34a853]">{card.stats.last30Days}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Kunjungan ulasan bulanan</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-300 text-xs font-semibold mb-1">QR vs NFC</div>
            <div className="text-2xl font-black text-white">
              <span className="text-[#fbbc04]">{card.stats.qr}</span> /{' '}
              <span className="text-[#1a73e8]">{card.stats.nfc}</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Pindaian QR dibanding ketukan NFC</div>
          </div>
        </div>

        {/* Configuration and Live QR Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Configuration Form */}
          <div className="lg:col-span-2 bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Pengaturan & Penempatan Kartu
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Perbarui detail kartu, pindahkan lokasi fisik, atau ubah status operasional
                </p>
              </div>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#34a853] bg-[#34a853]/10 px-2.5 py-1 rounded-lg border border-[#34a853]/30">
                  <Check className="w-3.5 h-3.5" /> Tersimpan
                </span>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-200 font-semibold mb-1.5">
                  Nama / Label Kartu *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Lokasi yang Ditetapkan
                  </label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                  >
                    <option value="">Belum ditetapkan</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Area Penempatan
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as CardPlacement)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                  >
                    <option value="cashier">Kasir / POS</option>
                    <option value="table">Meja / Bilik</option>
                    <option value="entrance">Pintu masuk utama</option>
                    <option value="counter">Konter barista</option>
                    <option value="waiting_area">Ruang tunggu</option>
                    <option value="receipt">Penjepit struk</option>
                    <option value="custom">Lokasi khusus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-200 font-semibold mb-1.5">
                  Status Operasional
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['active', 'inactive', 'lost', 'replaced'] as CardStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`py-2 rounded-xl font-semibold transition ${
                        status === st
                          ? 'bg-[#1a73e8]/20 text-[#4285f4] border border-[#1a73e8]/40 shadow-sm'
                          : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-750'
                      }`}
                    >
                      {statusLabels[st]}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1.5">
                  Jika status tidak Aktif, pelanggan yang mengetuk atau memindai akan melihat halaman pemberitahuan AyoReview.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[11px] text-zinc-300 font-mono">
                  Kode Inventaris: <strong className="text-[#fbbc04]">{card.inventory_code}</strong>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" /> Simpan Pengaturan Kartu
                </button>
              </div>
            </form>
          </div>

          {/* QR Generator Card */}
          <div>
            <QrPreviewModal
              publicId={card.public_id}
              name={card.name}
              locationName={card.location_name}
              inventoryCode={card.inventory_code}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
