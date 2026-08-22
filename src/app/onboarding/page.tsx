'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Star, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Smartphone, Sparkles, QrCode } from 'lucide-react';
import { CardPlacement } from '@/lib/types';
import { QrPreviewModal } from '@/components/ui/qr-preview';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Kafe & Kopi Spesialti');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [cardName, setCardName] = useState('Kasir 01');
  const [placement, setPlacement] = useState<CardPlacement>('cashier');
  const [createdCard, setCreatedCard] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFinish = async () => {
    setLoading(true); setErrorMsg(null);
    try {
      const biz = await (await fetch('/api/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: businessName, category }) })).json();
      if (!biz.success) throw new Error(biz.error);
      const loc = await (await fetch('/api/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ business_id: biz.data.id, name: locationName, address: address || 'Bagian Depan Toko', city: city || 'Kota Utama', country: country || 'Indonesia', google_maps_url: googleMapsUrl || undefined, google_review_url: googleReviewUrl }) })).json();
      if (!loc.success) throw new Error(loc.error);
      const card = await (await fetch('/api/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location_id: loc.data.id, name: cardName, placement }) })).json();
      if (!card.success) throw new Error(card.error);
      setCreatedCard(card.data); setStep(5);
    } catch (err: any) { setErrorMsg(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#08080b] text-ink flex flex-col font-sans">
      <header className="h-16 border-b border-line px-6 flex items-center justify-between bg-[#08080b]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[conic-gradient(from_25deg,#ea4335_0_25%,#fbbc04_0_50%,#34a853_0_75%,#1a73e8_0)] flex items-center justify-center text-ink font-black text-xs ring-4 ring-white/30 ring-inset">
            A
          </div>
          <span className="font-bold text-ink text-base tracking-tight">AyoReview</span>
        </Link>
        <div className="text-[11px] text-ink font-mono font-semibold">Langkah {step} dari 5</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg w-full mx-auto">
        {/* Progress dots */}
        <div className="w-full mb-10">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === step ? 'bg-[#1a73e8] text-white shadow-lg shadow-[#1a73e8]/25 scale-110' :
                s < step ? 'bg-[#34a853]/20 text-[#34a853] border border-[#34a853]/40' :
                'bg-surface text-muted-ink border border-line'
              }`}>
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden">
            <div style={{ width: `${(step / 5) * 100}%` }} className="h-full bg-[#1a73e8] transition-all duration-500 rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-ink mt-2 font-medium">
            <span className={step >= 1 ? 'text-[#1a73e8] font-bold' : ''}>Bisnis</span>
            <span className={step >= 2 ? 'text-[#1a73e8] font-bold' : ''}>Lokasi</span>
            <span className={step >= 3 ? 'text-[#1a73e8] font-bold' : ''}>Tautan Ulasan</span>
            <span className={step >= 4 ? 'text-[#1a73e8] font-bold' : ''}>Pengaturan Kartu</span>
            <span className={step >= 5 ? 'text-[#1a73e8] font-bold' : ''}>Kode QR Anda</span>
          </div>
        </div>

        {errorMsg && (
          <div role="alert" aria-live="assertive" className="mb-4 flex w-full items-center gap-2 rounded border border-error/25 bg-error-soft p-3.5 text-xs font-semibold text-error">
            <Sparkles className="h-4 w-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Step 1: Business */}
        {step === 1 && (
          <div className="w-full bg-surface border border-line rounded p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded bg-[#1a73e8]/10 text-[#1a73e8] mb-3"><Building2 className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-ink tracking-tight">Beri nama bisnis Anda</h2>
              <p className="text-xs text-ink mt-1">Nama ini akan tampil sebagai merek pada kartu ulasan Anda.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1.5">Nama bisnis *</label>
                <input type="text" required placeholder="contoh: Kopi Kenangan, Salon Cantik" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
              </div>
              <div>
                <label className="block text-ink font-semibold mb-1.5">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-2.5 text-ink focus:outline-none focus:border-[#1a73e8]">
                  <option value="Kafe & Kopi Spesialti">Kafe &amp; Kopi Spesialti</option>
                  <option value="Restoran & Kuliner">Restoran &amp; Kuliner</option>
                  <option value="Barbershop & Salon">Barbershop &amp; Salon</option>
                  <option value="Klinik Gigi & Medis">Klinik Gigi &amp; Medis</option>
                  <option value="Butik Ritel">Butik Ritel</option>
                  <option value="Bisnis Lokal Lainnya">Bisnis Lokal Lainnya</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-semibold mb-1.5">Kota *</label>
                  <input type="text" required placeholder="contoh: Jakarta Selatan" value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
                </div>
                <div>
                  <label className="block text-ink font-semibold mb-1.5">Negara</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-surface border border-line rounded px-3.5 py-2.5 text-ink focus:outline-none focus:border-[#1a73e8]" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-line">
              <button onClick={() => setStep(2)} disabled={!businessName}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/25 disabled:opacity-50">
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="w-full bg-surface border border-line rounded p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded bg-[#1a73e8]/10 text-[#1a73e8] mb-3"><MapPin className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-ink tracking-tight">Tambahkan cabang lokasi</h2>
              <p className="text-xs text-ink mt-1">Di mana kartu ulasan fisik Anda akan ditempatkan?</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1.5">Nama cabang *</label>
                <input type="text" required placeholder="contoh: Cabang Utama Senopati" value={locationName} onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
              </div>
              <div>
                <label className="block text-ink font-semibold mb-1.5">Alamat</label>
                <input type="text" placeholder="contoh: Jl. Senopati No. 45" value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-line">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-subtle text-ink text-xs font-medium border border-line"><ArrowLeft className="w-3.5 h-3.5" /> Kembali</button>
              <button onClick={() => setStep(3)} disabled={!locationName}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/25 disabled:opacity-50">
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Google Review Link */}
        {step === 3 && (
          <div className="w-full bg-surface border border-line rounded p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded bg-[#fbbc04]/10 text-[#fbbc04] mb-3"><Star className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-ink tracking-tight">Tempel tautan Ulasan Google Anda</h2>
              <p className="text-xs text-ink mt-1">Pelanggan akan menuju tautan ini saat mengetuk atau memindai kartu. Anda dapat mengubahnya nanti.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1.5">URL Ulasan Google *</label>
                <input type="url" required placeholder="https://g.page/r/.../review atau https://search.google.com/local/writereview?placeid=..." value={googleReviewUrl} onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink font-mono text-xs placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
                <div className="p-3.5 bg-surface border border-line rounded mt-3 text-[11px] text-ink space-y-1.5">
                  <div className="font-semibold text-ink">Cara mendapatkan tautan:</div>
                  <div>1. Buka profil Google Bisnis Anda / Google Maps</div>
                  <div>2. Klik tombol &quot;Minta Ulasan&quot; atau &quot;Bagikan&quot;</div>
                  <div>3. Tempel di kolom atas. Anda dapat mengubahnya kapan saja.</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-line">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-subtle text-ink text-xs font-medium border border-line"><ArrowLeft className="w-3.5 h-3.5" /> Kembali</button>
              <button onClick={() => setStep(4)} disabled={!googleReviewUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/25 disabled:opacity-50">
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Card Setup */}
        {step === 4 && (
          <div className="w-full bg-surface border border-line rounded p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded bg-[#1a73e8]/10 text-[#1a73e8] mb-3"><CreditCard className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-ink tracking-tight">Buat kartu ulasan pertama Anda</h2>
              <p className="text-xs text-ink mt-1">Beri nama sesuai tempat kartu diletakkan.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1.5">Nama kartu *</label>
                <input type="text" required placeholder="contoh: Kasir 01, Meja 04" value={cardName} onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-3 text-ink placeholder:text-muted-ink font-medium focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" />
              </div>
              <div>
                <label className="block text-ink font-semibold mb-1.5">Penempatan</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value as CardPlacement)}
                  className="w-full bg-surface border border-line rounded px-3.5 py-2.5 text-ink focus:outline-none focus:border-[#1a73e8]">
                  <option value="cashier">Kasir / POS (Konversi Tertinggi)</option>
                  <option value="table">Meja makan / Bilik</option>
                  <option value="entrance">Pintu masuk utama / Meja penerima</option>
                  <option value="counter">Barista / Konter layanan</option>
                  <option value="waiting_area">Ruang tunggu</option>
                  <option value="receipt">Penjepit tagihan</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-line">
              <button onClick={() => setStep(3)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-subtle text-ink text-xs font-medium border border-line"><ArrowLeft className="w-3.5 h-3.5" /> Kembali</button>
              <button onClick={handleFinish} disabled={loading || !cardName}
                className="flex items-center gap-2 px-6 py-2.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/25 disabled:opacity-50">
                {loading ? 'Membuat...' : 'Buat Kode QR'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: QR Code Ready! */}
        {step === 5 && createdCard && (
          <div className="w-full text-center space-y-6">
            <div className="inline-flex p-3 rounded bg-[#34a853]/10 text-[#34a853] ring-1 ring-[#34a853]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink tracking-tight">Kode QR Anda siap!</h2>
              <p className="text-xs text-ink mt-1 max-w-md mx-auto">
                Kartu ulasan pertama Anda sudah dibuat. Unduh kode QR di bawah lalu cetak untuk dudukan akrilik Anda.
              </p>
            </div>
            <div className="py-2">
              <QrPreviewModal
                publicId={createdCard.public_id}
                name={createdCard.name}
                locationName={locationName}
                inventoryCode={createdCard.inventory_code}
              />
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/dashboard"
                className="px-6 py-3 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm transition shadow-lg shadow-[#1a73e8]/25">
                Buka Dasbor
              </Link>
              <Link href="/dashboard/cards"
                className="px-6 py-3 rounded bg-surface hover:bg-subtle text-ink font-semibold text-sm border border-line transition-colors">
                Lihat Semua Kartu
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
