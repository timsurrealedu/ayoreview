/**
 * Strict Google URL Validation
 * Enforces PRD SR-004, SR-005, and Section 23 rules.
 */

const ALLOWED_GOOGLE_REVIEW_HOSTS = new Set([
  'g.page',
  'search.google.com',
  'maps.google.com',
  'google.com',
  'www.google.com',
  'maps.app.goo.gl',
  'goo.gl',
]);

const ALLOWED_GOOGLE_MAPS_HOSTS = new Set([
  'maps.google.com',
  'google.com',
  'www.google.com',
  'maps.app.goo.gl',
  'goo.gl',
]);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export function validateGoogleReviewUrl(inputUrl: string | null | undefined): ValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string' || !inputUrl.trim()) {
    return { isValid: false, error: 'Google Review URL is required' };
  }

  const trimmed = inputUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Enforce HTTPS
  if (parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Only secure https:// URLs are permitted' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname matching
  const isAllowedHost = Array.from(ALLOWED_GOOGLE_REVIEW_HOSTS).some(
    (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
  );

  if (!isAllowedHost) {
    return {
      isValid: false,
      error: 'Destination must be a legitimate Google Review URL (e.g. g.page/r/.../review, maps.google.com, or search.google.com)',
    };
  }

  // Prevent suspicious query parameters or javascript injection
  if (parsed.pathname.includes('<script>') || parsed.search.includes('<script>')) {
    return { isValid: false, error: 'Unsafe characters detected' };
  }

  return { isValid: true, sanitizedUrl: parsed.toString() };
}

export function validateGoogleMapsUrl(inputUrl: string | null | undefined): ValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string' || !inputUrl.trim()) {
    return { isValid: true, sanitizedUrl: undefined };
  }

  const trimmed = inputUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Invalid Google Maps URL format' };
  }

  if (parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Maps URL must use https://' };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isAllowedHost = Array.from(ALLOWED_GOOGLE_MAPS_HOSTS).some(
    (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
  );

  if (!isAllowedHost) {
    return { isValid: false, error: 'Must be a valid Google Maps link (maps.google.com or goo.gl)' };
  }

  return { isValid: true, sanitizedUrl: parsed.toString() };
}
