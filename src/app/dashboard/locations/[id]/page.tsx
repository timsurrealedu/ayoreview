'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  ExternalLink, 
  CreditCard, 
  Save, 
  Check, 
  ArrowLeft, 
  Plus,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Location, CardWithStats } from '@/lib/types';
import { QrPreviewModal } from '@/components/ui/qr-preview';

export default function LocationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [location, setLocation] = useState<Location | null>(null);
  const [cards, setCards] = useState<CardWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selectedCardForQr, setSelectedCardForQr] = useState<CardWithStats | null>(null);

  const [reviewUrl, setReviewUrl] = useState('');
  const [locName, setLocName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const fetchLocationData = async () => {
    try {
      const [cardsRes, locRes] = await Promise.all([
        fetch(`/api/cards?locationId=${id}`),
        fetch(`/api/locations`),
      ]);
      const cardsJson = await cardsRes.json();
      const locJson = await locRes.json();

      if (locJson.success) {
        const found = locJson.data.find((l: Location) => l.id === id);
        if (found) {
          setLocation(found);
          setLocName(found.name);
          setReviewUrl(found.google_review_url);
          setAddress(found.address);
          setCity(found.city);
        }
      }
      if (cardsJson.success) {
        setCards(cardsJson.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewUrl) return;

    try {
      const res = await fetch('/api/locations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: locName,
          address,
          city,
          google_review_url: reviewUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchLocationData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-muted-ink text-xs">Memuat pengaturan lokasi...</div>;
  }

  if (!location) {
    return <div className="p-8 text-muted-ink text-xs">Lokasi tidak ditemukan.</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={location.name}
        subtitle="Pengaturan lokasi dan pengelolaan tujuan ulasan secara langsung"
        actions={
          <Link
            href="/dashboard/locations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-subtle hover:bg-subtle text-ink text-xs font-medium border border-line transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Locations
          </Link>
        }
      />

      <main className="p-8 space-y-8 max-w-5xl w-full mx-auto">
        {/* Core Review Destination Form */}
        <div className="bg-surface border border-line/80 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-line/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                URL Tujuan Ulasan Google
              </h3>
              <p className="text-xs text-muted-ink mt-0.5">
                Mengubah URL ini langsung mengalihkan semua {cards.length} kartu NFC & QR yang terhubung tanpa mencetak ulang.
              </p>
            </div>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-action/10 px-2.5 py-1 rounded border border-success/20">
                <Check className="w-3.5 h-3.5" /> Tersimpan & Langsung Aktif
              </span>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block text-ink font-semibold mb-1">
                URL Ulasan Google Aktif (Tujuan)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                  className="flex-1 bg-surface border border-line rounded px-4 py-2.5 text-ink font-mono text-xs focus:outline-none focus:border-success"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-action hover:bg-action text-white font-bold transition shadow-lg shadow-action/20 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" /> Simpan Tujuan
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-ink mt-2">
                <span>Harus diawali https:// (contoh: https://g.page/r/.../review)</span>
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-success hover:underline flex items-center gap-1"
                >
                  Test current link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-line/80">
              <div>
                <label className="block text-muted-ink font-medium mb-1">Nama Cabang</label>
                <input
                  type="text"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-line"
                />
              </div>
              <div>
                <label className="block text-muted-ink font-medium mb-1">Kota</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-line"
                />
              </div>
              <div>
                <label className="block text-muted-ink font-medium mb-1">Alamat</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-line"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Associated Physical Cards */}
        <div className="bg-surface border border-line/80 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight">
                Kartu Ulasan yang Terhubung ke {location.name}
              </h3>
              <p className="text-xs text-muted-ink mt-0.5">
                Dudukan dan kartu fisik yang terpasang di cabang ini (total {cards.length})
              </p>
            </div>
            <Link
              href="/dashboard/cards"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Card
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 pt-2">Nama Kartu</th>
                  <th className="pb-3 pt-2">Penempatan</th>
                  <th className="pb-3 pt-2">Kode Inventaris</th>
                  <th className="pb-3 pt-2 text-right">Kunjungan 30 Hari</th>
                  <th className="pb-3 pt-2 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {cards.map((c) => (
                  <tr key={c.id} className="hover:bg-subtle/30 transition">
                    <td className="py-3.5 font-medium text-ink">
                      {c.name}
                    </td>
                    <td className="py-3.5 text-muted-ink capitalize">
                      <span className="px-2 py-0.5 rounded bg-subtle text-ink border border-line text-[11px]">
                        {c.placement}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-muted-ink text-[11px]">
                      {c.inventory_code}
                    </td>
                    <td className="py-3.5 text-right font-bold text-ink">
                      {c.stats.last30Days.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCardForQr(c)}
                        className="px-2.5 py-1 rounded bg-subtle hover:bg-subtle text-ink text-[11px] font-medium border border-line transition"
                      >
                        QR Code
                      </button>
                      <Link
                        href={`/dashboard/cards/${c.id}`}
                        className="px-2.5 py-1 rounded bg-action/10 hover:bg-action/20 text-success text-[11px] font-medium border border-success/20 transition"
                      >
                        Detail Kartu
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Modal */}
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
                locationName={location.name}
                inventoryCode={selectedCardForQr.inventory_code}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function selectedCardsPublicId(card: any) {
  return card.public_id || card.publicId || 'X8W91K';
}
