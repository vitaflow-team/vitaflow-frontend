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
import { actionDeleteClientsByUser } from './deleteClientsByUser';

const CLIENT_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5d';

describe('path id validation — actionDeleteClientsByUser', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  });

  it('UT-012 deletes the client addressed by a valid UUID', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await actionDeleteClientsByUser({ id: CLIENT_ID });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(`/clients/${CLIENT_ID}`, {
      method: 'DELETE',
    });
  });

  it('UT-013 rejects a non-UUID id before calling the API', async () => {
    const [, error] = await actionDeleteClientsByUser({ id: '../profile' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

/** A signed-in professional, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('test coverage — actionDeleteClientsByUser', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('returns what the backend answers for the deleted client', async () => {
    apiClientMock.mockResolvedValue({ id: CLIENT_ID });

    const [result, error] = await actionDeleteClientsByUser({ id: CLIENT_ID });

    expect(error).toBeNull();
    expect(result).toEqual({ id: CLIENT_ID });
  });

  // UT-010
  it('rejects a request without a session before calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionDeleteClientsByUser({ id: CLIENT_ID });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado');
    expect(fetchPlanClaimsMock).not.toHaveBeenCalled();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  // UT-010
  it('maps a backend 401 to its safe message', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 401));

    const [, error] = await actionDeleteClientsByUser({ id: CLIENT_ID });

    expect(error?.message).toBe('Exclusão não permitida.');
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionDeleteClientsByUser({ id: CLIENT_ID });

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
