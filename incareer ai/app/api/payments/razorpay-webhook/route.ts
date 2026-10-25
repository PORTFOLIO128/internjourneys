import { NextResponse } from 'next/server';
import {
  CERTIFICATE_FEE_PAIS,
  CERTIFICATE_FEE_RUPEES,
  verifyRazorpayWebhookSignature,
} from '@/lib/payments/razorpay';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Razorpay webhook is not configured.' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  if (!verifyRazorpayWebhookSignature({ rawBody, signature, webhookSecret })) {
    return NextResponse.json({ error: 'Invalid Razorpay webhook signature.' }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  if (!isRecord(event) || typeof event.event !== 'string') {
    return NextResponse.json({ error: 'Invalid Razorpay webhook event.' }, { status: 400 });
  }
  if (event.event !== 'payment.captured' && event.event !== 'payment.failed') {
    return NextResponse.json({ received: true });
  }

  const payload = isRecord(event.payload) ? event.payload : null;
  const paymentContainer = payload && isRecord(payload.payment) ? payload.payment : null;
  const payment = paymentContainer && isRecord(paymentContainer.entity) ? paymentContainer.entity : null;
  if (
    !payment ||
    typeof payment.id !== 'string' ||
    typeof payment.order_id !== 'string' ||
    typeof payment.amount !== 'number' ||
    typeof payment.currency !== 'string' ||
    typeof payment.status !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid Razorpay payment payload.' }, { status: 400 });
  }

  const expectedStatus = event.event === 'payment.captured' ? 'captured' : 'failed';
  if (payment.status !== expectedStatus || payment.amount !== CERTIFICATE_FEE_PAIS || payment.currency !== 'INR') {
    return NextResponse.json({ error: 'Razorpay payment state or amount is invalid.' }, { status: 400 });
  }

  try {
    const serviceClient = createServiceRoleSupabaseClient();
    const { data: paymentRecord, error: lookupError } = await serviceClient
      .from('payments')
      .select('id, status, provider_payment_id, amount, currency, purpose')
      .eq('provider', 'razorpay')
      .eq('provider_order_id', payment.order_id)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!paymentRecord) return NextResponse.json({ received: true });
    if (
      paymentRecord.amount !== CERTIFICATE_FEE_RUPEES ||
      paymentRecord.currency !== 'INR' ||
      paymentRecord.purpose !== 'Certificate fee'
    ) {
      return NextResponse.json({ error: 'Payment record does not match the certificate fee.' }, { status: 400 });
    }
    if (paymentRecord.status === 'Refunded') return NextResponse.json({ received: true });

    if (event.event === 'payment.captured') {
      if (
        paymentRecord.status === 'Completed' &&
        paymentRecord.provider_payment_id === payment.id
      ) {
        return NextResponse.json({ received: true });
      }
      if (paymentRecord.status === 'Completed') {
        return NextResponse.json({ error: 'Order is already linked to another captured payment.' }, { status: 409 });
      }

      const { error: updateError } = await serviceClient
        .from('payments')
        .update({
          status: 'Completed',
          provider_payment_id: payment.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.id)
        .in('status', ['Pending', 'Failed']);
      if (updateError) throw updateError;
      return NextResponse.json({ received: true });
    }

    if (paymentRecord.status === 'Completed') return NextResponse.json({ received: true });
    if (paymentRecord.status === 'Pending') {
      const { error: updateError } = await serviceClient
        .from('payments')
        .update({
          status: 'Failed',
          provider_payment_id: payment.id,
          paid_at: null,
        })
        .eq('id', paymentRecord.id)
        .eq('status', 'Pending');
      if (updateError) throw updateError;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Could not process Razorpay payment webhook:', error);
    return NextResponse.json({ error: 'Could not process Razorpay webhook. Razorpay may retry.' }, { status: 500 });
  }
}
