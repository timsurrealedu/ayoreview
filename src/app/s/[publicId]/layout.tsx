import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Aktivasi Kartu AyoReview' },
  robots: { index: false, follow: false },
};

export default function CardSetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
