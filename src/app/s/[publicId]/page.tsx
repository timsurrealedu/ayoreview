'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  Mail, 
  User, 
  Loader2,
  HelpCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PlaceSearchResult } from '@/lib/types';

export default function CardSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <CardSetupContent />
    </Suspense>
  );
}

function CardSetupContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicId = typeof params.publicId === 'string' ? params.publicId : '';

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [setupMode, setSetupMode] = useState<'search' | 'direct'>('direct');
  const [businessQuery, setBusinessQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);

  // Direct link state (no Places API credit card needed)
  const [directName, setDirectName] = useState('');
  const [directUrl, setDirectUrl] = useState('');

  // Account state
  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Link state
  const [isLinked, setIsLinked] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      setIsLinked(true);
      setStep(6);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        setEmail(data.user.email || '');
        setName(data.user.user_metadata?.name || data.user.email?.split('@')[0] || '');
      }
    });
  }, [searchParams]);

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
      if (data.places?.length === 0) {
        setError('Tidak ditemukan tempat yang cocok. Coba ubah nama atau gunakan opsi Tempel Tautan Langsung.');
      } else {
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mencari listing');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
    if (user) {
      // User is already logged in, proceed to link
      handleLinkCard(user.email, place);
    } else {
      setStep(4);
    }
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directUrl.trim()) return;

    const trimmedUrl = directUrl.trim();
    const mockPlace: PlaceSearchResult = {
      place_id: trimmedUrl,
      name: directName.trim(),
      address: 'Tautan Ulasan Google Langsung',
      google_maps_url: trimmedUrl,
    };

    handleSelectPlace(mockPlace);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;

    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || selectedPlace.name },
        },
      });

      if (authError) {
        // If user already exists, try signing in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          throw new Error(`Gagal membuat akun atau login: ${authError.message}`);
        }
      }

      await handleLinkCard(email, selectedPlace);
    } catch (err: any) {
      setError(err.message || 'Gagal menyiapkan akun');
      setLoading(false);
    }
  };

  const handleLinkCard = async (merchantEmail: string, place: PlaceSearchResult) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/setup/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId,
          placeId: place.place_id,
          businessName: place.name,
          email: merchantEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghubungkan kartu');
      }

      setIsLinked(true);
      setStep(5); // Move to subscription step
    } catch (err: any) {
      setError(err.message || 'Gagal menghubungkan kartu AyoReview');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSubscription = async () => {
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Gagal membuka halaman pembayaran');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Gagal membuka pembayaran. Coba lagi.');
      setCheckoutLoading(false);
    }
  };

  const stepLabels = [
    'Mulai',
    'Bisnis',
    'Pilih',
    'Akun',
    'Langganan',
    'Selesai'
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between pb-4 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-action flex items-center justify-center text-white font-black text-sm shadow-md shadow-action/30 group-hover:scale-105 transition">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-ink tracking-tight text-sm sm:text-base">AyoReview</span>
            <span className="text-[10px] text-muted-ink font-medium">Aktivasi Kartu Pintar</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-ink bg-subtle px-3 py-1 rounded border border-line font-semibold shadow-sm">
            ID: {publicId}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-lg mx-auto my-auto py-6">
        {/* Progress Tracker */}
        <div className="mb-4 bg-surface/90 border border-line rounded p-3">
          <div className="flex justify-between items-center text-xs font-semibold text-ink mb-2">
            <span>Langkah {step} dari 6</span>
            <span className="text-action">{stepLabels[step - 1]}</span>
          </div>
          <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-action h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
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

          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded bg-action/20 border border-action/50 flex items-center justify-center text-action mx-auto shadow-lg shadow-action/20">
                <Sparkles className="w-8 h-8 text-action" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  Aktifkan Kartu AyoReview Anda
                </h1>
                <p className="text-xs sm:text-sm text-ink mt-2 leading-relaxed font-normal">
                  Kartu fisik dengan ID <span className="font-mono text-warning font-bold">{publicId}</span> siap dihubungkan ke profil ulasan Google Maps tempat usaha Anda.
                </p>
              </div>

              <div className="bg-surface border border-line p-4 rounded text-left space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Langsung terhubung ke Google Review Form
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Mendukung Tap NFC dan Scan QR instan
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Garansi masa tenggang 7 hari pembayaran
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98]"
              >
                Mulai Hubungkan Bisnis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Business Connection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink tracking-tight">
                    Hubungkan Lokasi Bisnis
                  </h2>
                  <p className="text-xs text-ink mt-1">
                    Pilih metode yang paling mudah bagi Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-ink bg-subtle hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface border border-line rounded text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSetupMode('direct')}
                  className={`py-2.5 rounded transition text-center ${
                    setupMode === 'direct'
                      ? 'bg-action text-white shadow-md'
                      : 'text-ink hover:text-ink hover:bg-subtle'
                  }`}
                >
                  Tempel Tautan (Mudah & Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setSetupMode('search')}
                  className={`py-2.5 rounded transition text-center ${
                    setupMode === 'search'
                      ? 'bg-action text-white shadow-md'
                      : 'text-ink hover:text-ink hover:bg-subtle'
                  }`}
                >
                  Cari di Google Maps
                </button>
              </div>

              {setupMode === 'direct' ? (
                <form onSubmit={handleDirectSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-ink font-bold mb-1.5">
                      Nama Bisnis / Cabang *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kopi Kenangan Senopati"
                        value={directName}
                        onChange={(e) => setDirectName(e.target.value)}
                        className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink font-bold mb-1.5">
                      Tautan Ulasan Google / Google Maps *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://g.page/r/.../review atau https://maps.app.goo.gl/..."
                      value={directUrl}
                      onChange={(e) => setDirectUrl(e.target.value)}
                      className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink font-mono text-xs placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                    />
                    <div className="p-3.5 bg-surface/90 border border-line rounded mt-2.5 text-xs text-ink space-y-1.5">
                      <div className="font-bold text-ink flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-warning" />
                        Cara mendapatkan tautan gratis (10 Detik):
                      </div>
                <div className="text-ink">1. Buka aplikasi Google Maps di HP, lalu cari nama toko Anda.</div>
                <div className="text-ink">2. Klik tombol <span className="font-semibold text-ink">&quot;Bagikan&quot;</span> atau <span className="font-semibold text-ink">&quot;Minta Ulasan&quot;</span>, lalu salin tautannya.</div>
                      <div className="text-ink">3. Tempel link tersebut di atas. Selesai!</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded bg-subtle hover:bg-subtle text-ink font-bold text-xs border border-line transition"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={!directName.trim() || !directUrl.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      Lanjutkan ke Akun
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSearch} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-ink font-bold mb-1.5">
                      Nama Bisnis *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kopi Kenangan, Salon Indah"
                        value={businessQuery}
                        onChange={(e) => setBusinessQuery(e.target.value)}
                        className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink font-bold mb-1.5">
                      Kota / Wilayah (Opsional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Contoh: Jakarta Selatan, Surabaya"
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded bg-subtle hover:bg-subtle text-ink font-bold text-xs border border-line transition"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !businessQuery.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {loading ? 'Mencari di Google Maps...' : 'Cari Listing Google'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 3: Pick Listing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink tracking-tight">
                    Pilih Lokasi Google
                  </h2>
                  <p className="text-xs text-ink mt-1">
                    Pilih lokasi yang tepat dari hasil pencarian Google
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-ink bg-subtle hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Ubah Pencarian
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {places.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => handleSelectPlace(place)}
                    disabled={loading}
                    className="w-full text-left p-4 rounded bg-surface hover:bg-subtle border border-line hover:border-action transition group flex items-start gap-3.5 shadow-sm"
                  >
                    <MapPin className="w-5 h-5 text-action shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-ink text-sm group-hover:text-action-hover truncate">
                        {place.name}
                      </div>
                      <div className="text-xs text-ink mt-0.5 line-clamp-2">
                        {place.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded bg-subtle hover:bg-subtle text-ink font-bold text-xs border border-line transition"
              >
                ← Kembali ke Form Pencarian
              </button>
            </div>
          )}

          {/* STEP 4: Account Creation / Sign in */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink tracking-tight">
                    Buat Akun Pemilik Bisnis
                  </h2>
                  <p className="text-xs text-ink mt-1">
                    Untuk mengelola kartu ulasan dan melihat analitik pelanggan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(setupMode === 'direct' ? 2 : 3)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-ink bg-subtle hover:bg-subtle border border-line px-3 py-1.5 rounded transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>
              </div>

              {selectedPlace && (
                <div className="p-3.5 bg-surface border border-line rounded text-xs flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-action shrink-0" />
                  <span className="text-ink truncate font-bold">{selectedPlace.name}</span>
                </div>
              )}

              <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-ink font-bold mb-1.5">
                    Nama Anda *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nama pemilik / manajer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1.5">
                    Alamat Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="email@bisnis.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1.5">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(setupMode === 'direct' ? 2 : 3)}
                    className="w-1/3 py-3 rounded bg-subtle hover:bg-subtle text-ink font-bold text-xs border border-line transition"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {loading ? 'Menghubungkan...' : 'Simpan & Aktifkan Kartu'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Payment / Subscription */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded bg-action/20 border border-action/50 flex items-center justify-center text-action mx-auto shadow-lg shadow-action/20">
                <CreditCard className="w-8 h-8 text-action" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink tracking-tight">
                  Langganan Kartu AyoReview
                </h2>
                <p className="text-xs text-ink mt-1">
                  Aktifkan pengalihan ulasan instan dan analitik realtime
                </p>
              </div>

              <div className="bg-surface border border-line p-5 rounded text-left space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-ink">Paket Langganan Kartu</span>
                  <span className="text-lg font-black text-success">Rp 49.000<span className="text-xs font-normal text-muted-ink">/bln</span></span>
                </div>
                <ul className="text-xs text-ink space-y-2 pt-2.5 border-t border-line">
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Pengalihan NFC & QR tanpa batas
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Masa tenggang 7 hari jika pembayaran tertunda
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    Laporan analitik ketukan & pemindaian
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleStartSubscription}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {checkoutLoading ? 'Membuka Pembayaran...' : 'Aktifkan Langganan (Stripe)'}
                </button>
                <p className="text-[11px] text-muted-ink text-center">
                  Kartu baru aktif setelah langganan dibayarkan.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Done */}
          {step === 6 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded bg-success flex items-center justify-center text-ink mx-auto shadow-lg shadow-success/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  Kartu AyoReview Anda Siap Digunakan!
                </h2>
                <p className="text-xs sm:text-sm text-ink mt-2 leading-relaxed font-normal">
                  Kartu fisik dengan ID <span className="font-mono text-warning font-bold">{publicId}</span> sekarang tertaut secara permanen. Setiap pelanggan yang mengetap atau memindai akan langsung diarahkan ke form ulasan Google bisnis Anda.
                </p>
              </div>

              <Link
                href="/my"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98]"
              >
                Buka Dasbor Saya
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto text-center text-xs text-muted-ink flex items-center justify-center gap-2 pt-4">
        <ShieldCheck className="w-4 h-4 text-success" />
        <span className="font-medium">Aktivasi Perangkat AyoReview Aman & Terverifikasi</span>
      </footer>
    </div>
  );
}
