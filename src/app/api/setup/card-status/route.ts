import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { defaultLimiter } from '@/lib/rate-limiter';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rate = defaultLimiter.check(`card-status:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

  try {
    const publicId = request.nextUrl.searchParams.get('publicId');
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'publicId is required' },
        { status: 400 }
      );
    }

    const card = await dbRepo.setupGetCardByPublicId(publicId);
    if (!card) {
      return NextResponse.json({ success: true, data: { exists: false } });
    }

    return NextResponse.json({
      success: true,
      data: {
        exists: true,
        linked: !!(card.place_id || card.location_id),
        status: card.status,
      },
    });
  } catch (err) {
    console.error('Error in GET /api/setup/card-status:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to check card status' },
      { status: 500 }
    );
  }
}
