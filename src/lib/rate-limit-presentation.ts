import type { NextRequest } from 'next/server';

const structuredPrefixes = ['/api/'];

export function wantsRateLimitPage(request: NextRequest) {
  return ['GET', 'HEAD'].includes(request.method)
    && request.headers.get('accept')?.includes('text/html') === true
    && !structuredPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
}

export function safeInternalPath(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith('/') && !path.startsWith('//') ? path : '/';
}
