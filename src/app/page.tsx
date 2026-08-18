'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Smartphone, 
  QrCode, 
  ArrowRight, 
  Check, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Store,
  MapPin,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const [simulatedCount, setSimulatedCount] = useState(128);
  const [simulatedSource, setSimulatedSource] = useState<'NFC' | 'QR' | null>(null);

  const triggerSimulation = (source: 'NFC' | 'QR') => {
    setSimulatedSource(source);
    setSimulatedCount((prev) => prev + 1);
    setTimeout(() => setSimulatedSource(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/20">
            RT
          </div>
          <span className="font-bold text-white tracking-tight text-base">
            ReviewTap
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#hardware" className="hover:text-white transition">Physical Stand</a>
          <a href="#placements" className="hover:text-white transition">Placement Guide</a>
          <a href="#pilot" className="hover:text-white transition">Pilot Program</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
          >
            Get ReviewTap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 sm:px-12 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Physical-to-Digital Review Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] max-w-3xl mb-6">
          Turn happy customers into Google reviews.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-8">
          Customers simply tap or scan your ReviewTap card and go directly to your Google review page — with real-time interaction analytics behind every card.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-16">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Deploy ReviewTap in Your Venue
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm border border-zinc-800 transition flex items-center justify-center gap-2"
          >
            Explore Live Merchant Demo
          </Link>
        </div>

        {/* Live Interactive Simulation Widget */}
        <div className="w-full max-w-4xl bg-[#121215] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* 3D Simulated Physical Stand */}
            <div className="w-64 bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center shrink-0">
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-1.5">
                ★★★★★
              </div>
              <h4 className="text-white font-bold text-xs tracking-tight mb-1">
                Enjoyed your visit?
              </h4>
              <p className="text-zinc-400 text-[10px] mb-3">
                Tap phone or scan code
              </p>

              {/* QR frame */}
              <div className="p-3 bg-white rounded-xl shadow-inner mb-3">
                <div className="w-28 h-28 bg-zinc-950 rounded-lg p-2 flex flex-col items-center justify-center text-white">
                  <QrCode className="w-16 h-16 text-white" />
                  <span className="text-[8px] text-zinc-400 font-mono mt-1">Scan Me</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-[9px] text-zinc-500 font-mono pt-2 border-t border-zinc-800">
                <span>RT-000101</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <Smartphone className="w-3 h-3" /> NFC Tap
                </span>
              </div>
            </div>

            {/* Interactive Live Control Panel */}
            <div className="flex-1 text-left space-y-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Interactive Simulator
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1.5">
                  Experience the sub-second customer flow
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Click either action to simulate a customer in your cafe or clinic tapping or scanning the physical stand:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => triggerSimulation('NFC')}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold text-xs transition active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" /> Simulate NFC Tap
                </button>
                <button
                  onClick={() => triggerSimulation('QR')}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition active:scale-[0.98]"
                >
                  <QrCode className="w-4 h-4" /> Simulate QR Scan
                </button>
              </div>

              {/* Dynamic Live Counter & Toast */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">Review Page Visits Today</div>
                  <div className="text-2xl font-black text-white">{simulatedCount}</div>
                </div>
                {simulatedSource && (
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-pulse">
                    ✓ Recorded {simulatedSource} visit → Redirected in 82ms!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Three simple steps to 5-star Google reviews
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Eliminate search friction and send customers directly to your Google review form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-base flex items-center justify-center mb-4 border border-emerald-500/20">
                1
              </div>
              <h3 className="font-bold text-white text-base tracking-tight mb-2">
                Place ReviewTap Card
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Place premium acrylic stands at your cashier, dining tables, or entrance lounge where happy customers interact.
              </p>
            </div>

            <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-base flex items-center justify-center mb-4 border border-emerald-500/20">
                2
              </div>
              <h3 className="font-bold text-white text-base tracking-tight mb-2">
                Customer Taps or Scans
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No app installation required. Customers hold any iPhone or Android phone near the card or scan the high-contrast QR.
              </p>
            </div>

            <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-base flex items-center justify-center mb-4 border border-emerald-500/20">
                3
              </div>
              <h3 className="font-bold text-white text-base tracking-tight mb-2">
                Direct to Google Review
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Customer phone instantly opens your Google review star selector. You view real-time visits and card metrics in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware & Dynamic URL Advantage */}
      <section id="hardware" className="py-20 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-tr from-zinc-900 to-[#121215] border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-md">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              The Dynamic Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Change destinations remotely. Never reprint cards.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Traditional printed QR codes break if you change review profiles or URLs. ReviewTap routes every tap through our sub-second redirect infrastructure so you can update destinations anytime from your phone.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Remotely reassign cards to new branches
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Measure which table or cashier performs best
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> High-durability waterproof acrylic stands
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center w-full sm:w-80 shadow-xl space-y-4">
            <div className="flex justify-center text-amber-400 text-xl">
              ★★★★★
            </div>
            <div className="text-xs font-mono text-zinc-400">
              reviewtap.id/q/X8W91K
            </div>
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] text-zinc-300">
              ⚡ Instant 302 Redirect &lt; 100ms
            </div>
            <Link
              href="/onboarding"
              className="w-full inline-block py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition"
            >
              Order Prototype Stands
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Strategy Section */}
      <section id="placements" className="py-20 px-6 sm:px-12 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Where to place your review cards
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Based on empirical pilot data across Indonesian restaurants, barbershops, and clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Rank #1 · Highest Conversion
              </div>
              <h3 className="text-lg font-bold text-white">Cashier & POS Counter</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Customers wait 15–45 seconds while paying or receiving their receipt. Staff can naturally say &quot;Feel free to tap for a review!&quot;
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Rank #2 · Long Dwell Time
              </div>
              <h3 className="text-lg font-bold text-white">Dining Tables & Booths</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Placed next to the condiment rack or napkin holder. Customers browse and tap while relaxing after their meal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Rank #3 · First Impression
              </div>
              <h3 className="text-lg font-bold text-white">Entrance / Host Stand</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Great for salons, dental clinics, and boutiques as customers exit or wait for their appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot CTA Footer */}
      <footer id="pilot" className="py-16 px-6 sm:px-12 border-t border-zinc-800/80 bg-zinc-950 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to grow your Google reviews?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Join the ReviewTap commercial pilot program. Start collecting measurable in-store reviews in 3 minutes.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              Start Free Setup
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800 transition"
            >
              Merchant Login
            </Link>
          </div>
          <div className="text-[11px] text-zinc-400 pt-8 border-t border-zinc-900">
            © 2026 ReviewTap. Smart NFC & QR Review Infrastructure.
          </div>
        </div>
      </footer>
    </div>
  );
}
