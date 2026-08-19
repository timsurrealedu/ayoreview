import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkAdminApiAccess } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const adminCheck = await checkAdminApiAccess(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  try {
    const { count = 10 } = await request.json();
    const created = await dbRepo.batchGenerateBlankCards(Math.min(count, 100));
    return NextResponse.json({ success: true, count: created.length, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
