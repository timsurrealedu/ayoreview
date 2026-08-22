'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, X, QrCode } from 'lucide-react';

export function ActivateCardModal({ triggerClassName }: { triggerClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardCode, setCardCode] = useState('');
  const router = useRouter();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cardCode.trim().replace(/^AR-/i, '').toLowerCase();
    if (!clean) return;
    setIsOpen(false);
    router.push(`/s/${encodeURIComponent(clean)}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={triggerClassName || "flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-subtle hover:bg-subtle text-ink font-semibold text-xs border border-line transition shadow-sm"}
      >
        <QrCode className="w-3.5 h-3.5 text-[#1a73e8]" />
        <span>Aktivasi Kartu Fisik</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface border border-line rounded p-6 sm:p-7 shadow-2xl space-y-5 text-left">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded text-muted-ink hover:text-ink hover:bg-subtle transition"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#1a73e8]/20 border border-[#1a73e8]/50 flex items-center justify-center text-[#1a73e8]">
                <Sparkles className="w-5 h-5 text-[#4285f4]" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Aktivasi Kartu AyoReview</h3>
                <p className="text-xs text-ink">Masukkan ID kartu fisik yang Anda miliki</p>
              </div>
            </div>

            <form onSubmit={handleActivate} className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-bold mb-1.5">
                  ID Kartu / Kode Inventaris *
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Contoh: demo101 atau AR-000101"
                    value={cardCode}
                    onChange={(e) => setCardCode(e.target.value)}
                    className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-mono text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                  />
                </div>
                <p className="text-[11px] text-muted-ink mt-1.5">
                  💡 Tips: ID tertera di bagian belakang kartu atau di tautan QR (misal: /q/<span className="text-[#fbbc04]">demo101</span>).
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/3 py-3 rounded bg-subtle hover:bg-subtle text-ink font-bold text-xs border border-line transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!cardCode.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  Buka Setup Wizard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
