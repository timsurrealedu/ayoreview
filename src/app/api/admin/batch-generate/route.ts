import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = parseInt(body.count || '10', 10);
    const created = dbRepo.batchGenerateBlankCards(Math.min(count, 100));
    return NextResponse.json({ success: true, count: created.length, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
