import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/api/businesses/:path*',
    '/api/locations/:path*',
    '/api/cards/:path*',
    '/api/analytics/:path*',
    '/api/admin/:path*',
  ],
};
