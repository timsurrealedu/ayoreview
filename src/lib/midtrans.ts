import crypto from 'crypto';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const SNAP_BASE = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const API_BASE = IS_PRODUCTION
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2';

export const midtransConfigured = Boolean(SERVER_KEY);

function authHeader() {
  return 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64');
}

export type SnapTransactionResult = {
  token: string;
  redirect_url: string;
};

/**
 * Creates a Midtrans Snap transaction. Customers pay via QRIS, GoPay,
 * ShopeePay, bank VA, cards, etc. through the hosted Snap page.
 */
export async function createSnapTransaction(params: {
  orderId: string;
  orderCode: string;
  grossAmount: number;
  email?: string;
  name?: string;
  phone?: string;
}): Promise<SnapTransactionResult> {
  if (!SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured');
  }

  const res = await fetch(SNAP_BASE, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.orderCode,
        gross_amount: params.grossAmount,
      },
      item_details: [
        {
          id: 'card-nfc-qr',
          name: 'Kartu Review AyoReview (NFC + QR)',
          price: params.grossAmount,
          quantity: 1,
        },
      ],
      customer_details: {
        email: params.email || undefined,
        first_name: params.name || undefined,
        phone: params.phone || undefined,
      },
      callbacks: {
        finish: `${APP_URL}/pesan/sukses?order=${params.orderId}`,
        error: `${APP_URL}/pesan?cancelled=1`,
        // Snap has no explicit cancel URL; unfinish covers abandoned sessions
        unfinish: `${APP_URL}/pesan/sukses?order=${params.orderId}`,
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.redirect_url) {
    throw new Error(`Midtrans Snap error: ${JSON.stringify(data)}`);
  }
  return { token: data.token, redirect_url: data.redirect_url };
}

/**
 * Verifies the sha512 signature attached to Midtrans HTTP notifications:
 * sha512(order_id + status_code + gross_amount + server_key)
 */
export function verifyMidtransSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  if (!SERVER_KEY) return false;
  const expected = crypto
    .createHash('sha512')
    .update(payload.order_id + payload.status_code + payload.gross_amount + SERVER_KEY)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(payload.signature_key));
  } catch {
    return false;
  }
}

export type MidtransStatus = {
  transaction_status: string;
  fraud_status?: string;
  transaction_id: string;
  gross_amount?: string;
};

/**
 * Fetches authoritative transaction status directly from the Midtrans API.
 * Used as belt-and-suspenders verification on the success page.
 */
export async function getMidtransStatus(orderCode: string): Promise<MidtransStatus | null> {
  if (!SERVER_KEY) return null;
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(orderCode)}/status`, {
      headers: { Accept: 'application/json', Authorization: authHeader() },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Maps a verified Midtrans notification/status to our internal order status. */
export function mapMidtransToOrderStatus(t: { transaction_status: string; fraud_status?: string }) {
  switch (t.transaction_status) {
    case 'capture':
    case 'settlement':
      // Card transactions can be captured while fraud review is pending
      if (t.fraud_status && t.fraud_status !== 'accept') {
        return t.fraud_status === 'challenge' ? 'review' : 'failed';
      }
      return 'paid';
    case 'pending':
      return 'pending_payment';
    case 'deny':
    case 'cancel':
    case 'expire':
    case 'failure':
      return 'failed';
    default:
      return 'pending_payment';
  }
}
