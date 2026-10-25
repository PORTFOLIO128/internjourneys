import { NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { CERTIFICATE_FEE_RUPEES, verifyRazorpaySignature } from '@/lib/payments/razorpay';

export const runtime = 'nodejs';

function getAccessToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Please sign in before verifying payment.' }, { status: 401 });
  }

  const requiredEnv = [
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ].filter((key) => !process.env[key]);

  if (requiredEnv.length) {
    return NextResponse.json(
      { error: `Payment verification is not configured. Missing env: ${requiredEnv.join(', ')}` },
      { status: 503 }
    );
  }

  try {
    const body = await request.json() as {
      orderId?: unknown;
      paymentId?: unknown;
      signature?: unknown;
    };

    if (typeof body.orderId !== 'string' || !body.orderId) {
      return NextResponse.json({ error: 'A Razorpay order ID is required.' }, { status: 400 });
    }
    if (typeof body.paymentId !== 'string' || !body.paymentId) {
      return NextResponse.json({ error: 'A Razorpay payment ID is required.' }, { status: 400 });
    }
    if (typeof body.signature !== 'string' || !body.signature) {
      return NextResponse.json({ error: 'A Razorpay payment signature is required.' }, { status: 400 });
    }

    const userClient = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
    }

    const serviceClient = createServiceRoleSupabaseClient();
    const { data: paymentRecord, error: paymentError } = await serviceClient
      .from('payments')
      .select('id, amount, currency, purpose, provider, provider_order_id, provider_payment_id, status')
      .eq('student_id', user.id)
      .eq('provider', 'razorpay')
      .eq('provider_order_id', body.orderId)
      .maybeSingle();

    if (paymentError) throw paymentError;
    if (!paymentRecord) {
      return NextResponse.json({ error: 'Payment order not found.' }, { status: 404 });
    }
    if (
      paymentRecord.amount !== CERTIFICATE_FEE_RUPEES ||
      paymentRecord.currency !== 'INR' ||
      paymentRecord.purpose !== 'Certificate fee'
    ) {
      return NextResponse.json({ error: 'This order is not eligible for certificate payment.' }, { status: 400 });
    }
    if (paymentRecord.status === 'Refunded') {
      return NextResponse.json({ error: 'This payment order has been refunded.' }, { status: 409 });
    }

    const isValidSignature = verifyRazorpaySignature({
      orderId: body.orderId,
      paymentId: body.paymentId,
      signature: body.signature,
      keySecret: process.env.RAZORPAY_KEY_SECRET!,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
    }

    const completionAction = paymentRecord.status === 'Completed' && paymentRecord.provider_payment_id === body.paymentId
      ? 'already-completed'
      : paymentRecord.status === 'Completed'
        ? 'conflict'
        : 'complete';

    if (completionAction === 'conflict') {
      return NextResponse.json({ error: 'This order is already linked to another payment.' }, { status: 409 });
    }
    if (completionAction === 'already-completed') {
      return NextResponse.json({ success: true });
    }

    const { data: completedPayment, error: completionError } = await serviceClient
      .from('payments')
      .update({
        status: 'Completed',
        provider_payment_id: body.paymentId,
        provider_signature: body.signature,
        paid_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id)
      .in('status', ['Pending', 'Failed'])
      .select('id')
      .maybeSingle();
    if (completionError) throw completionError;
    if (!completedPayment) {
      const { data: latestPayment, error: latestPaymentError } = await serviceClient
        .from('payments')
        .select('provider_payment_id, status')
        .eq('id', paymentRecord.id)
        .maybeSingle();
      if (latestPaymentError) throw latestPaymentError;
      if (latestPayment?.status !== 'Completed' || latestPayment.provider_payment_id !== body.paymentId) {
        return NextResponse.json({ error: 'This order is no longer eligible for payment completion.' }, { status: 409 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Could not verify Razorpay certificate payment:', error);
    return NextResponse.json({ error: 'Could not confirm payment. Please contact support if you were charged.' }, { status: 500 });
  }
}
