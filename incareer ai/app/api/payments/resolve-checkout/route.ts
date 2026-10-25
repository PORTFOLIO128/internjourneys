import { NextResponse } from 'next/server';
import {
  CERTIFICATE_FEE_PAIS,
  CERTIFICATE_FEE_RUPEES,
  inspectRazorpayOrder,
} from '@/lib/payments/razorpay';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAccessToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Please sign in to check this checkout.' }, { status: 401 });
  }

  try {
    const body = await request.json() as { orderId?: unknown };
    if (typeof body.orderId !== 'string' || !body.orderId) {
      return NextResponse.json({ error: 'A Razorpay order ID is required.' }, { status: 400 });
    }

    const userClient = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
    }

    const serviceClient = createServiceRoleSupabaseClient();
    const { data: paymentRecord, error: paymentError } = await serviceClient
      .from('payments')
      .select('id, amount, currency, purpose, provider_order_id, provider_payment_id, status')
      .eq('student_id', user.id)
      .eq('provider', 'razorpay')
      .eq('provider_order_id', body.orderId)
      .maybeSingle();

    if (paymentError) throw paymentError;
    if (!paymentRecord) {
      return NextResponse.json({ error: 'Checkout order was not found.' }, { status: 404 });
    }
    if (
      paymentRecord.amount !== CERTIFICATE_FEE_RUPEES ||
      paymentRecord.currency !== 'INR' ||
      paymentRecord.purpose !== 'Certificate fee'
    ) {
      return NextResponse.json({ error: 'This order does not match the certificate fee.' }, { status: 400 });
    }
    if (paymentRecord.status === 'Refunded') {
      return NextResponse.json({ status: 'Refunded' });
    }
    if (paymentRecord.status === 'Failed') {
      return NextResponse.json({ status: 'Failed' });
    }

    let disposition: 'Completed' | 'Pending' | 'Failed' | 'Cancelled';
    let capturedPayment: { id: string } | null = null;
    let failedPayment: { id: string } | null = null;

    try {
      const inspected = await inspectRazorpayOrder(
        body.orderId,
        CERTIFICATE_FEE_PAIS
      );
      disposition = inspected.disposition;
      capturedPayment = inspected.capturedPayment || null;
      failedPayment = inspected.failedPayment || null;
    } catch (inspectError) {
      console.warn(`Could not inspect Razorpay order ${body.orderId}:`, inspectError);
      if (paymentRecord.status === 'Pending') {
        await serviceClient
          .from('payments')
          .update({ status: 'Failed', paid_at: null })
          .eq('id', paymentRecord.id)
          .eq('status', 'Pending');
      }
      return NextResponse.json({ status: 'Failed' });
    }

    if (disposition === 'Completed' && capturedPayment) {
      if (
        paymentRecord.status === 'Completed' &&
        paymentRecord.provider_payment_id !== capturedPayment.id
      ) {
        return NextResponse.json({ error: 'Order is already linked to another captured payment.' }, { status: 409 });
      }
      if (paymentRecord.status === 'Completed') {
        return NextResponse.json({ status: 'Completed' });
      }
      const { data: updatedPayment, error: updateError } = await serviceClient
        .from('payments')
        .update({
          status: 'Completed',
          provider_payment_id: capturedPayment.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.id)
        .in('status', ['Pending', 'Failed'])
        .select('id')
        .maybeSingle();
      if (updateError) throw updateError;
      if (!updatedPayment && paymentRecord.status !== 'Completed') {
        throw new Error('Payment state changed before the captured payment could be recorded.');
      }
      return NextResponse.json({ status: 'Completed' });
    }

    if (disposition === 'Failed' && failedPayment && paymentRecord.status === 'Pending') {
      const { error: updateError } = await serviceClient
        .from('payments')
        .update({
          status: 'Failed',
          provider_payment_id: failedPayment.id,
          paid_at: null,
        })
        .eq('id', paymentRecord.id)
        .eq('status', 'Pending');
      if (updateError) throw updateError;
    } else if (disposition === 'Cancelled' && paymentRecord.status === 'Pending') {
      const { error: updateError } = await serviceClient
        .from('payments')
        .update({ status: 'Failed', provider_payment_id: null, paid_at: null })
        .eq('id', paymentRecord.id)
        .eq('status', 'Pending');
      if (updateError) throw updateError;
    }

    return NextResponse.json({ status: disposition });
  } catch (error) {
    console.error('Could not resolve Razorpay checkout status:', error);
    return NextResponse.json(
      { error: 'Could not verify the checkout status with Razorpay. The payment remains unresolved.' },
      { status: 500 }
    );
  }
}
