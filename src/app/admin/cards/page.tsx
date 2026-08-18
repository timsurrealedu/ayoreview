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
import { Location } from '@/lib/types';

export default function AdminCardsInventoryPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
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
      const [cRes, locRes] = await Promise.all([
        fetch('/api/cards'),
        fetch('/api/locations'),
      ]);
      const cJson = await cRes.json();
      const locJson = await locRes.json();
      if (cJson.success) setCards(cJson.data || []);
      if (locJson.success) {
        setLocations(locJson.data || []);
        if (locJson.data?.length > 0) setSelectedLocationId(locJson.data[0].id);
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

  const filteredCards = cards.filter(
    (c) =>
      c.inventory_code.toLowerCase().includes(search.toLowerCase()) ||
      c.public_id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location_name && c.location_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="p-8 space-y-6 max-w-7xl w-full mx-auto text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Physical Card Inventory Management
          </h1>
          <p className="text-zinc-400 mt-0.5">
            Pre-manufacture blank NFC/QR cards with RT-inventory codes and assign to merchants on-site
          </p>
        </div>

        {/* Batch Generator */}
        <div className="flex items-center gap-2 bg-[#121215] border border-zinc-800 p-2 rounded-xl">
          <span className="text-zinc-400 font-medium">Batch Generate:</span>
          <select
            value={batchCount}
            onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white"
          >
            <option value="5">5 cards</option>
            <option value="10">10 cards</option>
            <option value="25">25 cards</option>
            <option value="50">50 cards</option>
          </select>
          <button
            onClick={handleBatchGenerate}
            disabled={generating}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {generating ? 'Generating...' : 'Create Blank'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by inventory code (e.g. RT-000101), ID, or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#121215] border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-900/60">
                <th className="py-3 px-5">Inventory Code</th>
                <th className="py-3 px-4">Public ID</th>
                <th className="py-3 px-4">Card Name</th>
                <th className="py-3 px-4">Assigned Location</th>
                <th className="py-3 px-4">Placement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Interactions</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCards.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                    {c.inventory_code}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {c.public_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    {c.location_name ? (
                      <span>{c.location_name}</span>
                    ) : (
                      <span className="text-amber-400/80 font-medium">Unassigned (Blank)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-zinc-400">
                    {c.placement}
                  </td>
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-right font-bold text-white">
                    {c.stats?.allTime || 0}
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setAssigningCard(c);
                        setAssignedPlacement(c.placement);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700 transition"
                    >
                      Assign Venue
                    </button>
                    <Link
                      href={`/dashboard/cards/${c.id}/print`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium border border-zinc-700 transition inline-flex items-center gap-1"
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
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Assign Hardware {assigningCard.inventory_code}
              </h3>
              <button
                onClick={() => setAssigningCard(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Target Location Branch
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Physical Placement
                </label>
                <select
                  value={assignedPlacement}
                  onChange={(e) => setAssignedPlacement(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="cashier">Cashier / POS</option>
                  <option value="table">Table / Dining Booth</option>
                  <option value="entrance">Main Entrance</option>
                  <option value="counter">Barista Counter</option>
                  <option value="waiting_area">Waiting Lounge</option>
                  <option value="receipt">Bill Clip</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAssigningCard(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition shadow"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
