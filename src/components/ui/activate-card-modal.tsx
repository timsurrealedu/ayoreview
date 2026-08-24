'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, QrCode } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export function ActivateCardModal({ triggerClassName }: { triggerClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardCode, setCardCode] = useState('');
  const router = useRouter();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cardCode.trim().replace(/^AR-/i, '');
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
        <QrCode className="w-3.5 h-3.5 text-action" />
        <span>Aktivasi Kartu Fisik</span>
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Aktivasi Kartu AyoReview">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-action/20 border border-action/50 flex items-center justify-center text-action">
            <Sparkles className="w-5 h-5 text-action" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-base">Aktivasi Kartu AyoReview</h3>
            <p className="text-xs text-muted-ink">Masukkan ID kartu fisik yang Anda miliki</p>
          </div>
        </div>

        <form onSubmit={handleActivate} className="space-y-4 text-xs">
          <div>
            <label htmlFor="activate-card-code" className="block text-ink font-bold mb-1.5">
              ID Kartu / Kode Inventaris *
            </label>
            <div className="relative">
              <QrCode className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="activate-card-code"
                type="text"
                required
                autoFocus
                placeholder="Contoh: demo101 atau RT-000101"
                value={cardCode}
                onChange={(e) => setCardCode(e.target.value)}
                className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-mono text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
              />
            </div>
            <p className="text-[11px] text-muted-ink mt-1.5">
              Tips: ID tertera di bagian belakang kartu atau di tautan QR (misal: /q/<span className="text-warning font-semibold">demo101</span>).
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
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded bg-action hover:bg-action-hover text-white font-bold text-xs transition shadow-lg shadow-action/20 active:scale-[0.98] disabled:opacity-50"
            >
              Buka Setup Wizard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
