import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  apiClientMock,
  authMock,
  retrieveCheckoutSessionMock,
  retrieveSubscriptionMock,
} = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  retrieveCheckoutSessionMock: vi.fn(),
  retrieveSubscriptionMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/stripe', () => ({
  stripe: {
    checkout: { sessions: { retrieve: retrieveCheckoutSessionMock } },
    subscriptions: { retrieve: retrieveSubscriptionMock },
  },
}));

import { actionUpdateSubscription } from './postUpdateSubscription';

const PERIOD_END_ISO = '2026-09-10T00:26:40.000Z';

describe('actionUpdateSubscription', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    retrieveCheckoutSessionMock.mockReset();
    retrieveSubscriptionMock.mockReset();
  });

  it('IT-006 sends the retrieved subscription period end on the post-checkout sync', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    retrieveCheckoutSessionMock.mockResolvedValue({
      metadata: { userId: 'user-id', productId: 'product-id' },
      subscription: 'sub_123',
      customer: 'cus_123',
    });
    retrieveSubscriptionMock.mockResolvedValue({
      id: 'sub_123',
      status: 'active',
      items: { data: [{ current_period_end: 1789000000 }] },
    });
    apiClientMock.mockResolvedValue({});

    const [result, error] = await actionUpdateSubscription({
      sessionId: 'cs_123',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });

    const [path, init] = apiClientMock.mock.calls[0];
    expect(path).toBe('/users/subscription');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({
      productId: 'product-id',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
      subscriptionStatus: 'active',
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
  });
});
