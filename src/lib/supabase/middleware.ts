import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Protect /my
    if (path.startsWith('/my') && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', path);
      return NextResponse.redirect(url);
    }

    // Protect /admin separately (will also be checked in route/layout)
    if (path.startsWith('/admin') && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', path);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated user away from /login /signup
    if ((path === '/login' || path === '/signup') && user) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/my';
      const url = request.nextUrl.clone();
      url.pathname = redirectTo;
      url.searchParams.delete('redirectTo');
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // Supabase misconfigured or unreachable: degrade to anonymous instead of
    // returning HTTP 500 for every middleware-matched route.
    return supabaseResponse;
  }
}
