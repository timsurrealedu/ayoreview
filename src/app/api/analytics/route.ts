import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkOrgApiAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org } = authRes.context;
  const days = parseInt(request.nextUrl.searchParams.get('days') || '30', 10);

  const [overview, trend, topCards, placements, locations] = await Promise.all([
    dbRepo.getAnalyticsOverview(org.id),
    dbRepo.getDailyTrend(org.id, days),
    dbRepo.getTopCards(org.id, 8),
    dbRepo.getPlacementsBreakdown(org.id),
    dbRepo.getLocationsWithStats(org.id),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview,
      trend,
      topCards,
      placements,
      locations,
    },
  });
}
