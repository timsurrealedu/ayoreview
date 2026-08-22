import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'AyoReview — Infrastruktur Ulasan Google NFC & QR Pintar',
  description: 'Ubah pelanggan yang puas menjadi ulasan Google bintang 5 instan melalui kartu NFC dan QR dinamis.',
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
