import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  fetchPlanClaimsMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionGetClientById } from './getClientById';

const CLIENT_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5d';

describe('path id validation — actionGetClientById', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  });

  it('UT-012 fetches the client addressed by a valid UUID', async () => {
    apiClientMock.mockResolvedValue({ id: CLIENT_ID });

    const [result, error] = await actionGetClientById({ id: CLIENT_ID });

    expect(error).toBeNull();
    expect(result).toEqual({ id: CLIENT_ID });
    expect(apiClientMock).toHaveBeenCalledWith(`/clients/${CLIENT_ID}`, {
      method: 'GET',
    });
  });

  it('keeps treating the new-client sentinel as no client', async () => {
    const [result, error] = await actionGetClientById({ id: '0' });

    expect(error).toBeNull();
    expect(result).toBeUndefined();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it.each(['../profile', ''])(
    'UT-013 rejects the non-UUID id %j before calling the API',
    async id => {
      const [, error] = await actionGetClientById({ id });

      expect(error?.message).toBe('Identificador inválido.');
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );
});

/** A signed-in professional, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('test coverage — actionGetClientById', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('rejects a request without a session before calling the API', async () => {
    authMock.mockResolvedValue({});

    const [, error] = await actionGetClientById({ id: CLIENT_ID });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  // UT-010
  it.each([
    [401, 'Você não tem acesso a este cliente.'],
    [404, 'Cliente não encontrado.'],
  ])('maps a backend %i to its safe message', async (status, message) => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', status));

    const [, error] = await actionGetClientById({ id: CLIENT_ID });

    expect(error?.message).toBe(message);
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new Error('socket hang up'));

    const [, error] = await actionGetClientById({ id: CLIENT_ID });

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
