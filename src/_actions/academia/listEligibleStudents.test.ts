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
import { listEligibleStudents } from './listEligibleStudents';

describe('listEligibleStudents — financial-health US-015', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'owner-id' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('refuses a missing session', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await listEligibleStudents();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not a gym owner', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });

    const [, error] = await listEligibleStudents();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('returns the eligible students from the backend', async () => {
    const students = [
      {
        clientId: 'c1',
        name: 'Ana',
        planName: 'Mensal',
        amountCents: 14990,
        hasTaxId: false,
      },
    ];
    apiClientMock.mockResolvedValue(students);

    const [data, error] = await listEligibleStudents();

    expect(error).toBeNull();
    expect(data).toEqual(students);
    expect(apiClientMock).toHaveBeenCalledWith(
      '/academia/students/billing/eligible',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('never echoes a backend failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw-internal', 500));

    const [, error] = await listEligibleStudents();

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
