import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  apiClientMock,
  authMock,
  unstableUpdateMock,
  retrieveSubscriptionMock,
  updateSubscriptionMock,
} = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  unstableUpdateMock: vi.fn(),
  retrieveSubscriptionMock: vi.fn(),
  updateSubscriptionMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({
  auth: authMock,
  unstable_update: unstableUpdateMock,
}));
vi.mock('@/_lib/stripe', () => ({
  stripe: {
    subscriptions: {
      retrieve: retrieveSubscriptionMock,
      update: updateSubscriptionMock,
    },
  },
}));

import { actionChangeSubscriptionPlan } from './changeSubscriptionPlan';

const PERIOD_END_ISO = '2026-09-10T00:26:40.000Z';

function arrangeSuccessfulChange() {
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  apiClientMock.mockImplementation(async (path: string) => {
    if (path === '/products/0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c') {
      return {
        id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
        stripeId: 'price_new',
      };
    }
    if (path === '/users/subscription') {
      return {
        stripeSubscriptionId: 'sub_123',
        subscriptionStatus: 'active',
      };
    }
    return {};
  });
  retrieveSubscriptionMock.mockResolvedValue({
    id: 'sub_123',
    items: { data: [{ id: 'si_123' }] },
  });
  updateSubscriptionMock.mockResolvedValue({
    id: 'sub_123',
    customer: 'cus_123',
    status: 'active',
    items: { data: [{ id: 'si_123', current_period_end: 1789000000 }] },
  });
}

describe('actionChangeSubscriptionPlan', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    retrieveSubscriptionMock.mockReset();
    updateSubscriptionMock.mockReset();
    unstableUpdateMock.mockReset();
    unstableUpdateMock.mockResolvedValue(null);
  });

  it('IT-007 sends the updated subscription period end on a plan change', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockImplementation(async (path: string) => {
      if (path === '/products/0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c') {
        return {
          id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
          stripeId: 'price_new',
        };
      }
      if (path === '/users/subscription') {
        return {
          stripeSubscriptionId: 'sub_123',
          subscriptionStatus: 'active',
        };
      }
      return {};
    });
    retrieveSubscriptionMock.mockResolvedValue({
      id: 'sub_123',
      items: { data: [{ id: 'si_123' }] },
    });
    updateSubscriptionMock.mockResolvedValue({
      id: 'sub_123',
      customer: 'cus_123',
      status: 'active',
      items: { data: [{ id: 'si_123', current_period_end: 1789000000 }] },
    });

    const [result, error] = await actionChangeSubscriptionPlan({
      productId: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });

    const patchCall = apiClientMock.mock.calls.find(
      ([, init]) => init?.method === 'PATCH'
    );
    expect(patchCall?.[0]).toBe('/users/subscription');
    expect(JSON.parse(patchCall?.[1].body as string)).toEqual({
      productId: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
      subscriptionStatus: 'active',
      subscriptionCurrentPeriodEnd: PERIOD_END_ISO,
    });
  });
});

describe('immediate access update — actionChangeSubscriptionPlan', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    retrieveSubscriptionMock.mockReset();
    updateSubscriptionMock.mockReset();
    unstableUpdateMock.mockReset();
    unstableUpdateMock.mockResolvedValue(null);
  });

  it('UT-030 refreshes the session after the backend patch', async () => {
    arrangeSuccessfulChange();

    const [result, error] = await actionChangeSubscriptionPlan({
      productId: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
    expect(unstableUpdateMock).toHaveBeenCalledOnce();

    const patchOrder = apiClientMock.mock.invocationCallOrder.at(-1)!;
    expect(unstableUpdateMock.mock.invocationCallOrder[0]).toBeGreaterThan(
      patchOrder
    );
  });

  it('UT-030 keeps the change when the refresh fails', async () => {
    arrangeSuccessfulChange();
    unstableUpdateMock.mockRejectedValue(new Error('no cookie context'));

    const [result, error] = await actionChangeSubscriptionPlan({
      productId: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
  });
});

describe('path id validation — actionChangeSubscriptionPlan', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    updateSubscriptionMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('UT-013 rejects a non-UUID product id before calling the API', async () => {
    const [, error] = await actionChangeSubscriptionPlan({
      productId: '../users/subscription',
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(updateSubscriptionMock).not.toHaveBeenCalled();
  });
});
