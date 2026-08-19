import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkOrgApiAccess } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org } = authRes.context;
  const { id } = await context.params;
  const card = await dbRepo.getCardById(id, org.id);

  if (!card) {
    return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: card });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org, role } = authRes.context;
  if (role === 'member') {
    return NextResponse.json({ success: false, error: 'Permission denied: Admins or Owners only' }, { status: 403 });
  }

  const { id } = await context.params;
  const card = await dbRepo.getCardById(id, org.id);

  if (!card) {
    return NextResponse.json({ success: false, error: 'Card not found in your organization' }, { status: 404 });
  }

  try {
    const body = await request.json();

    if (body.location_id) {
      const loc = await dbRepo.getLocationById(body.location_id, org.id);
      if (!loc) {
        return NextResponse.json({ success: false, error: 'Target location not found in your organization' }, { status: 404 });
      }
    }

    await dbRepo.updateCard(id, body);
    const updated = await dbRepo.getCardById(id, org.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
