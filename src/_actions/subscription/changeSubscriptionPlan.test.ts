import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, unstableUpdateMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  unstableUpdateMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({
  auth: authMock,
  unstable_update: unstableUpdateMock,
}));

import { AppError } from '@/_lib/AppError';
import { actionChangeSubscriptionPlan } from './changeSubscriptionPlan';

const VALID_PRODUCT_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c';

describe('actionChangeSubscriptionPlan (UT-161)', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    unstableUpdateMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    unstableUpdateMock.mockResolvedValue(null);
    apiClientMock.mockResolvedValue({});
  });

  it('calls the backend plan endpoint with just the productId', async () => {
    const [result, error] = await actionChangeSubscriptionPlan({
      productId: VALID_PRODUCT_ID,
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
    expect(apiClientMock).toHaveBeenCalledWith('/users/subscription/plan', {
      method: 'PATCH',
      body: JSON.stringify({ productId: VALID_PRODUCT_ID }),
    });
  });

  it('refreshes the session after the backend confirms the change', async () => {
    await actionChangeSubscriptionPlan({ productId: VALID_PRODUCT_ID });

    expect(unstableUpdateMock).toHaveBeenCalledOnce();
    const patchOrder = apiClientMock.mock.invocationCallOrder.at(-1)!;
    expect(unstableUpdateMock.mock.invocationCallOrder[0]).toBeGreaterThan(
      patchOrder
    );
  });

  it('keeps the change when the session refresh fails', async () => {
    unstableUpdateMock.mockRejectedValue(new Error('no cookie context'));

    const [result, error] = await actionChangeSubscriptionPlan({
      productId: VALID_PRODUCT_ID,
    });

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
  });

  it('rejects a non-UUID product id before calling the API', async () => {
    const [, error] = await actionChangeSubscriptionPlan({
      productId: '../users/subscription',
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it("forwards the backend's own safe message when there is no active subscription", async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Nenhuma assinatura ativa para alterar.', 400)
    );

    const [, error] = await actionChangeSubscriptionPlan({
      productId: VALID_PRODUCT_ID,
    });

    expect(error?.message).toBe('Nenhuma assinatura ativa para alterar.');
    expect(unstableUpdateMock).not.toHaveBeenCalled();
  });
});
