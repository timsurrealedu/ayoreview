'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  Mail, 
  User, 
  Loader2 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PlaceSearchResult } from '@/lib/types';

export default function CardSetupPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = typeof params.publicId === 'string' ? params.publicId : '';

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [businessQuery, setBusinessQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);

  // Account state
  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Link state
  const [isLinked, setIsLinked] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        setEmail(data.user.email || '');
        setName(data.user.user_metadata?.name || data.user.email?.split('@')[0] || '');
      }
    });
  }, []);

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
        setError('Tidak ditemukan tempat yang cocok. Coba ubah nama atau kota.');
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
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // If Stripe not configured or in trial mode, proceed to done
        setStep(6);
      }
    } catch (err) {
      console.error(err);
      setStep(6);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 font-sans">
      {/* Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#1a73e8]/30">
            AR
          </div>
          <span className="font-bold text-white tracking-tight text-base">AyoReview Setup</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-700">
          ID: {publicId}
        </span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-lg mx-auto my-auto py-8">
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/30 flex items-center justify-center text-[#1a73e8] mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Aktifkan Kartu AyoReview Anda
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  Anda baru saja memindai kartu pintar AyoReview. Hubungkan kartu ini ke profil Google Bisnis Anda dalam hitungan detik.
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl text-left space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
                  Langsung terhubung ke Google Review Form
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
                  Mendukung Tap NFC dan Scan QR
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
                  Garansi masa tenggang 7 hari pembayaran
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98]"
              >
                Mulai Hubungkan Bisnis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Business Search */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Cari Tempat Bisnis Anda
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Ketik nama bisnis seperti yang tertera di Google Maps
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Nama Bisnis *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kopi Kenangan, Salon Indah"
                      value={businessQuery}
                      onChange={(e) => setBusinessQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Kota / Wilayah (Opsional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta Selatan, Surabaya"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !businessQuery.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? 'Mencari di Google Places...' : 'Cari Listing Google'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Pick Listing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Pilih Lokasi Google Anda
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1">
                    Pilih listing Google Maps yang tepat untuk kartu ini
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-[#1a73e8] hover:text-[#4285f4] hover:underline"
                >
                  Ubah Pencarian
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {places.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => handleSelectPlace(place)}
                    disabled={loading}
                    className="w-full text-left p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-[#1a73e8] transition group flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-xs group-hover:text-[#4285f4] truncate">
                        {place.name}
                      </div>
                      <div className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">
                        {place.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Account Creation / Sign in */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Buat Akun Pemilik Bisnis
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Untuk mengelola kartu ulasan dan melihat analitik pelanggan
                </p>
              </div>

              {selectedPlace && (
                <div className="p-3 bg-zinc-900 border border-zinc-750 rounded-xl text-xs flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1a73e8] shrink-0" />
                  <span className="text-zinc-200 truncate font-medium">{selectedPlace.name}</span>
                </div>
              )}

              <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Nama Anda *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nama pemilik / manajer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Alamat Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="email@bisnis.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-200 font-semibold mb-1.5">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {loading ? 'Menghubungkan...' : 'Lanjutkan ke Pembayaran'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 5: Payment / Subscription */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/30 flex items-center justify-center text-[#1a73e8] mx-auto">
                <CreditCard className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Langganan Kartu AyoReview
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Aktifkan pengalihan ulasan instan dan analitik realtime
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-xl text-left space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Paket Langganan Kartu</span>
                  <span className="text-lg font-black text-[#34a853]">Rp 49.000<span className="text-xs font-normal text-zinc-400">/bln</span></span>
                </div>
                <ul className="text-xs text-zinc-200 space-y-2 pt-2.5 border-t border-zinc-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853] shrink-0" />
                    Pengalihan NFC & QR tanpa batas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853] shrink-0" />
                    Masa tenggang 7 hari jika pembayaran tertunda
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853] shrink-0" />
                    Laporan analitik ketukan & pemindaian
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleStartSubscription}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {checkoutLoading ? 'Membuka Pembayaran...' : 'Aktifkan Langganan (Stripe)'}
                </button>

                <button
                  onClick={() => setStep(6)}
                  className="w-full py-2.5 text-xs text-zinc-300 hover:text-white transition"
                >
                  Lewati untuk saat ini (Uji Coba) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Done */}
          {step === 6 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#34a853] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#34a853]/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Kartu AyoReview Anda Siap Digunakan!
                </h2>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  Kartu ini sekarang tertaut secara permanen. Setiap pelanggan yang mengetap atau memindai akan langsung diarahkan ke ulasan Google bisnis Anda.
                </p>
              </div>

              <Link
                href="/my"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98]"
              >
                Buka Dasbor Saya
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Aktivasi Perangkat AyoReview Aman & Terverifikasi</span>
      </footer>
    </div>
  );
}
