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
} from 'lucide-react';
import { PlaceSearchResult } from '@/lib/types';
import { Logo } from '@/components/ui/logo';

function formatIdr(amount: number) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function OrderWizard({ cardPrice }: { cardPrice: number }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessQuery, setBusinessQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
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
        setError('Tidak ditemukan tempat yang cocok. Coba ubah nama atau tambahkan kota.');
      } else {
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mencari listing');
    } finally {
      setLoading(false);
    }
  };

  const pickPlace = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
    setStep(2);
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
    'w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink text-xs font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action';
  const labelClass = 'block text-ink font-bold mb-1.5 text-xs';

  const canContinueShipping =
    merchantName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantEmail) &&
    shippingAddress.trim().length >= 20;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col p-4 sm:p-8 font-sans">
      <header className="w-full max-w-lg mx-auto flex items-center justify-between pb-4 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={32} className="shrink-0 shadow-md shadow-action/30 group-hover:scale-105 transition" />
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
            <span className="text-action">{stepLabels[step - 1]}</span>
          </div>
          <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-action h-full transition-all duration-300 rounded-full"
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
                  Pesan Kartu Review
                </h1>
                <p className="text-xs sm:text-sm text-muted-ink mt-1.5 leading-relaxed">
                  Cari bisnis Anda di Google Maps, kartu dikirim siap pakai tertaut ke profil tersebut.
                </p>
              </div>

              {places.length > 0 ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-ink tracking-tight">Pilih Lokasi Google</h2>
                      <p className="text-muted-ink mt-0.5">Pilih lokasi yang tepat dari hasil pencarian</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlaces([])}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Ubah Pencarian
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1" role="listbox" aria-label="Hasil pencarian Google Maps">
                    {places.map((place) => (
                      <button
                        key={place.place_id}
                        type="button"
                        role="option"
                        aria-selected={selectedPlace?.place_id === place.place_id}
                        onClick={() => pickPlace(place)}
                        disabled={loading}
                        className="w-full text-left p-4 rounded bg-surface hover:bg-subtle border border-line hover:border-action transition group flex items-start gap-3.5 shadow-sm disabled:opacity-50"
                      >
                        <MapPin className="w-5 h-5 text-action shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-ink text-sm group-hover:text-action-hover truncate">
                            {place.name}
                          </div>
                          <div className="text-muted-ink mt-0.5 line-clamp-2">{place.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
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
                    className="w-full flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
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
                    minLength={20}
                    placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan, kota, kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    aria-describedby="shipping-address-hint"
                    className={`${inputClass} resize-none`}
                  />
                  <p
                    id="shipping-address-hint"
                    aria-live="polite"
                    className={`mt-1 text-[11px] font-medium ${shippingAddress.trim().length >= 20 ? 'text-success' : 'text-muted-ink'}`}
                  >
                    {shippingAddress.trim().length >= 20
                      ? 'Alamat terlihat lengkap.'
                      : `Minimal 20 karakter (${shippingAddress.trim().length}/20) — tulis alamat lengkap agar kurir mudah menemukan.`}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!canContinueShipping}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
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
                  <span className="text-lg font-black text-success">
                    {formatIdr(cardPrice)}
                    <span className="text-xs font-normal text-muted-ink"> sekali bayar</span>
                  </span>
                </div>
                <ul className="space-y-2 pt-1">
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Kartu sudah tertaut ke bisnis Anda sebelum dikirim
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Tanpa biaya bulanan — bayar sekali, kartu aktif selamanya
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Dasbor analitik ketukan &amp; pemindaian termasuk
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {loading ? 'Menyiapkan Pembayaran...' : `Bayar ${formatIdr(cardPrice)}`}
              </button>
            </form>
          )}
        </div>

        <footer className="text-center text-xs text-muted-ink flex items-center justify-center gap-2 pt-1">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span className="font-medium">Bayar via QRIS, GoPay, transfer bank, atau kartu · Kartu dikirim dengan kurir</span>
        </footer>
      </main>
    </div>
  );
}
