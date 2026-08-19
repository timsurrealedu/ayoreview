import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkOrgApiAccess } from '@/lib/auth';
import { handleApiError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org } = authRes.context;
  const businesses = await dbRepo.getBusinesses(org.id);
  return NextResponse.json({ success: true, data: businesses });
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
    const { name, category, logo_url } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const business = await dbRepo.createBusiness(org.id, name, category, logo_url);
    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (err: any) {
    const result = handleApiError(err, 'POST /api/businesses');
    return NextResponse.json(result, { status: 500 });
  }
}
