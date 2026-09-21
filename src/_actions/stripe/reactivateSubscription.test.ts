import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, updateSubscriptionMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  updateSubscriptionMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/stripe', () => ({
  stripe: { subscriptions: { update: updateSubscriptionMock } },
}));

import { actionReactivateSubscription } from './reactivateSubscription';

const PERIOD_END_ISO = '2026-09-10T00:26:40.000Z';

describe('actionReactivateSubscription', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    updateSubscriptionMock.mockReset();
  });

  it('IT-009 clears the cancellation date and sends the period end', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockImplementation(
      async (_path: string, init?: RequestInit) =>
        init?.method === 'GET'
          ? {
              productId: 'product-id',
              stripeCustomerId: 'cus_123',
              stripeSubscriptionId: 'sub_123',
            }
          : {}
    );
    updateSubscriptionMock.mockResolvedValue({
      id: 'sub_123',
      status: 'active',
      cancel_at: null,
      items: { data: [{ current_period_end: 1789000000 }] },
    });

    const [result, error] = await actionReactivateSubscription();

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
    expect(updateSubscriptionMock).toHaveBeenCalledWith('sub_123', {
      cancel_at_period_end: false,
    });

    const patchCall = apiClientMock.mock.calls.find(
      ([, init]) => init?.method === 'PATCH'
    );
    expect(patchCall?.[0]).toBe('/users/subscription');
    expect(JSON.parse(patchCall?.[1].body as string)).toEqual({
      productId: 'product-id',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
      subscriptionStatus: 'active',
      subscriptionCancelAt: null,
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
  });
});
