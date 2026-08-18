import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id') || undefined;
  const locations = dbRepo.getLocations(businessId);
  return NextResponse.json({ success: true, data: locations });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business_id, name, address, city, country, google_maps_url, google_review_url } = body;
    
    if (!business_id || !name || !address || !city || !country || !google_review_url) {
      return NextResponse.json({ success: false, error: 'Missing required location fields' }, { status: 400 });
    }

    const location = dbRepo.createLocation({
      business_id,
      name,
      address,
      city,
      country,
      google_maps_url,
      google_review_url,
    });

    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Location ID required' }, { status: 400 });
    }
    dbRepo.updateLocation(id, updates);
    const updated = dbRepo.getLocationById(id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
