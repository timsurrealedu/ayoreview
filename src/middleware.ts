import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { strictLimiter, mediumLimiter, defaultLimiter } from '@/lib/rate-limiter';

export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1';
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Determine rate limit tier by route
  let limiter = defaultLimiter;
  if (path === '/login' || path === '/signup') {
    limiter = strictLimiter;  // 10 req/min
  } else if (path === '/api/cards' && method === 'POST') {
    limiter = mediumLimiter;  // 20 req/min
  }

  const result = limiter.check(`rt:${ip}:${path}:${method}`);
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limiter['max']),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
        },
      }
    );
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    // Public redirect endpoints — the most abuse-exposed surface (analytics inflation)
    '/q/:path*',
    '/n/:path*',
    '/r/:path*',
    '/api/businesses/:path*',
    '/api/locations/:path*',
    '/api/cards/:path*',
    '/api/analytics/:path*',
    '/api/admin/:path*',
  ],
};
