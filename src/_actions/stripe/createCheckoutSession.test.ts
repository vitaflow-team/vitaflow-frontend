import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, createSessionMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  createSessionMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/_lib/env', () => ({
  env: {
    BACKEND_URL: 'https://backend.example.test',
    APP_SECRET_KEY: 'application-secret',
    STRIPE_API_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test',
  },
}));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: createSessionMock } } },
}));

import { actionCreateCheckoutSession } from './createCheckoutSession';

describe('settings checkout return', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    createSessionMock.mockReset();
  });

  it('UT-029 returns to the Plano tab on success and on cancellation', async () => {
    authMock.mockResolvedValue({
      user: { id: 'user-id', email: 'pessoa@exemplo.com' },
    });
    apiClientMock.mockImplementation(async (path: string) =>
      path.startsWith('/products/')
        ? {
            id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
            name: 'Premium',
            stripeId: 'price_123',
          }
        : {
            stripeCustomerId: 'cus_123',
            stripeSubscriptionId: null,
            subscriptionStatus: null,
          }
    );
    createSessionMock.mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/cs_1',
    });

    const [result, error] = await actionCreateCheckoutSession({
      productId: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_1' });

    const params = createSessionMock.mock.calls[0]?.[0];
    expect(params.success_url).toContain(
      '/restrict/settings?tab=plano&checkout_session_id={CHECKOUT_SESSION_ID}'
    );
    expect(params.cancel_url).toMatch(/\/restrict\/settings\?tab=plano$/);
  });
});

describe('path id validation — actionCreateCheckoutSession', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    createSessionMock.mockReset();
    authMock.mockResolvedValue({
      user: { id: 'user-id', email: 'pessoa@exemplo.com' },
    });
  });

  it('UT-013 rejects a non-UUID product id before calling the API', async () => {
    const [, error] = await actionCreateCheckoutSession({ productId: '123' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(createSessionMock).not.toHaveBeenCalled();
  });
});
