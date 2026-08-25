import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces, PlacesUnavailableError } from '@/lib/places';
import { strictLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rate = strictLimiter.check(`setup-search:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many search requests. Please wait a minute.' },
      { status: 429 }
    );
  }

  try {
    const { query, city } = await request.json();
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      );
    }

    const places = await searchPlaces(query, typeof city === 'string' ? city : undefined);
    return NextResponse.json({ success: true, places });
  } catch (err: any) {
    if (err instanceof PlacesUnavailableError) {
      console.error('Places API unavailable in POST /api/setup/search:', err.message);
      return NextResponse.json(
        { success: false, error: 'Layanan pencarian sedang tidak tersedia. Coba lagi atau gunakan Tempel Tautan.' },
        { status: 502 }
      );
    }
    console.error('Error in POST /api/setup/search:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to search Google Places' },
      { status: 500 }
    );
  }
}
