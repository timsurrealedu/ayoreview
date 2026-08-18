import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await context.params;
  return NextResponse.redirect(new URL(`/q/${publicId}`, request.url), 307);
}
