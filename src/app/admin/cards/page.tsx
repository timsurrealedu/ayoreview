'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Plus, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface AdminLocation {
  id: string;
  name: string;
  city: string;
  business_name: string;
  organization_id: string;
  organization_name: string;
}

export default function AdminCardsInventoryPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchCount, setBatchCount] = useState(10);
  const [generating, setGenerating] = useState(false);

  // Assign modal state
  const [assigningCard, setAssigningCard] = useState<any | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [assignedPlacement, setAssignedPlacement] = useState('cashier');

  // Replace modal state
  const [replacingCard, setReplacingCard] = useState<any | null>(null);
  const [newInventoryCode, setNewInventoryCode] = useState('');

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const json = await res.json();
      if (json.success) {
        setCards(json.data.cards || []);
        setLocations(json.data.locations || []);
        if (json.data.locations?.length > 0) setSelectedLocationId(json.data.locations[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleBatchGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: batchCount }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCards();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningCard || !selectedLocationId) return;

    try {
      const res = await fetch('/api/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory_code: assigningCard.inventory_code,
          location_id: selectedLocationId,
          placement: assignedPlacement,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssigningCard(null);
        fetchCards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [filterTab, setFilterTab] = useState<'all' | 'pre_pro' | 'linked'>('all');

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.inventory_code.toLowerCase().includes(search.toLowerCase()) ||
      c.public_id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.business_name && c.business_name.toLowerCase().includes(search.toLowerCase())) ||
      (c.location_name && c.location_name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterTab === 'pre_pro') return !c.place_id && !c.location_id;
    if (filterTab === 'linked') return Boolean(c.place_id || c.location_id);
    return true;
  });

  return (
    <main className="p-8 space-y-6 max-w-7xl w-full mx-auto text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            Pengelolaan Inventaris Kartu Fisik
          </h1>
          <p className="text-muted-ink mt-0.5">
            Buat kartu kosong Pre-Programmed atau tetapkan ke lokasi bisnis
          </p>
        </div>

        {/* Batch Generator */}
        <div className="flex items-center gap-2 bg-surface border border-line p-2 rounded">
          <span className="text-muted-ink font-medium">Buat Massal:</span>
          <select
            value={batchCount}
            onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
            className="bg-surface border border-line rounded px-2 py-1 text-ink"
          >
            <option value="5">5 kartu</option>
            <option value="10">10 kartu</option>
            <option value="25">25 kartu</option>
            <option value="50">50 kartu</option>
          </select>
          <button
            onClick={handleBatchGenerate}
            disabled={generating}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-ink font-bold rounded transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {generating ? 'Membuat...' : 'Buat Kartu Kosong'}
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface border border-line p-1 rounded">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTab === 'all' ? 'bg-subtle text-ink' : 'text-muted-ink hover:text-ink'
            }`}
          >
            Semua ({cards.length})
          </button>
          <button
            onClick={() => setFilterTab('pre_pro')}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTab === 'pre_pro' ? 'bg-warning-soft text-warning' : 'text-muted-ink hover:text-ink'
            }`}
          >
            Pre-Pro Siap Kirim ({cards.filter((c) => !c.place_id && !c.location_id).length})
          </button>
          <button
            onClick={() => setFilterTab('linked')}
            className={`px-3 py-1 rounded font-medium transition ${
              filterTab === 'linked' ? 'bg-action/20 text-success' : 'text-muted-ink hover:text-ink'
            }`}
          >
            Tertaut ({cards.filter((c) => Boolean(c.place_id || c.location_id)).length})
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Saring kode RT, ID, bisnis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-line rounded pl-9 pr-4 py-1.5 text-ink placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface border border-line rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-muted-ink uppercase tracking-wider font-semibold text-[10px] bg-surface/60">
                <th className="py-3 px-5">Kode Inventaris</th>
                <th className="py-3 px-4">ID Publik</th>
                <th className="py-3 px-4">Nama Kartu</th>
                <th className="py-3 px-4">Lokasi yang Ditetapkan</th>
                <th className="py-3 px-4">Penempatan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Interaksi</th>
                <th className="py-3 px-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCards.map((c) => (
                <tr key={c.id} className="hover:bg-subtle/20 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-warning">
                    {c.inventory_code}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink">
                    {c.public_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    {c.business_name || c.name}
                  </td>
                  <td className="py-3.5 px-4 text-ink">
                    {c.place_id ? (
                      <div>
                        <span className="text-success font-medium">Tertaut ke Google Places</span>
                        <div className="text-[10px] text-muted-ink font-mono truncate max-w-[160px]">{c.place_id}</div>
                      </div>
                    ) : c.location_name ? (
                      <span>{c.location_name}</span>
                    ) : (
                      <span className="font-medium text-warning">Pre-Pro (Belum ditautkan)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-muted-ink">
                    {c.placement}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge tone={c.status === 'active' ? 'success' : c.status === 'replaced' ? 'warning' : 'neutral'}>{c.status}</StatusBadge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-ink">
                    {c.stats?.allTime || 0}
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setAssigningCard(c);
                        setAssignedPlacement(c.placement);
                      }}
                      className="px-2.5 py-1 rounded bg-subtle hover:bg-subtle text-ink text-[11px] font-medium border border-line transition"
                    >
                      Tetapkan Lokasi
                    </button>
                    <Link
                      href={`/dashboard/cards/${c.id}/print`}
                      target="_blank"
                      className="px-2.5 py-1 rounded bg-subtle hover:bg-subtle text-ink text-[11px] font-medium border border-line transition inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" /> Print
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Venue Modal */}
      {assigningCard && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">
                Tetapkan Perangkat {assigningCard.inventory_code}
              </h3>
              <button
                onClick={() => setAssigningCard(null)}
                className="text-muted-ink hover:text-ink"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-ink font-semibold mb-1">
                  Cabang Tujuan
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-amber-500"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.city}) — {l.business_name} [{l.organization_name}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Penempatan Fisik
                </label>
                <select
                  value={assignedPlacement}
                  onChange={(e) => setAssignedPlacement(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3 py-2 text-ink focus:outline-none focus:border-amber-500"
                >
                  <option value="cashier">Kasir / POS</option>
                  <option value="table">Meja / Bilik makan</option>
                  <option value="entrance">Pintu masuk utama</option>
                  <option value="counter">Konter barista</option>
                  <option value="waiting_area">Ruang tunggu</option>
                  <option value="receipt">Penjepit tagihan</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setAssigningCard(null)}
                  className="px-4 py-2 rounded bg-subtle text-ink font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-ink font-bold transition shadow"
                >
                  Konfirmasi Penetapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
