import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkAdminApiAccess } from '@/lib/auth';
import { handleApiError } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const adminCheck = await checkAdminApiAccess(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  try {
    const { inventory_code, location_id, placement } = await request.json();

    if (!inventory_code || !location_id) {
      return NextResponse.json(
        { success: false, error: 'Inventory code and Location ID required' },
        { status: 400 }
      );
    }

    const card = await dbRepo.getCardByInventoryCode(inventory_code);
    if (!card) {
      return NextResponse.json({ success: false, error: 'Physical card not found' }, { status: 404 });
    }

    // Verify location exists before assigning
    const location = await dbRepo.getLocationById(location_id);
    if (!location) {
      return NextResponse.json({ success: false, error: 'Target location not found' }, { status: 404 });
    }

    await dbRepo.updateCard(card.id, {
      location_id,
      placement: placement || 'cashier',
      status: 'active',
    });

    const updated = await dbRepo.getCardById(card.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    const result = handleApiError(err, 'POST /api/admin/assign');
    return NextResponse.json(result, { status: 500 });
  }
}
