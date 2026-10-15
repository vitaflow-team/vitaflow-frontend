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
import { endEmployment } from './endEmployment';

const EMPLOYMENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'owner-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('endEmployment — gym-foundation US-011', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('ends the employment', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await endEmployment({ id: EMPLOYMENT_ID });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/employments/${EMPLOYMENT_ID}`,
      { method: 'DELETE' }
    );
  });

  it('treats a 404 (already ended) as success — idempotent double-removal (US-011.EC-2)', async () => {
    apiClientMock.mockRejectedValue(new AppError('not found', 404));

    const [, error] = await endEmployment({ id: EMPLOYMENT_ID });

    expect(error).toBeNull();
  });

  it('surfaces any other backend failure as a safe error', async () => {
    apiClientMock.mockRejectedValue(new AppError('boom', 500));

    const [, error] = await endEmployment({ id: EMPLOYMENT_ID });

    expect(error).not.toBeNull();
  });

  it('rejects a non-cuid id before ever calling the backend', async () => {
    const [, error] = await endEmployment({ id: '../profile' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
