import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

/**
 * Check if the current request has a valid authenticated session.
 * Used to gate ?test=true on redirect routes.
 */
export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  return !!(await getSessionUserEmail(request));
}

/**
 * Returns the authenticated user's email for this request, or null.
 */
export async function getSessionUserEmail(request: NextRequest): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        // Read-only check — no cookie writing needed
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}
