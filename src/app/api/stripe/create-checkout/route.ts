import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { publicId, email } = await request.json();
    if (!publicId) {
      return NextResponse.json({ success: false, error: 'publicId is required' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock / direct success in development if Stripe key is unconfigured
      return NextResponse.json({
        success: true,
        mock: true,
        message: 'Stripe not configured; proceeding with mock subscription.',
      });
    }

    const session = await createCheckoutSession({ publicId, email });
    return NextResponse.json({ success: true, url: session.url });
  } catch (err: any) {
    console.error('Error creating Stripe checkout session:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to initialize checkout' },
      { status: 500 }
    );
  }
}
