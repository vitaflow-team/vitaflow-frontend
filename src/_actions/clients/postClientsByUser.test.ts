import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock, revalidateTagMock } =
  vi.hoisted(() => ({
    apiClientMock: vi.fn(),
    authMock: vi.fn(),
    fetchPlanClaimsMock: vi.fn(),
    revalidateTagMock: vi.fn(),
  }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/cache', () => ({ revalidateTag: revalidateTagMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionPostClientByUser } from './postClientsByUser';

const CLIENT = {
  name: 'Ana',
  phone: '(11) 91234-5678',
  email: 'Ana@Example.com',
  birthDate: '1990-01-01',
};

/** A signed-in professional, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  revalidateTagMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('test coverage — actionPostClientByUser', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('posts the parsed client and refreshes the client list tag', async () => {
    apiClientMock.mockResolvedValue({ id: 'new-client' });

    const [result, error] = await actionPostClientByUser(CLIENT);

    expect(error).toBeNull();
    expect(result).toEqual({ id: 'new-client' });
    expect(apiClientMock).toHaveBeenCalledWith('/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ana',
        birthDate: '1990-01-01',
        email: 'ana@example.com',
        phone: '(11) 91234-5678',
      }),
    });
    expect(revalidateTagMock).toHaveBeenCalledWith('list-clientsByUser', {
      expire: 0,
    });
  });

  // UT-010
  it('rejects a request without a session before calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionPostClientByUser(CLIENT);

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });
});

describe('test coverage — actionPostClientByUser backend errors', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it.each([
    [400, 'Verifique os dados do cliente e tente novamente.'],
    [402, 'Já existe um cliente cadastrado com este e-mail.'],
    [404, 'Cliente não encontrado.'],
  ])(
    'maps a backend %i to its safe message without revalidating',
    async (status, message) => {
      apiClientMock.mockRejectedValue(
        new AppError('raw backend detail', status)
      );

      const [, error] = await actionPostClientByUser(CLIENT);

      expect(error?.message).toBe(message);
      expect(revalidateTagMock).not.toHaveBeenCalled();
    }
  );

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionPostClientByUser(CLIENT);

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
