import { Card } from './types';

export const GRACE_PERIOD_DAYS = 7;
export const GRACE_PERIOD_MS = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

export interface SubscriptionCheckResult {
  allowed: boolean;
  inGracePeriod?: boolean;
  daysRemainingInGrace?: number;
  reason?: 'active' | 'grace_period' | 'expired' | 'unlinked';
}

/**
 * Checks if a card's subscription is active or within the 7-day grace period.
 */
export function checkCardSubscriptionStatus(card: Card): SubscriptionCheckResult {
  const status = (card.subscription_status || 'active').toLowerCase();

  // Active / trialing states are immediately allowed
  if (status === 'active' || status === 'trialing' || status === 'configured') {
    return { allowed: true, reason: 'active' };
  }

  // If pending and has place_id, grant initial access
  if (status === 'pending') {
    return { allowed: true, reason: 'active' };
  }

  // Non-paying / delinquent states: past_due, unpaid, suspended, cancelled
  if (['past_due', 'unpaid', 'suspended', 'cancelled'].includes(status)) {
    const referenceDateStr =
      card.subscription_status_updated_at ||
      card.subscription_current_period_end ||
      card.linked_at ||
      card.updated_at;

    if (!referenceDateStr) {
      return { allowed: false, reason: 'expired' };
    }

    const referenceTime = new Date(referenceDateStr).getTime();
    if (isNaN(referenceTime)) {
      return { allowed: false, reason: 'expired' };
    }

    const elapsedMs = Date.now() - referenceTime;
    if (elapsedMs <= GRACE_PERIOD_MS) {
      const remainingMs = Math.max(0, GRACE_PERIOD_MS - elapsedMs);
      const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      return {
        allowed: true,
        inGracePeriod: true,
        daysRemainingInGrace: daysRemaining,
        reason: 'grace_period',
      };
    }

    return { allowed: false, reason: 'expired' };
  }

  return { allowed: true, reason: 'active' };
}
