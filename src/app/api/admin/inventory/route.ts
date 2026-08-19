import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkAdminApiAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const adminCheck = await checkAdminApiAccess(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  try {
    const [cards, locations] = await Promise.all([
      dbRepo.getAllInventoryCards(),
      dbRepo.getAllLocationsWithOrg(),
    ]);

    return NextResponse.json({ success: true, data: { cards, locations } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
