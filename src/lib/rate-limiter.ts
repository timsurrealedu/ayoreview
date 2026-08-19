/**
 * In-memory sliding-window rate limiter — BEST-EFFORT ONLY, not a security control.
 *
 * State lives in a per-process Map. Vercel runs many concurrent lambdas plus cold
 * starts, so the effective limit is roughly (max × instance count) and counters
 * reset whenever an instance recycles. Treat this as abuse friction, not a guarantee.
 *
 * honey: acceptable for pilot scale; replace with Upstash Redis (edge-compatible,
 * fits middleware runtime) before relying on it for anything security-relevant.
 *
 * Usage:
 *   const limiter = new RateLimiter({ windowMs: 60000, max: 60 });
 *   const result = limiter.check('ip-127.0.0.1');
 *   // result.allowed, result.remaining, result.resetTime
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  private windowMs: number;
  private max: number;

  constructor(opts: { windowMs: number; max: number }) {
    this.windowMs = opts.windowMs;
    this.max = opts.max;
  }

  /**
   * Check if a request is within the rate limit.
   * Returns { allowed, remaining, resetTime }.
   */
  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get and prune old entries
    let timestamps = this.hits.get(key) || [];
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= this.max) {
      // Rate limited — reset time is the oldest timestamp + window
      const resetTime = timestamps[0] + this.windowMs;
      this.hits.set(key, timestamps);
      return { allowed: false, remaining: 0, resetTime };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);
    return { allowed: true, remaining: this.max - timestamps.length, resetTime: now + this.windowMs };
  }

  /** Reset all counters (useful in tests) */
  reset(): void {
    this.hits.clear();
  }
}

// Singleton instances for different rate limit tiers
export const strictLimiter = new RateLimiter({ windowMs: 60_000, max: 10 });   // login/signup: 10 req/min
export const mediumLimiter = new RateLimiter({ windowMs: 60_000, max: 20 });   // card create: 20 req/min
export const defaultLimiter = new RateLimiter({ windowMs: 60_000, max: 60 });  // general API: 60 req/min
