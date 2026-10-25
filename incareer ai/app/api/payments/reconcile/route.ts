import { NextResponse } from 'next/server';
import { CERTIFICATE_FEE_PAIS, findCapturedRazorpayPayment } from '@/lib/payments/razorpay';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAccessToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Please sign in before checking payment status.' }, { status: 401 });
  }

  const requiredEnv = [
    'RAZORPAY_KEY_ID',
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
    const userClient = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
    }

    const serviceClient = createServiceRoleSupabaseClient();
    const { data: pendingPayments, error: paymentError } = await serviceClient
      .from('payments')
      .select('provider_order_id')
      .eq('student_id', user.id)
      .eq('provider', 'razorpay')
      .eq('purpose', 'Certificate fee')
      .in('status', ['Pending', 'Failed'])
      .not('provider_order_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);
    if (paymentError) throw paymentError;

    for (const payment of pendingPayments || []) {
      if (!payment.provider_order_id) continue;
      const paymentId = await findCapturedRazorpayPayment(payment.provider_order_id, CERTIFICATE_FEE_PAIS);
      if (!paymentId) continue;

      const { data: completedPayment, error: completionError } = await serviceClient
        .from('payments')
        .update({
          status: 'Completed',
          provider_payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq('student_id', user.id)
        .eq('provider', 'razorpay')
        .eq('provider_order_id', payment.provider_order_id)
        .in('status', ['Pending', 'Failed'])
        .select('id')
        .maybeSingle();
      if (completionError) throw completionError;
      if (!completedPayment) {
        const { data: latestPayment, error: latestPaymentError } = await serviceClient
          .from('payments')
          .select('provider_payment_id, status')
          .eq('student_id', user.id)
          .eq('provider', 'razorpay')
          .eq('provider_order_id', payment.provider_order_id)
          .maybeSingle();
        if (latestPaymentError) throw latestPaymentError;
        if (latestPayment?.status !== 'Completed' || latestPayment.provider_payment_id !== paymentId) {
          throw new Error('The pending order changed before payment reconciliation completed.');
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'No captured payment was found for your recent pending orders. Do not pay again if you were charged; contact support.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Could not reconcile Razorpay certificate payment:', error);
    return NextResponse.json(
      { error: 'Could not check payment status. Please contact support if you were charged.' },
      { status: 500 }
    );
  }
}
