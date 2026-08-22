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
    <div className="bg-[#121215] border border-zinc-750 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Sumber Interaksi
          </h3>
          <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-700">
            QR vs NFC
          </span>
        </div>
        <p className="text-xs text-zinc-300 mb-5">
          Perbandingan cara pelanggan memberi ulasan di tempat usaha
        </p>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex mb-5 border border-zinc-750">
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
            <div className="w-full bg-zinc-800 h-full" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
        {/* QR Box */}
        <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-750 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#34a853]" /> Scan QR
            </span>
            <span className="text-xs font-black text-[#34a853]">{displayQrPct}</span>
          </div>
          <div className="text-base font-black text-white">
            {qrTotal.toLocaleString()} <span className="text-xs font-normal text-zinc-400">pindaian</span>
          </div>
        </div>

        {/* NFC Box */}
        <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-750 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#1a73e8]" /> Tap NFC
            </span>
            <span className="text-xs font-black text-[#1a73e8]">{displayNfcPct}</span>
          </div>
          <div className="text-base font-black text-white">
            {nfcTotal.toLocaleString()} <span className="text-xs font-normal text-zinc-400">ketukan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
