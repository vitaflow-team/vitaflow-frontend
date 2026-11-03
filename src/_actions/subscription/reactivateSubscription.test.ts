import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionReactivateSubscription } from './reactivateSubscription';

describe('actionReactivateSubscription (UT-163)', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockResolvedValue({});
  });

  it('calls the backend reactivate endpoint with no body', async () => {
    const [result, error] = await actionReactivateSubscription();

    expect(error).toBeNull();
    expect(result).toEqual({ success: true });
    expect(apiClientMock).toHaveBeenCalledWith(
      '/users/subscription/reactivate',
      { method: 'PATCH' }
    );
  });

  it('rejects without a session and never calls the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionReactivateSubscription();

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it("forwards the backend's own safe message for a known business error", async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Nenhuma assinatura para reativar.', 400)
    );

    const [, error] = await actionReactivateSubscription();

    expect(error?.message).toBe('Nenhuma assinatura para reativar.');
  });

  it('falls back to the generic message for an unexpected failure', async () => {
    apiClientMock.mockRejectedValue(new Error('network blip'));

    const [, error] = await actionReactivateSubscription();

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
