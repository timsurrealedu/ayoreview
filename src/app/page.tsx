// THESIS: ReviewTap decouples physical hardware from its digital destination.
// OWN-WORLD: Near-black canvas, emerald-amber-teal palette, tight tracking on display type.
// STORY: A venue owner tired of reprinting QR codes discovers they can print once and update forever.
// FIRST VIEWPORT: Left headline "Print once. Update forever." + CTAs. Right: live card preview.
// FORM: surface concept for a Persuade landing, seed 7c3f, built code-led.
// FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review.
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, RefreshCw, QrCode, Smartphone, Store, MapPin, TrendingUp, Zap, Edit3 } from 'lucide-react';

export default function LandingPage() {
  const [demoUrl, setDemoUrl] = useState('https://g.page/r/your-business/review');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [demoCount, setDemoCount] = useState(128);
  const simulateTap = useCallback(() => { setDemoCount((p) => p + 1); }, []);

  return (
    <div className="min-h-screen bg-[#08080b] text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Nav */}
      <nav className="h-16 border-b border-zinc-800/60 bg-[#08080b]/90 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">RT</div>
          <span className="font-bold text-white tracking-tight text-base">ReviewTap</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-white">How It Works</a>
          <a href="#dynamic" className="hover:text-white">Dynamic Redirect</a>
          <a href="#placements" className="hover:text-white">Placements</a>
          <a href="#pilot" className="hover:text-white">Pilot Program</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5">Sign In</Link>
          <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.97]">
            Start Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-24 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Zap className="w-3.5 h-3.5" /> <span>Physical-to-Digital Review Infrastructure</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] leading-[1.06]">
              Print once.<br />
              <span className="text-emerald-400">Update forever.</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed">
              One NFC or QR card for your venue — change the Google Review destination anytime from your phone. No reprinting, no wasted hardware.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link href="/signup" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.97]">
                Create Free QR Code <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm border border-zinc-800">See How It Works</a>
            </div>
            <div className="flex items-center gap-4 pt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> No app install</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> 3-minute setup</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Free pilot</span>
            </div>
          </div>

          {/* Live Demo */}
          <div className="bg-[#111115] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Live Demo</span>
              <span className="text-[10px] text-zinc-500 font-mono">{demoCount} redirects today</span>
            </div>
            <div className="w-full max-w-[260px] mx-auto bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center mb-5">
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-2">★★★★★</div>
              <h4 className="text-white font-bold text-xs tracking-tight mb-1">Enjoyed your visit?</h4>
              <p className="text-zinc-400 text-[10px] mb-4">Tap phone or scan code</p>
              <div className="p-3 bg-white rounded-xl shadow-inner mb-3">
                <div className="w-32 h-32 bg-zinc-950 rounded-lg p-2 flex flex-col items-center justify-center">
                  <QrCode className="w-16 h-16 text-white" />
                  <span className="text-[8px] text-zinc-400 font-mono mt-1">Scan Me</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-between text-[9px] text-zinc-500 font-mono pt-2 border-t border-zinc-800">
                <span>RT-000101</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans"><Smartphone className="w-3 h-3" /> NFC</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-zinc-900/90 px-3 py-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 font-mono text-[10px]">reviewtap.id/q/a7Xk29</span>
                <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> 302 → Google</span>
              </div>
              <div className="bg-zinc-900/60 px-3 py-2.5 rounded-lg border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Edit3 className="w-3 h-3" /> Destination</span>
                  <button onClick={() => setShowUrlInput(!showUrlInput)} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Change
                  </button>
                </div>
                {showUrlInput ? (
                  <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500" placeholder="https://g.page/r/..." />
                ) : (
                  <div className="text-[10px] font-mono text-zinc-300 truncate">{demoUrl}</div>
                )}
                {showUrlInput && <div className="text-[10px] text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Cards update instantly</div>}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={simulateTap} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold text-xs transition active:scale-[0.97]">
                  <Smartphone className="w-4 h-4" /> Tap (NFC)
                </button>
                <button onClick={simulateTap} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition active:scale-[0.97]">
                  <QrCode className="w-4 h-4" /> Scan (QR)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC ADVANTAGE */}
      <section id="dynamic" className="py-20 px-6 sm:px-10 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#0f1215] to-[#111115] border border-zinc-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em]">The Dynamic Advantage</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em]">
                Change destinations remotely.{' '}
                <span className="text-emerald-400">Never reprint cards.</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional printed QR codes break if you change review profiles or URLs. ReviewTap routes every tap through our sub-second redirect infrastructure so you can update destinations anytime from your phone.
              </p>
              <ul className="space-y-2.5 text-sm text-zinc-300">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> Remotely reassign cards to new branches or URLs</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> Measure which table, cashier, or entrance performs best</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> High-durability acrylic stands — waterproof and restaurant-grade</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center w-full sm:w-80 mx-auto shadow-xl space-y-4">
              <div className="flex justify-center text-amber-400 text-xl">★★★★★</div>
              <div className="text-xs font-mono text-zinc-400">reviewtap.id/q/X8W91K</div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] text-zinc-300">⚡ Instant 302 Redirect &lt; 100ms</div>
              <Link href="/signup" className="w-full inline-block py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition text-center">Create Your Free QR Code</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENTS */}
      <section id="placements" className="py-20 px-6 sm:px-10 border-t border-zinc-800/60 bg-[#0c0c10]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-3">Placement Guide</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em]">Where to put your review cards</h2>
            <p className="text-sm text-zinc-400 mt-2">Based on empirical pilot data across Indonesian restaurants, barbershops, and clinics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111115] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Rank #1 · Highest Conversion</div>
              <h3 className="text-lg font-bold text-white">Cashier &amp; POS Counter</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Customers wait 15-45 seconds while paying or receiving their receipt. Staff can naturally say "Feel free to tap for a review!"</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#111115] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Rank #2 · Long Dwell Time</div>
              <h3 className="text-lg font-bold text-white">Dining Tables &amp; Booths</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Placed next to the condiment rack or napkin holder. Customers browse and tap while relaxing after their meal.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#111115] border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rank #3 · First Impression</div>
              <h3 className="text-lg font-bold text-white">Entrance / Host Stand</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Great for salons, dental clinics, and boutiques as customers exit or wait for their appointment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILOT CTA */}
      <footer id="pilot" className="py-16 px-6 sm:px-10 border-t border-zinc-800/60 bg-zinc-950 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em]">Ready to grow your Google reviews?</h2>
          <p className="text-sm text-zinc-400">Join the ReviewTap commercial pilot program. Start collecting measurable in-store reviews in 3 minutes.</p>
          <div className="flex justify-center gap-3">
            <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.97]">
              Create Free QR Code
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm border border-zinc-800 transition-colors">
              Merchant Login
            </Link>
          </div>
          <div className="text-[11px] text-zinc-500 pt-8 border-t border-zinc-900">© 2026 ReviewTap. Smart NFC &amp; QR Review Infrastructure.</div>
        </div>
      </footer>
    </div>
  );
}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 sm:px-10 border-t border-zinc-800/60 bg-[#0c0c10]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-3">Three Steps</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-[-0.02em]">From box to 5-star review in 3 minutes</h2>
            <p className="text-sm text-zinc-400 mt-2">No developer, no design skills. Just your Google Review link and a physical stand.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: Store, title: 'Create Your Card', desc: 'Sign up, name your venue, paste your Google Review link. We generate a unique QR + NFC redirect instantly.' },
              { num: '02', icon: MapPin, title: 'Place the Stand', desc: 'Print or order acrylic stands for your cashier, tables, or entrance. The QR encodes a managed redirect — not a static URL.' },
              { num: '03', icon: TrendingUp, title: 'Watch Reviews Roll In', desc: 'Customers tap or scan and land on your Google Review page in under 100ms. Track every interaction in your dashboard.' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:border-zinc-700/80 transition-colors group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{s.num}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors"><Icon className="w-4 h-4" /></div>
                  </div>
                  <h3 className="font-bold text-white text-base tracking-tight mb-2">{s.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>