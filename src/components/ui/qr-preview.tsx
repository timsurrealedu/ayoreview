'use client';

import { useEffect, useState } from 'react';
import { generateQrPngDataUrl, generateQrSvgString } from '@/lib/qr';
import { Download, ExternalLink, QrCode, Smartphone, Copy, Check } from 'lucide-react';

type QrPreviewProps = {
  publicId: string;
  name: string;
  locationName?: string;
  inventoryCode?: string;
  size?: number;
};

export function QrPreviewModal({
  publicId,
  name,
  locationName,
  inventoryCode,
  size = 280,
}: QrPreviewProps) {
  const [pngUrl, setPngUrl] = useState<string>('');
  const [svgStr, setSvgStr] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://reviewtap.id';
  const qrRedirectUrl = `${baseUrl}/q/${publicId}`;
  const nfcRedirectUrl = `${baseUrl}/n/${publicId}`;

  useEffect(() => {
    generateQrPngDataUrl(qrRedirectUrl, { width: 600, margin: 2 }).then(setPngUrl);
    generateQrSvgString(qrRedirectUrl, { margin: 2 }).then(setSvgStr);
  }, [qrRedirectUrl]);

  const handleCopy = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDownloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `reviewtap-${inventoryCode || publicId}-qr.png`;
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviewtap-${inventoryCode || publicId}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-xl">
      {/* Physical Stand Simulated Card */}
      <div className="relative w-full max-w-[280px] bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center mb-6">
        <div className="flex items-center gap-1 text-amber-400 mb-2">
          {'★'.repeat(5)}
        </div>
        <h4 className="text-white font-bold text-sm tracking-tight mb-1">
          Enjoyed your visit?
        </h4>
        <p className="text-zinc-400 text-xs mb-4">
          Tap phone or scan code to leave a review
        </p>

        {/* QR Code Frame */}
        <div className="p-3 bg-white rounded-xl shadow-inner mb-3">
          {pngUrl ? (
            <img
              src={pngUrl}
              alt="QR Code"
              className="w-40 h-40 object-contain rounded-lg"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs">
              Generating...
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800">
          <span>{inventoryCode || 'RT-000000'}</span>
          <span className="text-emerald-400 flex items-center gap-1 font-sans">
            <Smartphone className="w-3 h-3" /> NFC Active
          </span>
        </div>
      </div>

      {/* Download and Action Controls */}
      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Vector SVG
          </button>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs bg-zinc-900/90 px-3 py-2 rounded-lg border border-zinc-800">
            <div className="truncate pr-2">
              <span className="text-zinc-500 font-mono mr-1.5">QR:</span>
              <span className="text-zinc-300 font-mono text-[11px]">{qrRedirectUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(qrRedirectUrl, 'qr')}
              className="text-zinc-400 hover:text-white p-1"
              title="Copy QR URL"
            >
              {copiedUrl === 'qr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs bg-zinc-900/90 px-3 py-2 rounded-lg border border-zinc-800">
            <div className="truncate pr-2">
              <span className="text-zinc-500 font-mono mr-1.5">NFC:</span>
              <span className="text-zinc-300 font-mono text-[11px]">{nfcRedirectUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(nfcRedirectUrl, 'nfc')}
              className="text-zinc-400 hover:text-white p-1"
              title="Copy NFC URL"
            >
              {copiedUrl === 'nfc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <a
          href={`${qrRedirectUrl}?test=true`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline pt-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Test live redirect in new tab (bypasses analytics)
        </a>
      </div>
    </div>
  );
}
