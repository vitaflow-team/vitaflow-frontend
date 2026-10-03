import { beforeEach, describe, expect, it, vi } from 'vitest';

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
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));

import { actionDeleteClientsByUser } from './deleteClientsByUser';
import { actionGetClientById } from './getClientById';
import { actionGetClientsByUser } from './getClientsByUser';
import { actionPostClientByUser } from './postClientsByUser';

const CLIENT_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5d';

const ACTIONS = [
  ['actionGetClientsByUser', () => actionGetClientsByUser()],
  ['actionGetClientById', () => actionGetClientById({ id: CLIENT_ID })],
  [
    'actionPostClientByUser',
    () =>
      actionPostClientByUser({
        name: 'Ana',
        phone: '(11) 91234-5678',
        email: 'ana@example.com',
        birthDate: '1990-01-01',
      }),
  ],
  [
    'actionDeleteClientsByUser',
    () => actionDeleteClientsByUser({ id: CLIENT_ID }),
  ],
] as const;

describe('auth input hardening — client actions re-check the role', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    fetchPlanClaimsMock.mockReset();
    authMock.mockReset();
    // A stale session still claiming a professional plan: only the fresh
    // profile decides (US-008 EC-1).
    authMock.mockResolvedValue({
      user: { id: 'user-id', productType: 'NUTRITIONIST' },
    });
    apiClientMock.mockResolvedValue({});
  });

  it.each(ACTIONS)(
    'UT-011 %s rejects a USER profile without calling the API',
    async (_, run) => {
      fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

      const [, error] = await run();

      expect(error?.code).toBe('NOT_AUTHORIZED');
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it.each(ACTIONS)(
    'UT-157 %s rejects a PHYSICAL_EDUCATOR profile without calling the API',
    async (_, run) => {
      fetchPlanClaimsMock.mockResolvedValue({
        productType: 'PHYSICAL_EDUCATOR',
      });

      const [, error] = await run();

      expect(error?.code).toBe('NOT_AUTHORIZED');
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it.each(ACTIONS)(
    'UT-011 %s serves a NUTRITIONIST profile',
    async (_, run) => {
      fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

      const [, error] = await run();

      expect(error).toBeNull();
      expect(apiClientMock).toHaveBeenCalledTimes(1);
    }
  );
});
