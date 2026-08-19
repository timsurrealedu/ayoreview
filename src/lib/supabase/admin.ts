import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'http://127.0.0.1:54321';

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
        'The admin client requires the service role key to operate. ' +
        'Set SUPABASE_SERVICE_ROLE_KEY in your environment variables.'
      );
    }
    // In development, fall back to anon key for local testing
    const devKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-service-key';
    console.warn('[getAdminClient] SUPABASE_SERVICE_ROLE_KEY not set; falling back to anon key for development');
    return createSupabaseClient(url, devKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
