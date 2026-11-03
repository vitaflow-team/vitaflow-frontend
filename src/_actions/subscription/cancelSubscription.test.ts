import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionCancelSubscription } from './cancelSubscription';

describe('actionCancelSubscription (UT-162)', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('calls the backend cancel endpoint with no body and returns its cancelAt', async () => {
    apiClientMock.mockResolvedValue({
      subscriptionCancelAt: '2026-09-10T00:26:40.000Z',
    });

    const [result, error] = await actionCancelSubscription();

    expect(error).toBeNull();
    expect(result).toEqual({ cancelAt: '2026-09-10T00:26:40.000Z' });
    expect(apiClientMock).toHaveBeenCalledWith('/users/subscription/cancel', {
      method: 'PATCH',
    });
  });

  it('rejects without a session and never calls the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionCancelSubscription();

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it("forwards the backend's own safe message for a known business error", async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Nenhuma assinatura ativa para cancelar.', 400)
    );

    const [, error] = await actionCancelSubscription();

    expect(error?.message).toBe('Nenhuma assinatura ativa para cancelar.');
  });

  it('falls back to the generic message for an unexpected failure', async () => {
    apiClientMock.mockRejectedValue(new Error('network blip'));

    const [, error] = await actionCancelSubscription();

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
