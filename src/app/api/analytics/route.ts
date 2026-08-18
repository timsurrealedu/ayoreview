import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET(request: NextRequest) {
  const org = dbRepo.getOrganization();
  const days = parseInt(request.nextUrl.searchParams.get('days') || '30', 10);

  const overview = dbRepo.getAnalyticsOverview(org.id);
  const trend = dbRepo.getDailyTrend(org.id, days);
  const topCards = dbRepo.getTopCards(org.id, 8);
  const placements = dbRepo.getPlacementsBreakdown(org.id);
  const locations = dbRepo.getLocationsWithStats(org.id);

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
