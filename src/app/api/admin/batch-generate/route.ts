import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkAdminApiAccess } from '@/lib/auth';
import { handleApiError } from '@/lib/api-helpers';

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
    const result = handleApiError(err, 'POST /api/admin/batch-generate');
    return NextResponse.json(result, { status: 500 });
  }
}
