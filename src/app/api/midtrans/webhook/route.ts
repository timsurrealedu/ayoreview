import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { verifyMidtransSignature, mapMidtransToOrderStatus } from '@/lib/midtrans';

type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  transaction_id: string;
};

/**
 * Midtrans HTTP notification (webhook) endpoint.
 * Configure in Midtrans dashboard → Settings → Configuration → Payment Notification URL.
 * Fulfillment is idempotent; signature is verified against the raw payload.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MidtransNotification;

    if (!body?.order_id || !body?.signature_key) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    if (!verifyMidtransSignature(body)) {
      console.error('[midtrans/webhook] Invalid signature for order:', body.order_id);
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const order = await dbRepo.getOrderByCode(body.order_id);
    if (!order) {
      // Acknowledge unknown orders so Midtrans stops retrying
      return NextResponse.json({ success: true });
    }

    const mapped = mapMidtransToOrderStatus(body);

    switch (mapped) {
      case 'paid':
        // Idempotent fulfillment — allocates a card and pre-links the listing
        await dbRepo.fulfillOrder(order.id, body.transaction_id);
        break;
      case 'review':
      case 'failed':
        await dbRepo.updateOrderStatus(order.id, mapped);
        break;
      default:
        // pending_payment etc. — nothing to do
        break;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST /api/midtrans/webhook:', err);
    // Return 500 so Midtrans retries the notification
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
