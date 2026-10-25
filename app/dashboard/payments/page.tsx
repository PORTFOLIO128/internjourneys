'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, IndianRupee, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase/client';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: RazorpayFailureResponse) => void): void;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    reason?: string;
  };
}

type CheckoutResolution = 'Completed' | 'Pending' | 'Failed' | 'Cancelled' | 'Refunded';

interface CheckoutResolutionResponse {
  status?: CheckoutResolution;
  error?: string;
}

interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  accessToken: string
) {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, paymentId, signature }),
  });
  const result = await response.json() as { error?: string };
  if (!response.ok) throw new Error(result.error || 'Razorpay has not confirmed payment yet.');
}

export default function PaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);
  const [paymentStatusError, setPaymentStatusError] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [providerPaymentPending, setProviderPaymentPending] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<{
    response: RazorpaySuccessResponse;
    accessToken: string;
  } | null>(null);

  const refreshPaymentStatus = useCallback(async () => {
    setPaymentStatusLoading(true);
    setPaymentStatusError('');
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        setPaymentCompleted(false);
        setPaymentStatusLoading(false);
        return;
      }

      const statusResponse = await fetch('/api/payments/status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });
      const status = await statusResponse.json() as {
        paymentCompleted?: boolean;
        orderIds?: string[];
        error?: string;
      };
      if (!statusResponse.ok) throw new Error(status.error || 'Could not check payment status.');

      if (status.paymentCompleted) {
        setPaymentCompleted(true);
        setProviderPaymentPending(false);
        return;
      }

      let unresolved = false;
      for (const orderId of status.orderIds || []) {
        const resolutionResponse = await fetch('/api/payments/resolve-checkout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });
        const resolution = await resolutionResponse.json() as CheckoutResolutionResponse;
        if (!resolutionResponse.ok) {
          throw new Error(resolution.error || 'Could not verify your previous payment.');
        }
        if (resolution.status === 'Completed') {
          setPaymentCompleted(true);
          setProviderPaymentPending(false);
          return;
        }
        if (resolution.status === 'Pending') unresolved = true;
      }

      setPaymentCompleted(false);
      setProviderPaymentPending(unresolved);
    } catch (paymentError) {
      console.error('Could not load certificate payment status:', paymentError);
      setPaymentStatusError(
        paymentError instanceof Error
          ? paymentError.message
          : 'Could not check your payment status. Please retry before making another payment.'
      );
    } finally {
      setPaymentStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void refreshPaymentStatus();
  }, [authLoading, refreshPaymentStatus]);

  const confirmCapturedPayment = async (attempt: NonNullable<typeof pendingVerification>) => {
    setProcessing(true);
    setError('');
    try {
      await verifyPayment(
        attempt.response.razorpay_order_id,
        attempt.response.razorpay_payment_id,
        attempt.response.razorpay_signature,
        attempt.accessToken
      );
      setPendingVerification(null);
      setPaymentCompleted(true);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Could not confirm payment.');
    } finally {
      setProcessing(false);
    }
  };

  const checkPreviousPayment = async () => {
    setError('');
    await refreshPaymentStatus();
  };

  const resolveCheckout = async (orderId: string, accessToken: string) => {
    setProcessing(true);
    setError('');
    try {
      const response = await fetch('/api/payments/resolve-checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      const result = await response.json() as CheckoutResolutionResponse;
      if (!response.ok) throw new Error(result.error || 'Could not verify checkout status.');

      if (result.status === 'Completed') {
        setPaymentCompleted(true);
        setProviderPaymentPending(false);
      } else if (result.status === 'Failed') {
        setProviderPaymentPending(false);
        setError('Razorpay confirmed that this attempt failed. No successful payment was recorded. You can try again.');
      } else if (result.status === 'Cancelled') {
        setProviderPaymentPending(false);
        setError('Checkout was cancelled before a payment attempt. No payment was taken.');
      } else {
        setProviderPaymentPending(true);
        setError('Razorpay is still processing this payment. Do not pay again until its status is confirmed.');
      }
    } catch (checkoutError) {
      setProviderPaymentPending(true);
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not verify checkout status.');
    } finally {
      setProcessing(false);
    }
  };

  const startPayment = async () => {
    setProcessing(true);
    setError('');
    setPaymentStatusError('');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error('Please sign in again to continue.');

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const order = await orderResponse.json() as RazorpayOrderResponse & { error?: string };
      if (!orderResponse.ok) throw new Error(order.error || 'Could not start payment.');

      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Payment checkout could not be loaded. Please try again.');
      }

      const razorpayCheckout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'InternJourneys',
        description: 'Certificate fee',
        order_id: order.orderId,
        handler: async (response: RazorpaySuccessResponse) => {
          const attempt = { response, accessToken: session.access_token };
          setPendingVerification(attempt);
          await confirmCapturedPayment(attempt);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '',
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => {
            void resolveCheckout(order.orderId, session.access_token);
          },
        },
      });

      razorpayCheckout.on('payment.failed', (response) => {
        setError(
          response.error?.description ||
          response.error?.reason ||
          'Razorpay reported a failed payment attempt. You may retry in Checkout.'
        );
      });

      razorpayCheckout.open();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Could not confirm payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased">
      <DashboardNavbar />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="max-w-3xl space-y-6">
          <Link href="/dashboard/certifications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to certificate</span>
          </Link>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">Certificate payment</h1>
                  <p className="text-sm text-slate-500">Secure checkout powered by Razorpay</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-bold text-slate-900">Internship completion certificate</p>
                  <p className="mt-1 text-xs text-slate-500">One-time certificate processing fee</p>
                </div>
                <p className="flex shrink-0 items-center text-2xl font-extrabold text-slate-900">
                  <IndianRupee className="h-5 w-5" />99
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">Preview and download become available after server verification of payment and all required internship tasks.</p>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                By continuing, you acknowledge our <Link href="/terms-and-conditions" className="font-semibold text-indigo-600 hover:underline">Terms & Conditions</Link> and <Link href="/refund-policy" className="font-semibold text-indigo-600 hover:underline">Refund Policy</Link>. Read our <Link href="/privacy-policy" className="font-semibold text-indigo-600 hover:underline">Privacy Policy</Link>.
              </p>
              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}

              {paymentCompleted ? (
                <div role="status" className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center font-bold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Payment successful</span>
                </div>
              ) : paymentStatusLoading ? (
                <div role="status" className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking payment status...</span>
                </div>
              ) : paymentStatusError ? (
                <div className="space-y-3">
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{paymentStatusError}</p>
                  <p className="text-xs text-slate-500">
                    Payment status is unknown. To avoid a duplicate charge, checkout is disabled until the status check succeeds.
                  </p>
                  <button
                    type="button"
                    onClick={refreshPaymentStatus}
                    disabled={paymentStatusLoading}
                    className="w-full text-sm font-semibold text-indigo-700 hover:underline disabled:cursor-wait disabled:opacity-60"
                  >
                    Retry payment status check
                  </button>
                </div>
              ) : providerPaymentPending ? (
                <div className="space-y-3">
                  <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                    Razorpay is still processing a payment attempt. Do not pay again yet.
                  </p>
                  <button
                    type="button"
                    onClick={checkPreviousPayment}
                    disabled={paymentStatusLoading}
                    className="w-full text-sm font-semibold text-indigo-700 hover:underline disabled:cursor-wait disabled:opacity-60"
                  >
                    Check payment status again
                  </button>
                </div>
              ) : pendingVerification ? (
                <button
                  type="button"
                  onClick={() => confirmCapturedPayment(pendingVerification)}
                  disabled={processing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  <span>{processing ? 'Verifying payment...' : 'Retry payment verification — do not pay again'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
                    <span>{processing ? 'Processing...' : `Pay ₹99${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}</span>
                    {!processing && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={checkPreviousPayment}
                    disabled={processing}
                    className="w-full text-sm font-semibold text-indigo-700 hover:underline disabled:cursor-wait disabled:opacity-60"
                  >
                    Already paid? Check your recent payment (do not pay again)
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
