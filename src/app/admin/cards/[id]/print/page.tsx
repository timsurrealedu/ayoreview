import { dbRepo } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/auth';
import { generateQrPngDataUrl } from '@/lib/qr';
import Link from 'next/link';
import { ArrowLeft, Smartphone, Store } from 'lucide-react';
import { headers } from 'next/headers';
import { PrintButton } from './print-button';

export const dynamic = 'force-dynamic';

const GOOGLE_BLUE = '#4285F4';
const GOOGLE_RED = '#EA4335';
const GOOGLE_YELLOW = '#FBBC05';
const GOOGLE_GREEN = '#34A853';
const INK = '#202124';
const GRAY = '#5f6368';

function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill={GOOGLE_BLUE}
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill={GOOGLE_GREEN}
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path
        fill={GOOGLE_YELLOW}
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill={GOOGLE_RED}
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
    </svg>
  );
}

function NfcWaves({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke={GOOGLE_BLUE}
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M15 19c4 3 4 7 0 10" />
      <path d="M22 14.5c6.5 5 6.5 14 0 19" />
      <path d="M29 10c9 7 9 21 0 28" />
    </svg>
  );
}

const PRINT_CSS = `
@media print {
  @page { size: 100mm 150mm; margin: 0; }
  html, body {
    width: 100mm; height: 150mm;
    margin: 0 !important; padding: 0 !important;
    overflow: hidden; background: #fff !important;
  }
  .no-print, .admin-sidebar { display: none !important; }
  .admin-shell { display: block !important; min-height: 0 !important; background: #fff !important; }
  .admin-shell > main { min-height: 0 !important; }
  .print-reset { padding: 0 !important; min-height: 0 !important; height: auto !important; display: block !important; background: #fff !important; }
  .card-sheet { border-radius: 0 !important; box-shadow: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`;

