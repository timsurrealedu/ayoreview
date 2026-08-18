import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET(request: NextRequest) {
  const locationId = request.nextUrl.searchParams.get('location_id') || undefined;
  const org = dbRepo.getOrganization();
  const cards = dbRepo.getCards({ locationId, orgId: org.id });
  return NextResponse.json({ success: true, data: cards });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location_id, name, placement, inventory_code } = body;
    
    if (!name) {
      return NextResponse.json({ success: false, error: 'Card name is required' }, { status: 400 });
    }

    const card = dbRepo.createCard({
      location_id: location_id || null,
      name,
      placement: placement || 'cashier',
      inventory_code,
    });

    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
