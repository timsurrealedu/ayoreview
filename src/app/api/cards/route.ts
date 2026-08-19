import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkOrgApiAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org } = authRes.context;
  const locationId = request.nextUrl.searchParams.get('locationId') || undefined;
  const cards = await dbRepo.getCards({ locationId, orgId: org.id });
  return NextResponse.json({ success: true, data: cards });
}

export async function POST(request: NextRequest) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org, role } = authRes.context;
  if (role === 'member') {
    return NextResponse.json({ success: false, error: 'Permission denied: Admins or Owners only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, location_id, placement, inventory_code } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Card name is required' }, { status: 400 });
    }

    if (location_id) {
      const loc = await dbRepo.getLocationById(location_id, org.id);
      if (!loc) {
        return NextResponse.json({ success: false, error: 'Location not found in your organization' }, { status: 404 });
      }
    }

    const card = await dbRepo.createCard({
      name,
      location_id: location_id || null,
      placement: placement || 'cashier',
      inventory_code,
    });

    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
