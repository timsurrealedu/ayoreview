import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkOrgApiAccess } from '@/lib/auth';
import { validateGoogleReviewUrl, validateGoogleMapsUrl } from '@/lib/url-validator';

export async function GET(request: NextRequest) {
  const authRes = await checkOrgApiAccess();
  if (!authRes.authorized || !authRes.context) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: 401 });
  }

  const { org } = authRes.context;
  const businessId = request.nextUrl.searchParams.get('businessId') || undefined;
  const locations = await dbRepo.getLocations(businessId, org.id);
  return NextResponse.json({ success: true, data: locations });
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
    const { business_id, name, address, city, country, google_maps_url, google_review_url } = body;

    if (!business_id || !name || !address || !city || !country || !google_review_url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify business belongs to org
    const business = await dbRepo.getBusinessById(business_id, org.id);
    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Target business not found in your organization' },
        { status: 404 }
      );
    }

    // Validate Google URLs strictly
    const reviewVal = validateGoogleReviewUrl(google_review_url);
    if (!reviewVal.isValid) {
      return NextResponse.json({ success: false, error: reviewVal.error }, { status: 400 });
    }

    const mapsVal = validateGoogleMapsUrl(google_maps_url);
    if (!mapsVal.isValid) {
      return NextResponse.json({ success: false, error: mapsVal.error }, { status: 400 });
    }

    const location = await dbRepo.createLocation({
      business_id,
      name,
      address,
      city,
      country,
      google_maps_url: mapsVal.sanitizedUrl || null,
      google_review_url: reviewVal.sanitizedUrl || google_review_url,
    });

    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Location ID required' }, { status: 400 });
    }

    const existing = await dbRepo.getLocationById(id, org.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    if (updates.google_review_url) {
      const reviewVal = validateGoogleReviewUrl(updates.google_review_url);
      if (!reviewVal.isValid) {
        return NextResponse.json({ success: false, error: reviewVal.error }, { status: 400 });
      }
      updates.google_review_url = reviewVal.sanitizedUrl;
    }

    if (updates.google_maps_url) {
      const mapsVal = validateGoogleMapsUrl(updates.google_maps_url);
      if (!mapsVal.isValid) {
        return NextResponse.json({ success: false, error: mapsVal.error }, { status: 400 });
      }
      updates.google_maps_url = mapsVal.sanitizedUrl;
    }

    await dbRepo.updateLocation(id, updates, org.id);
    const updated = await dbRepo.getLocationById(id, org.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
