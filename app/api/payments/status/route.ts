import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAccessToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
}

export async function GET(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Please sign in to check payment status.' }, { status: 401 });
  }

  try {
    const userClient = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
    }

    const serviceClient = createServiceRoleSupabaseClient();
    const { data: completedPayment, error: completedPaymentError } = await serviceClient
      .from('payments')
      .select('id')
      .eq('student_id', user.id)
      .eq('purpose', 'Certificate fee')
      .eq('status', 'Completed')
      .in('provider', ['razorpay', 'cashfree'])
      .not('provider_payment_id', 'is', null)
      .limit(1)
      .maybeSingle();

    if (completedPaymentError) throw completedPaymentError;
    if (completedPayment) {
      return NextResponse.json({ paymentCompleted: true, pendingPayment: false });
    }

    const { data: unresolvedPayments, error: pendingPaymentError } = await serviceClient
      .from('payments')
      .select('provider_order_id')
      .eq('student_id', user.id)
      .eq('purpose', 'Certificate fee')
      .eq('provider', 'razorpay')
      .eq('status', 'Pending')
      .not('provider_order_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (pendingPaymentError) throw pendingPaymentError;
    return NextResponse.json({
      paymentCompleted: false,
      orderIds: (unresolvedPayments || [])
        .map((payment) => payment.provider_order_id)
        .filter((orderId): orderId is string => Boolean(orderId)),
    });
  } catch (error) {
    console.error('Could not load certificate payment status:', error);
    return NextResponse.json(
      { error: 'Could not check payment status. Please retry the status check before paying.' },
      { status: 500 }
    );
  }
}
