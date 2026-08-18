import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { isBotUserAgent, detectDeviceType, hashIp } from '@/lib/bot-filter';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await context.params;
  const isTest = request.nextUrl.searchParams.get('test') === 'true';

  const card = dbRepo.getCardByPublicId(publicId);

  if (!card) {
    return NextResponse.redirect(new URL('/fallback/not-found', request.url), 302);
  }

  if (card.status !== 'active' || (card.location_id && card.location_status !== 'active')) {
    return NextResponse.redirect(new URL('/fallback/inactive', request.url), 302);
  }

  const destination = card.google_review_url;
  if (!destination) {
    return NextResponse.redirect(new URL('/fallback/unconfigured', request.url), 302);
  }

  // Fast asynchronous interaction recording
  if (!isTest) {
    const userAgent = request.headers.get('user-agent');
    const isBot = isBotUserAgent(userAgent) ? 1 : 0;
    const deviceType = detectDeviceType(userAgent);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = hashIp(ip);

    try {
      dbRepo.recordInteraction({
        card_id: card.id,
        source: 'nfc',
        is_bot: isBot,
        user_agent: userAgent,
        ip_hash: ipHash,
        device_type: deviceType,
      });
    } catch (err) {
      console.error('Failed to log NFC interaction:', err);
    }
  }

  // Safe validated 302 redirect
  return NextResponse.redirect(destination, 302);
}
