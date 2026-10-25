import { createHmac, timingSafeEqual } from 'node:crypto';

export const CERTIFICATE_FEE_RUPEES = 99;
export const CERTIFICATE_FEE_PAIS = CERTIFICATE_FEE_RUPEES * 100;

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayOrderPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  captured: boolean;
}

export type RazorpayPaymentDisposition = 'Completed' | 'Pending' | 'Failed' | 'Cancelled';

export function getRazorpayPaymentDisposition({
  orderId,
  orderStatus,
  attempts,
  payments,
  expectedAmount,
}: {
  orderId: string;
  orderStatus: string;
  attempts: number;
  payments: RazorpayOrderPayment[];
  expectedAmount: number;
}): RazorpayPaymentDisposition {
  const matchingPayments = payments.filter(
    (payment) =>
      payment.order_id === orderId &&
      payment.amount === expectedAmount &&
      payment.currency === 'INR'
  );

  if (matchingPayments.some((payment) => payment.status === 'captured' && payment.captured)) {
    return 'Completed';
  }

  if (matchingPayments.some((payment) => ['created', 'authorized'].includes(payment.status))) {
    return 'Pending';
  }

  if (orderStatus === 'created' && attempts === 0 && matchingPayments.length === 0) {
    return 'Cancelled';
  }

  if (
    orderStatus === 'attempted' &&
    matchingPayments.length > 0 &&
    matchingPayments.every((payment) => payment.status === 'failed')
  ) {
    return 'Failed';
  }

  return 'Pending';
}

export function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured.');
  }

  return { keyId, keySecret };
}

export async function createRazorpayOrder(receipt: string, amountInPaise = CERTIFICATE_FEE_PAIS) {
  if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
    throw new Error('Payment amount must be at least 100 paise.');
  }

  const { keyId, keySecret } = getRazorpayCredentials();
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay order creation failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json() as {
    id?: string;
    amount?: number;
    currency?: string;
    receipt?: string;
    error?: { description?: string };
  };

  if (!data.id || typeof data.amount !== 'number' || !data.currency) {
    throw new Error('Razorpay returned an invalid order response.');
  }

  return {
    id: data.id,
    order_id: data.id,
    amount: data.amount,
    currency: data.currency,
    receipt: data.receipt || receipt,
  } as RazorpayOrderResponse & { order_id: string };
}

export async function findCapturedRazorpayPayment(orderId: string, expectedAmount: number) {
  const payments = await getRazorpayOrderPayments(orderId);
  const capturedPayment = payments.find(
    (payment) =>
      payment.order_id === orderId &&
      payment.amount === expectedAmount &&
      payment.currency === 'INR' &&
      payment.status === 'captured' &&
      payment.captured
  );
  return capturedPayment?.id || null;
}

export async function getRazorpayOrderPayments(orderId: string) {
  const { keyId, keySecret } = getRazorpayCredentials();
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(
    `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments?count=100`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay payment lookup failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json() as {
    items?: Array<{
      id?: string;
      order_id?: string;
      amount?: number;
      currency?: string;
      status?: string;
      captured?: boolean;
    }>;
  };

  if (!Array.isArray(data.items)) {
    throw new Error('Razorpay returned an invalid order payment response.');
  }

  return data.items.filter(
    (item): item is RazorpayOrderPayment =>
      typeof item.id === 'string' &&
      typeof item.order_id === 'string' &&
      typeof item.amount === 'number' &&
      typeof item.currency === 'string' &&
      typeof item.status === 'string' &&
      typeof item.captured === 'boolean'
  );
}

export async function getRazorpayOrder(orderId: string) {
  const { keyId, keySecret } = getRazorpayCredentials();
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(
    `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay order lookup failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json() as {
    id?: string;
    status?: string;
    attempts?: number;
    amount?: number;
    currency?: string;
  };
  if (
    data.id !== orderId ||
    typeof data.status !== 'string' ||
    typeof data.attempts !== 'number' ||
    typeof data.amount !== 'number' ||
    typeof data.currency !== 'string'
  ) {
    throw new Error('Razorpay returned an invalid order status response.');
  }

  return { status: data.status, attempts: data.attempts, amount: data.amount, currency: data.currency };
}

export async function inspectRazorpayOrder(orderId: string, expectedAmount: number) {
  const [order, payments] = await Promise.all([
    getRazorpayOrder(orderId),
    getRazorpayOrderPayments(orderId),
  ]);
  if (order.amount !== expectedAmount || order.currency !== 'INR') {
    throw new Error('Razorpay order amount or currency does not match.');
  }

  const disposition = getRazorpayPaymentDisposition({
    orderId,
    orderStatus: order.status,
    attempts: order.attempts,
    payments,
    expectedAmount,
  });
  const capturedPayment = payments.find(
    (payment) =>
      payment.order_id === orderId &&
      payment.amount === expectedAmount &&
      payment.currency === 'INR' &&
      payment.status === 'captured' &&
      payment.captured
  );
  const failedPayment = [...payments].reverse().find(
    (payment) =>
      payment.order_id === orderId &&
      payment.amount === expectedAmount &&
      payment.currency === 'INR' &&
      payment.status === 'failed'
  );

  return { disposition, capturedPayment, failedPayment };
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  keySecret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  keySecret: string;
}) {
  if (!orderId || !paymentId || !signature || !keySecret) {
    return false;
  }

  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const supplied = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (supplied.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(supplied, expectedBuffer);
}

export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
  webhookSecret,
}: {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}) {
  if (!rawBody || !signature || !webhookSecret || !/^[a-f\d]{64}$/i.test(signature)) {
    return false;
  }

  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest();
  const supplied = Buffer.from(signature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
