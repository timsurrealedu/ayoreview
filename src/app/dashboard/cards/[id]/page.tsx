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
    return <div className="p-8 text-zinc-400 text-xs">Loading card details...</div>;
  }

  if (!card) {
    return <div className="p-8 text-zinc-400 text-xs">Card not found.</div>;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://reviewtap.id';

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={card.name}
        subtitle={`${card.inventory_code} · Public ID: ${card.public_id}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href={`/dashboard/cards/${card.id}/print`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Acrylic Stand Template
            </Link>
            <Link
              href="/dashboard/cards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        }
      />

      <main className="p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* KPI Row for this Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-1">Today</div>
            <div className="text-2xl font-black text-white">{card.stats.today}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Review page visits today</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-1">Last 7 Days</div>
            <div className="text-2xl font-black text-white">{card.stats.last7Days}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Weekly card interactions</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-1">Last 30 Days</div>
            <div className="text-2xl font-black text-emerald-400">{card.stats.last30Days}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Monthly Review Page Visits</div>
          </div>
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-zinc-400 text-xs font-medium mb-1">QR vs NFC</div>
            <div className="text-2xl font-black text-white">
              <span className="text-emerald-400">{card.stats.qr}</span> /{' '}
              <span className="text-sky-400">{card.stats.nfc}</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">QR scans vs NFC taps</div>
          </div>
        </div>

        {/* Configuration and Live QR Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Configuration Form */}
          <div className="lg:col-span-2 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Card Settings & Placement
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update card details, reassign physical venue, or change operational status
                </p>
              </div>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Card Name / Label *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Assigned Location
                  </label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Unassigned</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Placement Zone
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as CardPlacement)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cashier">Cashier / POS</option>
                    <option value="table">Table / Booth</option>
                    <option value="entrance">Main Entrance</option>
                    <option value="counter">Barista Counter</option>
                    <option value="waiting_area">Waiting Area</option>
                    <option value="receipt">Receipt Clip</option>
                    <option value="custom">Custom Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Operational Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['active', 'inactive', 'lost', 'replaced'] as CardStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`py-2 rounded-xl font-semibold capitalize transition ${
                        status === st
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1.5">
                  If status is not Active, customers tapping/scanning will see a friendly ReviewTap fallback page.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="text-[11px] text-zinc-400 font-mono">
                  Inventory Code: {card.inventory_code}
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" /> Save Card Settings
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
