'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Search,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { PlaceSearchResult } from '@/lib/types';

type SetupMode = 'direct' | 'search';

function formatIdr(amount: number) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function OrderWizard({ cardPrice }: { cardPrice: number }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [setupMode, setSetupMode] = useState<SetupMode>('direct');
  const [businessQuery, setBusinessQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);

  const [merchantName, setMerchantName] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/setup/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: businessQuery, city: cityQuery }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mencari lokasi Google Places');
      }
      setPlaces(data.places || []);
      if (!data.places?.length) {
        setError('Tidak ditemukan tempat yang cocok. Coba ubah nama atau gunakan opsi Tempel Tautan.');
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mencari listing');
    } finally {
      setLoading(false);
    }
  };

  const pickPlace = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
    setStep(3);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessQuery.trim() || !directUrl.trim()) return;
    pickPlace({
      place_id: directUrl.trim(),
      name: businessQuery.trim(),
      address: 'Tautan Ulasan Google Langsung',
      google_maps_url: directUrl.trim(),
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: selectedPlace.place_id,
          businessName: selectedPlace.name,
          merchantName,
          merchantEmail,
          merchantPhone,
          shippingAddress,
        }),
      });
      const data = await res.json();
      if (data.mock) {
        window.location.href = `/pesan/sukses?order=${data.orderId}&mock=1`;
        return;
      }
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Gagal memproses pesanan. Coba lagi.');
      setLoading(false);
    }
  };

  const stepLabels = ['Bisnis', 'Pengiriman', 'Bayar'];
  const inputClass =
    'w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink text-xs font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]';
  const labelClass = 'block text-ink font-bold mb-1.5 text-xs';

  const canContinueShipping =
    merchantName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantEmail) &&
    shippingAddress.trim().length >= 20;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col p-4 sm:p-8 font-sans">
      <header className="w-full max-w-lg mx-auto flex items-center justify-between pb-4 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-[#1a73e8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#1a73e8]/30 group-hover:scale-105 transition">
            A
          </div>
          <span className="font-bold text-ink tracking-tight text-sm sm:text-base">AyoReview</span>
        </Link>
        <Link href="/login" className="text-xs font-semibold text-muted-ink hover:text-action transition">
          Masuk
        </Link>
      </header>

      <main className="w-full max-w-lg mx-auto my-auto py-6 space-y-4">
        <div className="bg-surface/90 border border-line rounded p-3">
          <div className="flex justify-between items-center text-xs font-semibold text-ink mb-2">
            <span>Langkah {step} dari 3</span>
            <span className="text-[#1a73e8]">{stepLabels[step - 1]}</span>
          </div>
          <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1a73e8] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-surface border border-line rounded p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div role="alert" aria-live="assertive" className="flex items-center gap-2.5 rounded border border-error/25 bg-error-soft p-3.5 text-xs font-semibold text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  Pesan Kartu Ulasan
                </h1>
                <p className="text-xs sm:text-sm text-muted-ink mt-1.5 leading-relaxed">
                  Hubungkan kartu ke profil Google bisnis Anda sekarang, kartu dikirim siap pakai.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface border border-line rounded text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSetupMode('direct')}
                  className={`py-2.5 rounded transition text-center ${
                    setupMode === 'direct'
                      ? 'bg-[#1a73e8] text-white shadow-md'
                      : 'text-ink hover:bg-subtle'
                  }`}
                >
                  Tempel Tautan (Mudah)
                </button>
                <button
                  type="button"
                  onClick={() => setSetupMode('search')}
                  className={`py-2.5 rounded transition text-center ${
                    setupMode === 'search'
                      ? 'bg-[#1a73e8] text-white shadow-md'
                      : 'text-ink hover:bg-subtle'
                  }`}
                >
                  Cari di Google Maps
                </button>
              </div>

              {setupMode === 'direct' ? (
                <form onSubmit={handleDirectSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className={labelClass}>Nama Bisnis / Cabang *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kopi Kenangan Senopati"
                      value={businessQuery}
                      onChange={(e) => setBusinessQuery(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tautan Ulasan Google / Google Maps *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://g.page/r/.../review atau https://maps.app.goo.gl/..."
                      value={directUrl}
                      onChange={(e) => setDirectUrl(e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                    <div className="p-3.5 bg-subtle border border-line rounded mt-2.5 text-xs text-ink space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-warning" />
                        Cara mendapatkan tautan gratis:
                      </div>
                      <div>1. Buka aplikasi Google Maps di HP, lalu cari nama toko Anda.</div>
                      <div>2. Klik tombol &quot;Bagikan&quot; atau &quot;Minta Ulasan&quot;, lalu salin tautannya.</div>
                      <div>3. Tempel link tersebut di atas. Selesai!</div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!businessQuery.trim() || !directUrl.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    Lanjut ke Pengiriman
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSearch} className="space-y-4 text-xs">
                  <div>
                    <label className={labelClass}>Nama Bisnis *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kopi Kenangan, Salon Indah"
                        value={businessQuery}
                        onChange={(e) => setBusinessQuery(e.target.value)}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Kota / Wilayah (Opsional)</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Contoh: Jakarta Selatan, Surabaya"
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !businessQuery.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {loading ? 'Mencari di Google Maps...' : 'Cari Listing Google'}
                  </button>
                </form>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink tracking-tight">Alamat Pengiriman</h2>
                  <p className="text-xs text-muted-ink mt-1">Kami kirim kartu yang sudah tertaut ke alamat ini</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>
              </div>

              {selectedPlace && (
                <div className="p-3.5 bg-subtle border border-line rounded text-xs flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-action shrink-0" />
                  <span className="truncate font-bold">{selectedPlace.name}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4 text-xs">
                <div>
                  <label className={labelClass}>Nama Pemesan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama pemilik / manajer"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@bisnis.com"
                    value={merchantEmail}
                    onChange={(e) => setMerchantEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>No. WhatsApp (Opsional)</label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Alamat Lengkap Pengiriman *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan, kota, kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!canContinueShipping}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  Tinjau Pesanan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {step === 3 && selectedPlace && (
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink tracking-tight">Tinjau Pesanan</h2>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Ubah
                </button>
              </div>

              <div className="bg-surface border border-line p-5 rounded text-left space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-ink shrink-0">Bisnis</span>
                  <span className="font-bold text-right truncate">{selectedPlace.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-ink shrink-0">Dikirim ke</span>
                  <span className="text-right">{merchantName} · {shippingAddress}</span>
                </div>
                <div className="border-t border-line pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-sm">Kartu NFC + QR</span>
                  <span className="text-lg font-black text-[#137333]">
                    {formatIdr(cardPrice)}
                    <span className="text-xs font-normal text-muted-ink"> sekali bayar</span>
                  </span>
                </div>
                <ul className="space-y-2 pt-1">
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                    Kartu sudah tertaut ke bisnis Anda sebelum dikirim
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                    Langganan Rp 49.000/bulan dimulai setelah kartu aktif dipakai
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                    Dasbor analitik ketukan &amp; pemindaian termasuk
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm transition shadow-lg shadow-[#1a73e8]/30 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {loading ? 'Menyiapkan Pembayaran...' : `Bayar ${formatIdr(cardPrice)}`}
              </button>
            </form>
          )}
        </div>

        <footer className="text-center text-xs text-muted-ink flex items-center justify-center gap-2 pt-1">
          <ShieldCheck className="w-4 h-4 text-[#137333]" />
          <span className="font-medium">Bayar via QRIS, GoPay, transfer bank, atau kartu · Kartu dikirim dengan kurir</span>
        </footer>
      </main>
    </div>
  );
}
