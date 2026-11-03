import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionCreateCheckoutSession } from './createCheckoutSession';

const VALID_PRODUCT_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5c';

describe('actionCreateCheckoutSession (UT-160)', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('calls the backend checkout endpoint and maps {link} to {url}', async () => {
    apiClientMock.mockResolvedValue({
      link: 'https://asaas.com/checkoutSession/show?id=abc',
    });

    const [result, error] = await actionCreateCheckoutSession({
      productId: VALID_PRODUCT_ID,
    });

    expect(error).toBeNull();
    expect(result).toEqual({
      url: 'https://asaas.com/checkoutSession/show?id=abc',
    });
    expect(apiClientMock).toHaveBeenCalledWith('/users/subscription/checkout', {
      method: 'POST',
      body: JSON.stringify({ productId: VALID_PRODUCT_ID }),
    });
  });

  it('rejects without a session and never calls the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionCreateCheckoutSession({
      productId: VALID_PRODUCT_ID,
    });

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('rejects a non-UUID product id before calling the API', async () => {
    const [, error] = await actionCreateCheckoutSession({ productId: '123' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it("forwards the backend's own safe message for a known business error", async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Este plano não precisa de assinatura.', 400)
    );

    const [, error] = await actionCreateCheckoutSession({
      productId: VALID_PRODUCT_ID,
    });

    expect(error?.message).toBe('Este plano não precisa de assinatura.');
  });

  it('falls back to the generic message for an unexpected failure', async () => {
    apiClientMock.mockRejectedValue(new Error('network blip'));

    const [, error] = await actionCreateCheckoutSession({
      productId: VALID_PRODUCT_ID,
    });

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
