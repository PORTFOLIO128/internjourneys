import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import {
  CERTIFICATE_FEE_PAIS,
  CERTIFICATE_FEE_RUPEES,
  createRazorpayOrder,
  inspectRazorpayOrder,
} from '@/lib/payments/razorpay';

export const runtime = 'nodejs';

function getAccessToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
}

function normalizeIndianPhone(phone: string | null | undefined) {
  let digits = phone?.replace(/\D/g, '') || '';
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^\d{10}$/.test(digits) ? digits : null;
}

export async function POST(request: Request) {
  let stage = 'checking your account';
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Please sign in before paying.' }, { status: 401 });
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
      { error: `Payment backend is not configured. Missing env: ${requiredEnv.join(', ')}` },
      { status: 503 }
    );
  }

  try {
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
    }
    if (!user.email) {
      return NextResponse.json({ error: 'A verified email is required to start payment.' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone, role')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    if (profile?.role !== 'student') {
      return NextResponse.json({ error: 'Only authenticated students can pay the certificate fee.' }, { status: 403 });
    }

    const phone = normalizeIndianPhone(profile?.phone);
    if (!phone) {
      return NextResponse.json(
        { error: 'Add a valid 10-digit phone number to your profile before paying.' },
        { status: 400 }
      );
    }

    const serviceSupabase = createServiceRoleSupabaseClient();
    const { data: completedPayments, error: paymentLookupError } = await serviceSupabase
      .from('payments')
      .select('id')
      .eq('student_id', user.id)
      .eq('purpose', 'Certificate fee')
      .in('provider', ['cashfree', 'razorpay'])
      .eq('status', 'Completed')
      .not('provider_payment_id', 'is', null)
      .limit(1);
    if (paymentLookupError) throw paymentLookupError;
    if (completedPayments?.length) {
      return NextResponse.json({ error: 'The certificate fee has already been paid.' }, { status: 409 });
    }

    stage = 'checking your previous payment attempt';
    const { data: pendingPayments, error: pendingLookupError } = await serviceSupabase
      .from('payments')
      .select('id, provider_order_id')
      .eq('student_id', user.id)
      .eq('purpose', 'Certificate fee')
      .eq('provider', 'razorpay')
      .eq('status', 'Pending')
      .not('provider_order_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);
    if (pendingLookupError) throw pendingLookupError;

    for (const pendingPayment of pendingPayments || []) {
      if (!pendingPayment.provider_order_id) continue;
      let previousAttempt;
      try {
        previousAttempt = await inspectRazorpayOrder(
          pendingPayment.provider_order_id,
          CERTIFICATE_FEE_PAIS
        );
      } catch (inspectError) {
        console.warn(`Could not inspect previous order ${pendingPayment.provider_order_id}:`, inspectError);
        await serviceSupabase
          .from('payments')
          .update({ status: 'Failed', paid_at: null })
          .eq('id', pendingPayment.id)
          .eq('status', 'Pending');
        continue;
      }

      if (previousAttempt.disposition === 'Completed' && previousAttempt.capturedPayment) {
        const { error: completionError } = await serviceSupabase
          .from('payments')
          .update({
            status: 'Completed',
            provider_payment_id: previousAttempt.capturedPayment.id,
            paid_at: new Date().toISOString(),
          })
          .eq('id', pendingPayment.id)
          .eq('status', 'Pending');
        if (completionError) throw completionError;
        return NextResponse.json({ error: 'The certificate fee has already been paid.' }, { status: 409 });
      }

      if (previousAttempt.disposition === 'Pending') {
        return NextResponse.json(
          { error: 'Your previous payment attempt is still being processed. Check its status before paying again.' },
          { status: 409 }
        );
      }

      const resolvedStatus = previousAttempt.disposition === 'Cancelled'
        ? 'Failed'
        : previousAttempt.disposition;
      const providerPaymentId = previousAttempt.failedPayment?.id || null;
      const { error: resolveError } = await serviceSupabase
        .from('payments')
        .update({
          status: resolvedStatus,
          provider_payment_id: providerPaymentId,
          paid_at: null,
        })
        .eq('id', pendingPayment.id)
        .eq('status', 'Pending');
      if (resolveError) throw resolveError;
    }

    const receipt = `cert-${user.id.slice(0, 8)}-${Date.now().toString().slice(-8)}`;
    stage = 'creating the Razorpay order';
    const order = await createRazorpayOrder(receipt, CERTIFICATE_FEE_PAIS);

    if (order.amount !== CERTIFICATE_FEE_PAIS || order.currency !== 'INR') {
      throw new Error('Razorpay returned an invalid order response.');
    }

    stage = 'saving your pending payment record';
    const { error: insertError } = await serviceSupabase.from('payments').insert({
      id: randomUUID(),
      student_id: user.id,
      amount: CERTIFICATE_FEE_RUPEES,
      currency: 'INR',
      purpose: 'Certificate fee',
      provider: 'razorpay',
      provider_order_id: order.order_id,
      status: 'Pending',
    });
    if (insertError) throw insertError;

    return NextResponse.json({
      orderId: order.order_id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Could not create Razorpay certificate payment order:', error);
    return NextResponse.json(
      { error: `Could not finish ${stage}. Please check payment status before retrying.` },
      { status: 500 }
    );
  }
}
