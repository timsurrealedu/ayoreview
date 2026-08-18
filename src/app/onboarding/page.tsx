'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Star, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CardPlacement } from '@/lib/types';
import { QrPreviewModal } from '@/components/ui/qr-preview';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('Kopi Contoh');
  const [category, setCategory] = useState('Cafe & Specialty Coffee');
  const [city, setCity] = useState('Jakarta Barat');
  const [country, setCountry] = useState('Indonesia');

  const [locationName, setLocationName] = useState('Kemanggisan Branch');
  const [address, setAddress] = useState('Jl. Kemanggisan Raya No. 12');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com');

  const [googleReviewUrl, setGoogleReviewUrl] = useState('https://g.page/r/example-kopi-kemanggisan/review');

  const [cardName, setCardName] = useState('Kasir 01');
  const [placement, setPlacement] = useState<CardPlacement>('cashier');

  const [createdCard, setCreatedCard] = useState<any>(null);

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // 1. Create Business
      const bizRes = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: businessName, category }),
      });
      const bizJson = await bizRes.json();
      const businessId = bizJson.data?.id;

      // 2. Create Location
      const locRes = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          name: locationName,
          address,
          city,
          country,
          google_maps_url: googleMapsUrl,
          google_review_url: googleReviewUrl,
        }),
      });
      const locJson = await locRes.json();
      const locationId = locJson.data?.id;

      // 3. Create Card
      const cardRes = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_id: locationId,
          name: cardName,
          placement,
        }),
      });
      const cardJson = await cardRes.json();
      setCreatedCard(cardJson.data);
      setStep(5);
    } catch (err) {
      console.error('Onboarding failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-xs">
            RT
          </div>
          <span className="font-bold text-white text-sm">ReviewTap</span>
        </Link>
        <div className="text-xs text-zinc-400">
          Step {step} of 5 · Fast Merchant Setup
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-[11px] font-semibold text-zinc-400 mb-2">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>1. Business</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>2. Location</span>
            <span className={step >= 3 ? 'text-emerald-400' : ''}>3. Review URL</span>
            <span className={step >= 4 ? 'text-emerald-400' : ''}>4. First Card</span>
            <span className={step >= 5 ? 'text-emerald-400' : ''}>5. Ready</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 5) * 100}%` }}
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            />
          </div>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="w-full bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add your business
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Tell us about your brand or store entity.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kopi Contoh, Salon Cantik, Bakmi ABC"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Business Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cafe & Specialty Coffee">Cafe & Specialty Coffee</option>
                  <option value="Restaurant & Dining">Restaurant & Dining</option>
                  <option value="Barbershop & Salon">Barbershop & Salon</option>
                  <option value="Dental & Medical Clinic">Dental & Medical Clinic</option>
                  <option value="Retail Boutique">Retail Boutique</option>
                  <option value="Gym & Fitness">Gym & Fitness</option>
                  <option value="Auto Repair & Detailing">Auto Repair & Detailing</option>
                  <option value="Other Local Business">Other Local Business</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!businessName}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                Continue to Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="w-full bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add your physical store location
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Where will the physical NFC & QR cards be placed?
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Location / Branch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kemanggisan Flagship, Grand Indonesia Branch"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jl. Kemanggisan Raya No. 12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!locationName}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                Continue to Review URL <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Google Review Link */}
        {step === 3 && (
          <div className="w-full bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add your Google Review link
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                This is the exact destination customers will reach when they tap or scan.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Google Review URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://g.page/r/.../review or https://maps.app.goo.gl/..."
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl mt-3 text-[11px] text-zinc-400 space-y-1">
                  <div className="font-semibold text-zinc-300">How to get your Google Review link:</div>
                  <div>1. Open Google Maps and search for your business.</div>
                  <div>2. Click &quot;Ask for reviews&quot; or share your review profile link.</div>
                  <div>3. Paste the URL above. You can change this link anytime later!</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!googleReviewUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                Continue to First Card <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: First Review Card */}
        {step === 4 && (
          <div className="w-full bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6">
            <div>
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Create your first review card
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Assign this card to a specific physical zone in your venue.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Card Name / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasir 01, Main Counter, Table 01"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Placement Type *
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as CardPlacement)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="cashier">Cashier / POS (Highest Interaction Rate)</option>
                  <option value="table">Dining Table / Booth</option>
                  <option value="entrance">Main Entrance / Host Stand</option>
                  <option value="counter">Barista / Service Counter</option>
                  <option value="waiting_area">Waiting Lounge</option>
                  <option value="receipt">Bill Clip</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={loading || !cardName}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Generating Card...' : 'Generate Card & Finish'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Test & Ready */}
        {step === 5 && createdCard && (
          <div className="w-full bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-1 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Your ReviewTap setup is ready!
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Your first smart review card has been provisioned with dynamic QR & NFC routing.
              </p>
            </div>

            {/* Simulated Live Card */}
            <div className="py-2">
              <QrPreviewModal
                publicId={createdCard.public_id}
                name={createdCard.name}
                locationName={locationName}
                inventoryCode={createdCard.inventory_code}
              />
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
              >
                Go to Merchant Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
