import { NextRequest, NextResponse } from 'next/server';
import { stripe, processStripeWebhookEvent } from '@/lib/stripe';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json(
      { error: 'Webhook secret or Stripe SDK unconfigured' },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    await processStripeWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook handling failed:', err.message || err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: `Webhook error: ${err.message || 'Verification failed'}` },
      { status: 400 }
    );
  }
}