export default async function PrintCardTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePlatformAdmin();
  const { id } = await params;
  const card = await dbRepo.getAnyCardById(id);

  if (!card) {
    return <div className="p-8 text-black">Kartu tidak ditemukan.</div>;
  }

  // Derive base URL from request origin with env override — never hardcode a domain
  const headerStore = await headers();
  const host = headerStore.get('host') || 'localhost:3000';
  const protocol = headerStore.get('x-forwarded-proto') || 'http';
  const originFromRequest = `${protocol}://${host}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || originFromRequest;
  const qrUrl = `${appUrl}/q/${card.public_id}`;
  const pngDataUrl = await generateQrPngDataUrl(qrUrl, { width: 800, margin: 2 });

  const businessName = card.business_name?.trim();

  return (
    <div className="print-reset min-h-screen bg-zinc-100 flex flex-col items-center justify-center gap-6 p-8 font-sans text-zinc-900">
      <style>{PRINT_CSS}</style>

      {/* Non-printable action bar */}
      <div className="no-print w-full max-w-md flex items-center justify-between">
        <Link
          href={`/admin/cards`}
          className="flex items-center gap-1.5 text-xs text-muted-ink hover:text-zinc-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Inventaris Kartu
        </Link>
        <PrintButton />
      </div>

      {/* Card sheet — 10 x 15 cm portrait, matches NFC standee insert */}
      <div className="card-sheet relative w-[100mm] h-[150mm] bg-white overflow-hidden rounded-2xl shadow-2xl shrink-0">
        {/* Google-colored organic blobs, left edge */}
        <svg
          className="absolute left-0 top-0 h-full w-[14%]"
          viewBox="0 0 200 960"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0 H120 C86 62 104 124 66 170 C40 202 0 196 0 196 Z" fill={GOOGLE_BLUE} />
          <path
            d="M0 196 C40 190 74 172 94 148 C106 208 78 268 40 284 C24 290 0 288 0 288 Z"
            fill={GOOGLE_RED}
          />
          <path
            d="M0 288 C48 282 90 264 112 240 C120 314 76 380 30 394 C18 397 0 396 0 396 Z"
            fill={GOOGLE_YELLOW}
          />
          <path
            d="M0 396 C58 388 106 360 134 328 C152 470 96 790 0 930 Z"
            fill={GOOGLE_GREEN}
          />
        </svg>

        {/* Blue corner blob, bottom-right */}
        <svg
          className="absolute bottom-0 right-0 w-[30mm] h-[20mm]"
          viewBox="0 0 150 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M150 0 C90 8 34 48 18 100 L150 100 Z" fill={GOOGLE_BLUE} />
        </svg>

        {/* Watermark circles */}
        <div className="absolute -right-[8mm] top-[30mm] w-[36mm] h-[36mm] rounded-full bg-[#f7f9fb]" aria-hidden="true" />
        <div className="absolute right-[10mm] bottom-[34mm] w-[14mm] h-[14mm] rounded-full bg-[#f7f9fb]" aria-hidden="true" />

        {/* Google dots, top-right */}
        <div className="absolute top-[6mm] right-[7mm] flex gap-[2mm]" aria-hidden="true">
          {[GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN].map((c) => (
            <span key={c} className="w-[2.6mm] h-[2.6mm] rounded-full" style={{ background: c }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center px-[10mm] py-[8mm] pb-[7mm] text-center">
          {/* Header */}
          <div className="w-full flex items-center gap-[3mm]">
            <GoogleG className="w-[8mm] h-[8mm] shrink-0" />
            <div className="leading-none text-left">
              <div className="text-[10px] font-medium" style={{ color: INK }}>
                Review us on
              </div>
              <div className="text-[20px] font-medium -mt-[1px]" style={{ color: GRAY }}>
                Google
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="flex-1 flex flex-col items-center justify-center gap-[3mm]">
            <div className="relative bg-white rounded-[4mm] p-[4mm] border border-gray-100 shadow-sm">
              <img
                src={pngDataUrl}
                alt="Pindai untuk memberi review Google"
                className="w-[32mm] h-[32mm] block"
              />
              {/* Colored corner badges */}
              <span
                className="absolute -top-[1.8mm] -left-[1.8mm] w-[5mm] h-[5mm] rounded-[1.6mm] border-2 border-white"
                style={{ background: GOOGLE_BLUE }}
                aria-hidden="true"
              />
              <span
                className="absolute -top-[1.8mm] -right-[1.8mm] w-[5mm] h-[5mm] rounded-[1.6mm] border-2 border-white"
                style={{ background: GOOGLE_RED }}
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-[1.8mm] -left-[1.8mm] w-[5mm] h-[5mm] rounded-[1.6mm] border-2 border-white"
                style={{ background: GOOGLE_GREEN }}
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-[1.8mm] -right-[1.8mm] w-[5mm] h-[5mm] rounded-[1.6mm] border-2 border-white"
                style={{ background: GOOGLE_YELLOW }}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center gap-[2.5mm]">
              <Smartphone className="w-[4mm] h-[4mm]" style={{ color: INK }} />
              <span className="text-[11px] font-medium" style={{ color: '#3c4043' }}>
                Scan to review
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200" aria-hidden="true" />

          {/* NFC tap */}
          <div className="flex flex-col items-center py-[3mm]">
            <div className="w-[20mm] h-[20mm] rounded-full bg-[#f1f3f4] flex items-center justify-center">
              <NfcWaves className="w-[10mm] h-[10mm]" />
            </div>
            <div className="mt-[3mm] text-[15px] font-bold leading-tight" style={{ color: INK }}>
              Tap your phone
            </div>
            <div className="text-[12px]" style={{ color: GRAY }}>
              to leave a review
            </div>
          </div>

          {/* Business name line */}
          <div className="w-full flex items-center gap-[3mm]">
            <div className="w-[8mm] h-[8mm] shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${GOOGLE_BLUE}99` }}>
              <Store className="w-[4mm] h-[4mm]" style={{ color: GOOGLE_BLUE }} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              {businessName && (
                <div className="text-[10px] font-semibold truncate" style={{ color: '#3c4043' }}>
                  {businessName}
                </div>
              )}
              <div className="h-px bg-gray-300 mt-[1.5mm]" aria-hidden="true" />
            </div>
          </div>

        {/* IDs */}
        <div className="absolute bottom-[2.5mm] left-0 right-0 text-center text-[7px] font-mono text-gray-500 truncate z-10">
          {card.inventory_code} · {card.public_id}
        </div>
        </div>
      </div>
    </div>
  );
}
