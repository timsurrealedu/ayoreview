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
  return (
    <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Interaction Source Ratio
          </h3>
          <span className="text-[11px] text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/50">
            Hardware Breakdown
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Comparing physical customer interaction methods in your stores
        </p>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex mb-6">
          <div
            style={{ width: `${qrPercentage}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`QR: ${qrPercentage}%`}
          />
          <div
            style={{ width: `${nfcPercentage}%` }}
            className="bg-sky-500 h-full transition-all duration-500"
            title={`NFC: ${nfcPercentage}%`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">QR Scans</div>
            <div className="text-lg font-bold text-white tracking-tight">
              {qrTotal.toLocaleString()}{' '}
              <span className="text-xs font-normal text-emerald-400">({qrPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">NFC Taps</div>
            <div className="text-lg font-bold text-white tracking-tight">
              {nfcTotal.toLocaleString()}{' '}
              <span className="text-xs font-normal text-sky-400">({nfcPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
