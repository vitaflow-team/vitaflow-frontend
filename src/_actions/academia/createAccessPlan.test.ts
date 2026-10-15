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

import { createAccessPlan } from './createAccessPlan';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'owner-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('createAccessPlan — gym-foundation US-018', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('creates a DAYS plan, coercing the numeric fields', async () => {
    apiClientMock.mockResolvedValue({ id: 'plan-1' });

    const [, error] = await createAccessPlan({
      name: 'Mensal',
      validityType: 'DAYS',
      validityValue: '30',
      referencePrice: '129.9',
    } as never);

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/academia/access-plans', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Mensal',
        validityType: 'DAYS',
        validityValue: 30,
        referencePrice: 129.9,
      }),
    });
  });

  it('rejects a zero or negative validityValue before reaching the backend', async () => {
    const [, error] = await createAccessPlan({
      name: 'Inválido',
      validityType: 'DAYS',
      validityValue: 0,
      referencePrice: 10,
    });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
