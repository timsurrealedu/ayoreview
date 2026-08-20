'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import Link from 'next/link';
import { 
  MapPin, 
  Plus, 
  ExternalLink, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Star,
  Search
} from 'lucide-react';
import { LocationWithStats, Business } from '@/lib/types';

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationWithStats[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    business_id: '',
    name: '',
    address: '',
    city: '',
    country: 'Indonesia',
    google_maps_url: '',
    google_review_url: '',
  });

  const fetchData = async () => {
    try {
      const [locRes, bizRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/businesses'),
      ]);
      const locJson = await locRes.json();
      const bizJson = await bizRes.json();
      if (locJson.success) setLocations(locJson.data.locations || []);
      if (bizJson.success) {
        setBusinesses(bizJson.data || []);
        if (bizJson.data?.length > 0) {
          setFormData((prev) => ({ ...prev, business_id: bizJson.data[0].id }));
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
    if (!formData.name || !formData.google_review_url) return;

    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          business_id: businesses[0]?.id || '',
          name: '',
          address: '',
          city: '',
          country: 'Indonesia',
          google_maps_url: '',
          google_review_url: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Lokasi Bisnis"
        subtitle="Kelola cabang fisik dan tujuan Ulasan Google yang terhubung"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Tambah Lokasi
          </button>
        }
      />

      <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Search and filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari lokasi berdasarkan nama, kota, atau alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121215] border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition"
            />
          </div>
          <div className="text-xs text-zinc-400">
            Showing {filteredLocations.length} locations
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight">
                      {loc.name}
                    </h3>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5">
                      {loc.business_name || 'Kopi Contoh'}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {loc.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-zinc-400 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{loc.address}, {loc.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <a
                      href={loc.google_review_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-300 hover:text-white truncate hover:underline flex items-center gap-1"
                    >
                      {loc.google_review_url.replace('https://', '')}
                      <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Quick metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-5">
                  <div>
                    <div className="text-[10px] text-zinc-400">Total Kunjungan</div>
                    <div className="text-base font-bold text-white">
                      {loc.total_interactions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400">Kartu Terpasang</div>
                    <div className="text-base font-bold text-emerald-400">
                      {loc.active_card_count} / {loc.card_count}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  href={`/dashboard/cards?location_id=${loc.id}`}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" /> View Cards
                </Link>
                <Link
                  href={`/dashboard/locations/${loc.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
                >
                  Configure <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add Location Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Tambah Lokasi Baru
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
                    Entitas Bisnis
                  </label>
                  <select
                    value={formData.business_id}
                    onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Nama Lokasi / Cabang *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: Cabang Utama Kemanggisan, Central Park Mall"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Kota *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="contoh: Jakarta Barat"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Negara
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Alamat Jalan
                  </label>
                  <input
                    type="text"
                    placeholder="contoh: Jl. Kemanggisan Raya No. 12"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    URL Ulasan Google (Tujuan) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://g.page/r/example/review"
                    value={formData.google_review_url}
                    onChange={(e) => setFormData({ ...formData, google_review_url: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Semua kartu NFC & QR fisik yang terhubung ke cabang ini akan langsung dialihkan ke sini.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition"
                  >
                    Buat Lokasi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
