import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  CERTIFICATE_FEE_PAIS,
  getRazorpayPaymentDisposition,
  verifyRazorpayWebhookSignature,
  type RazorpayOrderPayment,
} from '../lib/payments/razorpay';

const orderId = 'order_test_123';
const capturedPayment: RazorpayOrderPayment = {
  id: 'pay_captured_123',
  order_id: orderId,
  amount: CERTIFICATE_FEE_PAIS,
  currency: 'INR',
  status: 'captured',
  captured: true,
};

function disposition(
  orderStatus: string,
  attempts: number,
  payments: RazorpayOrderPayment[]
) {
  return getRazorpayPaymentDisposition({
    orderId,
    orderStatus,
    attempts,
    payments,
    expectedAmount: CERTIFICATE_FEE_PAIS,
  });
}

test('classifies a closed checkout with no payment attempt as cancelled', () => {
  assert.equal(disposition('created', 0, []), 'Cancelled');
});

test('classifies provider-confirmed failed attempts as failed', () => {
  assert.equal(
    disposition('attempted', 1, [{ ...capturedPayment, status: 'failed', captured: false }]),
    'Failed'
  );
});

test('keeps authorized or otherwise unresolved payments pending', () => {
  assert.equal(
    disposition('attempted', 1, [{ ...capturedPayment, status: 'authorized', captured: false }]),
    'Pending'
  );
  assert.equal(disposition('attempted', 1, []), 'Pending');
});

test('treats capture as success even when an earlier attempt failed', () => {
  assert.equal(
    disposition('paid', 2, [
      { ...capturedPayment, status: 'failed', captured: false },
      capturedPayment,
    ]),
    'Completed'
  );
});

test('does not treat a wrong-amount payment as successful', () => {
  assert.equal(
    disposition('attempted', 1, [{ ...capturedPayment, amount: 50 }]),
    'Pending'
  );
});

test('validates Razorpay webhook signatures against the exact raw body', () => {
  const rawBody = '{"event":"payment.captured"}';
  const webhookSecret = 'test-webhook-secret';
  const signature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  assert.equal(verifyRazorpayWebhookSignature({ rawBody, signature, webhookSecret }), true);
  assert.equal(
    verifyRazorpayWebhookSignature({ rawBody: `${rawBody} `, signature, webhookSecret }),
    false
  );
  assert.equal(
    verifyRazorpayWebhookSignature({ rawBody, signature: 'invalid', webhookSecret }),
    false
  );
});
