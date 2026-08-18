import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const card = dbRepo.getCardById(id);
  if (!card) {
    return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: card });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    dbRepo.updateCard(id, body);
    const updated = dbRepo.getCardById(id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
