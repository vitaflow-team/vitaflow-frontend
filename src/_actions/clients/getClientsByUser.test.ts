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
import { actionGetClientsByUser } from './getClientsByUser';

const CLIENTS = [
  {
    id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5d',
    name: 'Ana',
    phone: '(11) 91234-5678',
    email: 'ana@example.com',
    birthDate: '1990-01-01',
  },
];

/** A signed-in professional, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('test coverage — actionGetClientsByUser', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it("returns the professional's client list", async () => {
    apiClientMock.mockResolvedValue(CLIENTS);

    const [result, error] = await actionGetClientsByUser();

    expect(error).toBeNull();
    expect(result).toEqual(CLIENTS);
    expect(apiClientMock).toHaveBeenCalledWith('/clients', {
      method: 'GET',
      cache: 'no-store',
    });
  });

  // UT-010
  it('rejects a request without a session before calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionGetClientsByUser();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  // UT-010
  it('falls back to the generic message when the backend fails', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionGetClientsByUser();

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
