import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReviewTap — Smart NFC & QR Review Infrastructure',
  description: 'Turn happy in-store customers into 5-star Google reviews with physical NFC tap and dynamic QR cards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-[100dvh] bg-[#09090b] text-[#fafafa] antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  );
}
