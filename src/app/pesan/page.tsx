import { OrderWizard } from './order-wizard';

export const metadata = {
  title: 'Pesan Kartu Review | AyoReview',
  description: 'Pesan kartu NFC + QR AyoReview untuk review Google bisnis Anda.',
};

export default function PesanPage() {
  const cardPrice = Number(process.env.CARD_PRICE_IDR || 30000);
  return <OrderWizard cardPrice={cardPrice} />;
}
