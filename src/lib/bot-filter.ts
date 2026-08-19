import { createHmac } from 'node:crypto';
import { DeviceType } from './types';

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /slackbot/i,
  /twitterbot/i,
  /telegrambot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest\/0\./i,
  /developers\.google\.com\/\+\/web\/snippet/i,
  /vkshare/i,
  /w3c_validator/i,
  /baiduspider/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /googlebot/i,
];

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function detectDeviceType(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Keyed hash of the visitor IP (HMAC-SHA-256, key = IP_HASH_SECRET).
 * Reversible only with the secret — unlike the old 32-bit hash, IPs can't be
 * recovered by enumerating IPv4. Stable across instances (same secret), so
 * per-visitor analytics stay correct on serverless.
 *
 * PRD priority: redirect correctness beats analytics. If the secret is missing
 * in production we degrade to 'anonymous' rather than fail the redirect.
 */
export function hashIp(ip: string | null | undefined): string {
  if (!ip) return 'anonymous';
  // x-forwarded-for can carry "client, proxy1, proxy2" — hash the client only
  const clientIp = ip.split(',')[0].trim();
  if (!clientIp) return 'anonymous';

  const secret = process.env.IP_HASH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      return 'dev_' + createHmac('sha256', 'insecure-dev-key').update(clientIp).digest('hex').slice(0, 16);
    }
    console.error('[hashIp] IP_HASH_SECRET not set — recording anonymous instead of hashed IP');
    return 'anonymous';
  }
  return createHmac('sha256', secret).update(clientIp).digest('hex');
}
