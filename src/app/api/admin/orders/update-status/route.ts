import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { checkAdminApiAccess } from '@/lib/auth';
import { handleApiError } from '@/lib/api-helpers';
import type { OrderStatus } from '@/lib/types';

const OPERATOR_STATUSES: OrderStatus[] = ['shipped', 'completed', 'cancelled', 'failed'];

export async function POST(request: NextRequest) {
  const adminCheck = await checkAdminApiAccess(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'orderId and status are required' },
        { status: 400 }
      );
    }

    if (!OPERATOR_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${OPERATOR_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const order = await dbRepo.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    await dbRepo.updateOrderStatus(orderId, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    const result = handleApiError(err, 'POST /api/admin/orders/update-status');
    return NextResponse.json(result, { status: 500 });
  }
}
