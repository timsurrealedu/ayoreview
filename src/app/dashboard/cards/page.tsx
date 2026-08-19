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
        title="Review Cards"
        subtitle="Manage all physical NFC & QR cards deployed across your venues"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.97]"
          >
            <QrCode className="w-4 h-4" />
            Create New QR Code
          </button>
        }
      />

      <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by card name, RT-code, or public ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121215] border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'cashier', 'table', 'entrance', 'counter'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlacement(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition ${
                  selectedPlacement === p
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/60'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-900/40">
                  <th className="py-3 px-5">Card Name & IDs</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Placement</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">30D Visits</th>
                  <th className="py-3 px-4 text-right">QR / NFC</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/20 transition">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white text-sm">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                        <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                          {c.inventory_code}
                        </span>
                        <span className="text-zinc-400">ID: {c.public_id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {c.location_name ? (
                        <Link
                          href={`/dashboard/locations/${c.location_id}`}
                          className="hover:text-emerald-400 hover:underline"
                        >
                          {c.location_name}
                        </Link>
                      ) : (
                        <span className="text-amber-400 text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-medium">
                        {c.placement}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          c.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : c.status === 'replaced'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-white text-sm">
                      {c.stats.last30Days.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-zinc-400 text-xs">
                      <span className="text-emerald-400 font-semibold">{c.stats.qr}</span> /{' '}
                      <span className="text-sky-400 font-semibold">{c.stats.nfc}</span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCardForQr(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> QR
                      </button>
                      <Link
                        href={`/dashboard/cards/${c.id}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition inline-flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredCards.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs">
                      No cards match your filter. Create a new card above.
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
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add Review Card
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Card Name / Descriptor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasir 01, Table 04, Entrance Stand"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Assigned Location
                  </label>
                  <select
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Placement Type
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as CardPlacement })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cashier">Cashier / POS Counter</option>
                    <option value="table">Dining Table / Booth</option>
                    <option value="entrance">Main Entrance / Host Stand</option>
                    <option value="counter">Barista / Service Counter</option>
                    <option value="waiting_area">Waiting Lounge / Queue</option>
                    <option value="receipt">Bill Folder / Receipt Clip</option>
                    <option value="custom">Custom Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Optional Physical Inventory Code (e.g. RT-000123)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={formData.inventory_code}
                    onChange={(e) => setFormData({ ...formData, inventory_code: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition"
                  >
                    Create Card
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
                  className="text-zinc-400 hover:text-white text-xs bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700"
                >
                  Close
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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 transition-all active:scale-[0.95] hover:shadow-emerald-500/50"
        >
          <QrCode className="w-4 h-4" />
          Create QR Code
        </button>
      </main>
    </div>
  );
}

// Wrapped export to satisfy Next.js App Router Suspense boundary requirement for useSearchParams()
export default function CardsListPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 flex flex-col"><main className="p-8 text-zinc-400 text-xs">Loading cards...</main></div>}>
      <CardsListPage />
    </Suspense>
  );
}
