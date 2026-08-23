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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ayoreview.id';
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
    a.download = `ayoreview-${inventoryCode || publicId}-qr.png`;
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayoreview-${inventoryCode || publicId}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center bg-surface border border-line rounded p-6 shadow-xl">
      {/* Physical Stand Simulated Card */}
      <div className="relative mb-6 flex w-full max-w-[280px] flex-col items-center rounded border border-line bg-surface p-5 text-center shadow-lg">
        <div className="flex items-center gap-1 text-warning mb-2 text-base">
          {'★'.repeat(5)}
        </div>
        <h4 className="text-ink font-bold text-sm tracking-tight mb-1">
          Puas dengan kunjungan Anda?
        </h4>
        <p className="text-ink text-xs mb-4">
          Ketuk ponsel atau pindai kode untuk memberi ulasan
        </p>

        {/* QR Code Frame */}
        <div className="p-3 bg-white rounded shadow-inner mb-3">
          {pngUrl ? (
            <img
              src={pngUrl}
              alt="Kode QR AyoReview"
              className="w-40 h-40 object-contain rounded"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-zinc-100 text-muted-ink text-xs font-medium">
              Membuat QR...
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div className="w-full flex items-center justify-between text-[10px] text-ink font-mono pt-2 border-t border-line">
          <span>{inventoryCode || 'AR-000000'}</span>
          <span className="text-action flex items-center gap-1 font-sans font-semibold">
            <Smartphone className="w-3 h-3" /> NFC Aktif
          </span>
        </div>
      </div>

      {/* Download and Action Controls */}
      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh PNG
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-subtle hover:bg-subtle text-ink text-xs font-semibold border border-line transition"
          >
            <Download className="w-3.5 h-3.5" />
            Vektor SVG
          </button>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-line">
          <div className="flex items-center justify-between text-xs bg-surface px-3 py-2 rounded border border-line">
            <div className="truncate pr-2">
              <span className="text-muted-ink font-mono mr-1.5 font-bold">QR:</span>
              <span className="text-ink font-mono text-[11px]">{qrRedirectUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(qrRedirectUrl, 'qr')}
              className="text-ink hover:text-ink p-1"
              title="Salin URL QR"
            >
              {copiedUrl === 'qr' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs bg-surface px-3 py-2 rounded border border-line">
            <div className="truncate pr-2">
              <span className="text-muted-ink font-mono mr-1.5 font-bold">NFC:</span>
              <span className="text-ink font-mono text-[11px]">{nfcRedirectUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(nfcRedirectUrl, 'nfc')}
              className="text-ink hover:text-ink p-1"
              title="Salin URL NFC"
            >
              {copiedUrl === 'nfc' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <a
          href={`${qrRedirectUrl}?test=true`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-1.5 text-xs text-action hover:text-action-hover hover:underline pt-1 font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Uji pengalihan langsung di tab baru (tanpa analitik)
        </a>
      </div>
    </div>
  );
}
