import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'ReviewTap — Infrastruktur Ulasan NFC & QR Pintar',
  description: 'Ubah pelanggan yang puas menjadi ulasan Google bintang lima melalui kartu NFC dan QR dinamis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-[100dvh] bg-[#09090b] text-[#fafafa] antialiased">
        {children}
      </body>
    </html>
  );
}
