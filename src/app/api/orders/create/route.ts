import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { createSnapTransaction, midtransConfigured } from '@/lib/midtrans';
import { strictLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rate = strictLimiter.check(`order-create:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Terlalu banyak permintaan. Coba lagi sebentar.' },
      { status: 429 }
    );
  }

  try {
    const {
      placeId,
      businessName,
      merchantName,
      merchantEmail,
      merchantPhone,
      shippingAddress,
    } = await request.json();

    if (!businessName?.trim()) {
      return NextResponse.json({ success: false, error: 'Nama bisnis wajib diisi' }, { status: 400 });
    }
    if (!merchantName?.trim()) {
      return NextResponse.json({ success: false, error: 'Nama pemesan wajib diisi' }, { status: 400 });
    }
    if (!merchantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantEmail)) {
      return NextResponse.json({ success: false, error: 'Email tidak valid' }, { status: 400 });
    }
    if (!shippingAddress?.trim() || shippingAddress.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Alamat pengiriman terlalu pendek (minimal 20 karakter)' },
        { status: 400 }
      );
    }
    // A direct review URL or a Google place_id — at least one is required
    const trimmedPlaceId = typeof placeId === 'string' ? placeId.trim() : '';
    if (!trimmedPlaceId) {
      return NextResponse.json(
        { success: false, error: 'Tautan ulasan Google atau lokasi bisnis wajib dipilih' },
        { status: 400 }
      );
    }

    const amount = Number(process.env.CARD_PRICE_IDR || 30000);

    const order = await dbRepo.createOrder({
      placeId: trimmedPlaceId,
      businessName,
      merchantName,
      merchantEmail,
      merchantPhone,
      shippingAddress,
      amount,
    });

    if (!midtransConfigured) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Payment system not configured' },
          { status: 500 }
        );
      }
      // Dev without Midtrans keys: simulate a paid order end-to-end
      await dbRepo.fulfillOrder(order.id, `dev-txn-${order.id}`);
      return NextResponse.json({ success: true, mock: true, orderId: order.id });
    }

    const snap = await createSnapTransaction({
      orderId: order.id,
      orderCode: order.order_code,
      grossAmount: amount,
      email: order.merchant_email,
      name: order.merchant_name,
      phone: order.merchant_phone || undefined,
    });

    return NextResponse.json({ success: true, url: snap.redirect_url });
  } catch (err: any) {
    console.error('Error in POST /api/orders/create:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}
