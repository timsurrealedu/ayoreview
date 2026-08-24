import { OrderWizard } from './order-wizard';

export const metadata = {
  title: 'Pesan Kartu Ulasan | AyoReview',
  description: 'Pesan kartu NFC + QR AyoReview untuk ulasan Google bisnis Anda.',
};

export default function PesanPage() {
  const cardPrice = Number(process.env.CARD_PRICE_IDR || 20000);
  return <OrderWizard cardPrice={cardPrice} />;
}
