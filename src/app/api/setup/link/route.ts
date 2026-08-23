import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { getSessionUserEmail } from '@/lib/session-check';

export async function POST(request: NextRequest) {
  try {
    const { publicId, placeId, businessName, email } = await request.json();

    if (!publicId || !placeId || !businessName || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required setup fields (publicId, placeId, businessName, email)' },
        { status: 400 }
      );
    }

    const card = await dbRepo.setupGetCardByPublicId(publicId);
    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    // Re-linking an already-linked card requires the current owner's session.
    // Unlinked cards stay open so the scan-to-setup flow keeps working.
    if (card.place_id) {
      const sessionEmail = await getSessionUserEmail(request);
      const isOwner = !!sessionEmail && sessionEmail.toLowerCase() === String(card.merchant_email).toLowerCase();
      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: 'Kartu ini sudah tertaut. Masuk dengan akun pemilik kartu untuk mengubah tautan.' },
          { status: 403 }
        );
      }
    }

    const updatedCard = await dbRepo.setupLinkCard(
      card.id,
      placeId.trim(),
      businessName.trim(),
      email.trim()
    );

    return NextResponse.json({
      success: true,
      data: updatedCard,
      redirectUrl: '/my',
    });
  } catch (err: any) {
    console.error('Error in POST /api/setup/link:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to link card' },
      { status: 500 }
    );
  }
}
