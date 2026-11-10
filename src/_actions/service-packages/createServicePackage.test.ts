import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { createServicePackage } from './createServicePackage';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'professional-id' } });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('createServicePackage — plan-pricing-management US-006', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('creates a package', async () => {
    apiClientMock.mockResolvedValue({ id: 'sp-1' });

    const [, error] = await createServicePackage({
      name: 'Pacote de 10',
      sessionCount: 10,
      referencePrice: 1200,
    });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/service-packages', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Pacote de 10',
        sessionCount: 10,
        referencePrice: 1200,
      }),
    });
  });

  it('rejects when there is no authenticated session, without calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await createServicePackage({
      name: 'Pacote de 10',
      sessionCount: 10,
      referencePrice: 1200,
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it.each([
    [404, 'service_package_not_found', 'Pacote não encontrado.'],
    [
      400,
      'service_package_invalid',
      'Verifique os dados do pacote: nome, quantidade de sessões e valor de referência.',
    ],
  ])(
    'maps a backend %i/%s (auth/ownership failure) to its safe message',
    async (status, code, message) => {
      apiClientMock.mockRejectedValue(
        new AppError('raw backend detail', status, code)
      );

      const [, error] = await createServicePackage({
        name: 'Pacote de 10',
        sessionCount: 10,
        referencePrice: 1200,
      });

      expect(error?.message).toBe(message);
    }
  );
});
