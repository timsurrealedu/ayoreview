import * as Sentry from '@sentry/nextjs';

/**
 * Wraps an API handler error: captures to Sentry and returns a generic message.
 * Never leaks internal details (constraint names, relation names, stack traces) to the client.
 */
export function handleApiError(err: unknown, context?: string): { success: false; error: string } {
  const message = err instanceof Error ? err.message : String(err);
  Sentry.captureException(err, { extra: { context } });
  // Return generic message — log the real detail to Sentry
  return { success: false, error: 'An internal error occurred' };
}

/**
 * Validates that an inventory code uses the safe RT-XXXXXX format.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateInventoryCode(code: string): string | null {
  // Platform RT- prefix range: allow only RT- followed by 6 digits
  if (!/^RT-\d{6}$/.test(code)) {
    return 'Invalid inventory code format. Expected RT- followed by 6 digits (e.g. RT-000123).';
  }
  return null;
}

/**
 * Validates that a placement value is one of the known enum values.
 */
export function validatePlacement(placement: string): string | null {
  const valid = ['cashier', 'table', 'entrance', 'counter', 'waiting_area', 'receipt', 'custom'];
  if (!valid.includes(placement)) {
    return `Invalid placement "${placement}". Must be one of: ${valid.join(', ')}`;
  }
  return null;
}
