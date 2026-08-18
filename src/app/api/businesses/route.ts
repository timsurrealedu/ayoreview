import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET(request: NextRequest) {
  const org = dbRepo.getOrganization();
  const businesses = dbRepo.getBusinesses(org.id);
  return NextResponse.json({ success: true, data: businesses });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, logo_url } = body;
    if (!name || !category) {
      return NextResponse.json({ success: false, error: 'Name and category are required' }, { status: 400 });
    }
    const org = dbRepo.getOrganization();
    const business = dbRepo.createBusiness(org.id, name, category, logo_url);
    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
