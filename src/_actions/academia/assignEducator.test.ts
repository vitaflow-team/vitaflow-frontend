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
import { assignEducator } from './assignEducator';

const STUDENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';
const EDUCATOR_ID = 'clz9q2r8c0001abcd5f1a2b3c';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'owner-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('assignEducator — gym-foundation US-014, US-015', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('assigns an educator', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await assignEducator({
      studentId: STUDENT_ID,
      professionalId: EDUCATOR_ID,
    });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${STUDENT_ID}/assign-educator`,
      { method: 'POST', body: JSON.stringify({ professionalId: EDUCATOR_ID }) }
    );
  });

  it('clears an assignment with professionalId: null', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await assignEducator({
      studentId: STUDENT_ID,
      professionalId: null,
    });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${STUDENT_ID}/assign-educator`,
      { method: 'POST', body: JSON.stringify({ professionalId: null }) }
    );
  });

  it('surfaces a not_employed_here rejection with a clear message', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw', 400, 'not_employed_here')
    );

    const [, error] = await assignEducator({
      studentId: STUDENT_ID,
      professionalId: EDUCATOR_ID,
    });

    expect(error?.message).toBe(
      'Este educador não está mais empregado por esta academia.'
    );
  });
});
