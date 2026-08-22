import Stripe from 'stripe';
import { dbRepo } from './db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
    })
  : null;

/**
 * Creates a Stripe Checkout Session for a monthly card subscription.
 */
export async function createCheckoutSession(params: {
  publicId: string;
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
}) {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  const card = await dbRepo.setupGetCardByPublicId(params.publicId);
  if (!card) {
    throw new Error('Card not found');
  }

  const customerEmail = params.email || card.merchant_email || undefined;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: STRIPE_PRICE_ID
      ? [{ price: STRIPE_PRICE_ID, quantity: 1 }]
      : [
          {
            price_data: {
              currency: 'idr',
              product_data: {
                name: `AyoReview Subscription (${card.business_name || card.name})`,
                description: `Langganan pengalihan ulasan & analitik aktif kartu ${card.inventory_code}`,
              },
              unit_amount: 4900000, // Rp 49.000 in smallest unit (IDR cents / whole)
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
    metadata: {
      cardId: card.id,
      publicId: card.public_id,
      merchantEmail: customerEmail || '',
    },
    subscription_data: {
      metadata: {
        cardId: card.id,
        publicId: card.public_id,
      },
    },
    success_url: params.successUrl || `${APP_URL}/my?session_id={CHECKOUT_SESSION_ID}&setup=success`,
    cancel_url: params.cancelUrl || `${APP_URL}/s/${card.public_id}`,
  });

  return session;
}

/**
 * Maps Stripe subscription statuses to AyoReview internal card subscription statuses.
 */
export function mapStripeStatusToCardStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'unpaid':
      return 'unpaid';
    case 'canceled':
      return 'cancelled';
    case 'incomplete':
    case 'incomplete_expired':
    case 'trialing':
    default:
      return 'pending';
  }
}

/**
 * Handles verified Stripe Webhook events.
 */
export async function processStripeWebhookEvent(event: Stripe.Event) {
  const now = new Date().toISOString();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const cardId = session.metadata?.cardId;
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : (session.subscription as Stripe.Subscription)?.id;

      if (cardId && subscriptionId) {
        await dbRepo.setupUpdateSubscription(cardId, subscriptionId, 'active', {
          statusUpdatedAt: now,
        });
      } else if (session.metadata?.publicId && subscriptionId) {
        const card = await dbRepo.setupGetCardByPublicId(session.metadata.publicId);
        if (card) {
          await dbRepo.setupUpdateSubscription(card.id, subscriptionId, 'active', {
            statusUpdatedAt: now,
          });
        }
      }
      break;
    }

    case 'invoice.payment_succeeded':
    case 'invoice.paid': {
      const invoice = event.data.object as any;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id || invoice.lines?.data?.[0]?.subscription;

      if (subscriptionId) {
        await dbRepo.setupUpdateSubscriptionByStripeId(subscriptionId, 'active', {
          statusUpdatedAt: now,
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id || invoice.lines?.data?.[0]?.subscription;

      if (subscriptionId) {
        // Mark past_due, starts 7-day grace period
        await dbRepo.setupUpdateSubscriptionByStripeId(subscriptionId, 'past_due', {
          statusUpdatedAt: now,
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      const status = mapStripeStatusToCardStatus(subscription.status);
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : undefined;

      await dbRepo.setupUpdateSubscriptionByStripeId(subscription.id, status, {
        statusUpdatedAt: now,
        currentPeriodEnd,
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      await dbRepo.setupUpdateSubscriptionByStripeId(subscription.id, 'cancelled', {
        statusUpdatedAt: now,
      });
      break;
    }

    default:
      break;
  }
}
