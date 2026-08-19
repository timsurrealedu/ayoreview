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
  const [category, setCategory] = useState('Cafe & Specialty Coffee');
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
      const loc = await (await fetch('/api/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ business_id: biz.data.id, name: locationName, address: address || 'Store Front', city: city || 'Main City', country: country || 'Indonesia', google_maps_url: googleMapsUrl || undefined, google_review_url: googleReviewUrl }) })).json();
      if (!loc.success) throw new Error(loc.error);
      const card = await (await fetch('/api/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location_id: loc.data.id, name: cardName, placement }) })).json();
      if (!card.success) throw new Error(card.error);
      setCreatedCard(card.data); setStep(5);
    } catch (err: any) { setErrorMsg(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#08080b] text-zinc-100 flex flex-col font-sans">
      <header className="h-16 border-b border-zinc-800/60 px-6 flex items-center justify-between bg-[#08080b]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-xs">RT</div>
          <span className="font-bold text-white text-sm">ReviewTap</span>
        </Link>
        <div className="text-[11px] text-zinc-400 font-mono">Step {step} of 5</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg w-full mx-auto">
        {/* Progress dots */}
        <div className="w-full mb-10">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === step ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25 scale-110' :
                s < step ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}>
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div style={{ width: `${(step / 5) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1.5 font-medium">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>Business</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>Location</span>
            <span className={step >= 3 ? 'text-emerald-400' : ''}>Review Link</span>
            <span className={step >= 4 ? 'text-emerald-400' : ''}>Card Setup</span>
            <span className={step >= 5 ? 'text-emerald-400' : ''}>Your QR Code</span>
          </div>
        </div>

        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Step 1: Business */}
        {step === 1 && (
          <div className="w-full bg-[#111115] border border-zinc-800/80 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3"><Building2 className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Name your business</h2>
              <p className="text-xs text-zinc-400 mt-1">This will be the brand your review cards belong to.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Business Name *</label>
                <input type="text" required placeholder="e.g. Kopi Contoh, Salon Cantik" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                  <option value="Cafe & Specialty Coffee">Cafe &amp; Specialty Coffee</option>
                  <option value="Restaurant & Dining">Restaurant &amp; Dining</option>
                  <option value="Barbershop & Salon">Barbershop &amp; Salon</option>
                  <option value="Dental & Medical Clinic">Dental &amp; Medical Clinic</option>
                  <option value="Retail Boutique">Retail Boutique</option>
                  <option value="Other Local Business">Other Local Business</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">City *</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button onClick={() => setStep(2)} disabled={!businessName}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="w-full bg-[#111115] border border-zinc-800/80 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3"><MapPin className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Add your location</h2>
              <p className="text-xs text-zinc-400 mt-1">Where will your physical review cards be placed?</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Branch Name *</label>
                <input type="text" required placeholder="e.g. Kemanggisan Flagship" value={locationName} onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Address</label>
                <input type="text" placeholder="e.g. Jl. Kemanggisan Raya No. 12" value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <button onClick={() => setStep(3)} disabled={!locationName}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Google Review Link */}
        {step === 3 && (
          <div className="w-full bg-[#111115] border border-zinc-800/80 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-amber-400 mb-3"><Star className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Paste your Google Review link</h2>
              <p className="text-xs text-zinc-400 mt-1">This is the destination customers reach when they tap or scan your card. You can change this later.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Google Review URL *</label>
                <input type="url" required placeholder="https://g.page/r/.../review" value={googleReviewUrl} onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500" />
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl mt-3 text-[11px] text-zinc-400 space-y-1">
                  <div className="font-semibold text-zinc-300">How to get your link:</div>
                  <div>1. Open Google Maps → find your business</div>
                  <div>2. Click &quot;Share&quot; → &quot;Copy link&quot;</div>
                  <div>3. Paste above. You can change it anytime!</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <button onClick={() => setStep(4)} disabled={!googleReviewUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Card Setup */}
        {step === 4 && (
          <div className="w-full bg-[#111115] border border-zinc-800/80 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3"><CreditCard className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create your first review card</h2>
              <p className="text-xs text-zinc-400 mt-1">Name it after where it sits in your venue.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Card Name *</label>
                <input type="text" required placeholder="e.g. Kasir 01, Table 04" value={cardName} onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Placement</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value as CardPlacement)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                  <option value="cashier">Cashier / POS (Highest Conversion)</option>
                  <option value="table">Dining Table / Booth</option>
                  <option value="entrance">Main Entrance / Host Stand</option>
                  <option value="counter">Barista / Service Counter</option>
                  <option value="waiting_area">Waiting Lounge</option>
                  <option value="receipt">Bill Clip</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button onClick={() => setStep(3)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <button onClick={handleFinish} disabled={loading || !cardName}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate QR Code'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: QR Code Ready! */}
        {step === 5 && createdCard && (
          <div className="w-full text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Your QR Code is ready!</h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Your first review card has been provisioned. Download the QR code below and print it for your acrylic stand.
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
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25">
                Go to Dashboard
              </Link>
              <Link href="/dashboard/cards"
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm border border-zinc-800 transition-colors">
                View All Cards
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}