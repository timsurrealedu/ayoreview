import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

function resolveSiteUrl(): URL {
  const candidate = process.env.NEXT_PUBLIC_APP_URL;
  if (candidate) {
    try {
      return new URL(candidate);
    } catch {
      // Placeholder or malformed env value — fall back to the canonical domain.
    }
  }
  return new URL('https://ayoreview.id');
}

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: {
    default: 'AyoReview — Infrastruktur Ulasan Google NFC & QR Pintar',
    template: '%s · AyoReview',
  },
  description: 'Ubah pelanggan yang puas menjadi ulasan Google bintang 5 instan melalui kartu NFC dan QR dinamis.',
  openGraph: {
    type: 'website',
    siteName: 'AyoReview',
    locale: 'id_ID',
    url: resolveSiteUrl().toString(),
    title: 'AyoReview — Kartu Ulasan Google NFC & QR',
    description: 'Kartu NFC + QR sekali bayar yang mengarahkan pelanggan langsung ke form ulasan Google bisnis Anda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AyoReview — Kartu Ulasan Google NFC & QR',
    description: 'Kartu NFC + QR sekali bayar yang mengarahkan pelanggan langsung ke form ulasan Google bisnis Anda.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-[100dvh] bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
