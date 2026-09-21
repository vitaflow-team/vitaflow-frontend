import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, constructEventMock, retrieveSubscriptionMock } =
  vi.hoisted(() => ({
    apiClientMock: vi.fn(),
    constructEventMock: vi.fn(),
    retrieveSubscriptionMock: vi.fn(),
  }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

vi.mock('@/_lib/stripe', () => ({
  stripe: {
    webhooks: { constructEvent: constructEventMock },
    subscriptions: { retrieve: retrieveSubscriptionMock },
  },
}));

import { POST } from './route';

const PERIOD_END_UNIX = 1789000000;
const PERIOD_END_ISO = '2026-09-10T00:26:40.000Z';

function subscription(item: Record<string, unknown> = {}) {
  return {
    id: 'sub_123',
    customer: 'cus_123',
    status: 'active',
    cancel_at: null,
    metadata: { userId: 'user-id' },
    items: {
      data: [
        {
          id: 'si_123',
          price: { id: 'price_123' },
          current_period_end: PERIOD_END_UNIX,
          ...item,
        },
      ],
    },
  };
}

function webhookRequest(): Request {
  return new Request('https://app.vitaflow.test/api/stripe/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': 'signature' },
    body: '{}',
  });
}

function syncedBody(): string {
  expect(apiClientMock).toHaveBeenCalledTimes(1);
  const [path, init] = apiClientMock.mock.calls[0];
  expect(path).toBe('/users/subscription/sync');
  expect(init.method).toBe('PATCH');

  return init.body as string;
}

describe('Stripe webhook route', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    constructEventMock.mockReset();
    retrieveSubscriptionMock.mockReset();
    apiClientMock.mockResolvedValue({});
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('IT-001 sends the period end for customer.subscription.updated', async () => {
    constructEventMock.mockReturnValue({
      type: 'customer.subscription.updated',
      data: { object: subscription() },
    });

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(JSON.parse(syncedBody())).toMatchObject({
      stripeSubscriptionId: 'sub_123',
      subscriptionStatus: 'active',
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
    expect(retrieveSubscriptionMock).not.toHaveBeenCalled();
  });

  it('IT-002 sends the period end for checkout.session.completed', async () => {
    constructEventMock.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'subscription',
          subscription: 'sub_123',
          customer: 'cus_123',
          metadata: { userId: 'user-id' },
        },
      },
    });
    retrieveSubscriptionMock.mockResolvedValue(subscription());

    await POST(webhookRequest());

    expect(retrieveSubscriptionMock).toHaveBeenCalledWith('sub_123');
    expect(JSON.parse(syncedBody())).toMatchObject({
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
  });

  it('IT-003 sends the period end for invoice.payment_failed', async () => {
    constructEventMock.mockReturnValue({
      type: 'invoice.payment_failed',
      data: {
        object: {
          parent: { subscription_details: { subscription: 'sub_123' } },
        },
      },
    });
    retrieveSubscriptionMock.mockResolvedValue({
      ...subscription(),
      status: 'past_due',
    });

    await POST(webhookRequest());

    expect(retrieveSubscriptionMock).toHaveBeenCalledWith('sub_123');
    expect(JSON.parse(syncedBody())).toMatchObject({
      subscriptionStatus: 'past_due',
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
  });

  it('IT-004 clears the period end for customer.subscription.deleted', async () => {
    constructEventMock.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: subscription() },
    });

    await POST(webhookRequest());

    const body = syncedBody();
    // Explicit null — deletion is the one event that clears the stored value.
    expect(body).toContain('"subscriptionCurrentPeriodEnd":null');
    expect(JSON.parse(body)).toMatchObject({
      subscriptionStatus: 'canceled',
      subscriptionCurrentPeriodEnd: null,
      subscriptionCancelAt: null,
      stripeSubscriptionId: null,
    });
  });

  it('IT-005 omits the key when Stripe reports no period end', async () => {
    constructEventMock.mockReturnValue({
      type: 'customer.subscription.updated',
      data: { object: subscription({ current_period_end: undefined }) },
    });

    await POST(webhookRequest());

    const body = syncedBody();
    // Absent key, not null — an omitted value never clears the stored one.
    expect(body).not.toContain('subscriptionCurrentPeriodEnd');
    expect('subscriptionCurrentPeriodEnd' in (JSON.parse(body) as object)).toBe(
      false
    );
  });
});
