import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inventory_code, location_id, name, placement } = body;

    const card = dbRepo.getCardByInventoryCode(inventory_code);
    if (!card) {
      return NextResponse.json({ success: false, error: 'Inventory card not found' }, { status: 404 });
    }

    dbRepo.updateCard(card.id, {
      location_id,
      name: name || card.name,
      placement: placement || card.placement,
      status: 'active',
    });

    const updated = dbRepo.getCardById(card.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
