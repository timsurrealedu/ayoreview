'use client';

import { QrCode, Smartphone } from 'lucide-react';

type SourceSplitProps = {
  qrTotal: number;
  nfcTotal: number;
  qrPercentage: number;
  nfcPercentage: number;
};

export function SourceSplitCard({
  qrTotal,
  nfcTotal,
  qrPercentage,
  nfcPercentage,
}: SourceSplitProps) {
  const total = qrTotal + nfcTotal;
  const hasData = total > 0;

  const displayQrPct = hasData ? `${qrPercentage}%` : '—%';
  const displayNfcPct = hasData ? `${nfcPercentage}%` : '—%';

  return (
    <div className="bg-surface border border-line rounded p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-ink tracking-tight">
            Sumber Interaksi
          </h3>
          <span className="text-[11px] font-semibold text-ink bg-subtle px-2 py-0.5 rounded border border-line">
            QR vs NFC
          </span>
        </div>
        <p className="text-xs text-ink mb-5">
          Perbandingan cara pelanggan memberi ulasan di tempat usaha
        </p>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-subtle rounded-full overflow-hidden flex mb-5 border border-line">
          {hasData ? (
            <>
              <div
                style={{ width: `${qrPercentage}%` }}
                className="bg-[#34a853] h-full transition-all duration-500"
                title={`QR: ${qrPercentage}%`}
              />
              <div
                style={{ width: `${nfcPercentage}%` }}
                className="bg-[#1a73e8] h-full transition-all duration-500"
                title={`NFC: ${nfcPercentage}%`}
              />
            </>
          ) : (
            <div className="w-full bg-subtle h-full" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-line">
        {/* QR Box */}
        <div className="p-3.5 rounded bg-surface/90 border border-line space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#34a853]" /> Scan QR
            </span>
            <span className="text-xs font-black text-[#34a853]">{displayQrPct}</span>
          </div>
          <div className="text-base font-black text-ink">
            {qrTotal.toLocaleString()} <span className="text-xs font-normal text-muted-ink">pindaian</span>
          </div>
        </div>

        {/* NFC Box */}
        <div className="p-3.5 rounded bg-surface/90 border border-line space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#1a73e8]" /> Tap NFC
            </span>
            <span className="text-xs font-black text-[#1a73e8]">{displayNfcPct}</span>
          </div>
          <div className="text-base font-black text-ink">
            {nfcTotal.toLocaleString()} <span className="text-xs font-normal text-muted-ink">ketukan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
