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
import { dismissChurnRisk } from './dismissChurnRisk';

const CLIENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'owner-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('dismissChurnRisk — churn-risk-alert US-005', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('UT-025 dismisses a flagged student (closes every open episode, per ADR-009)', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await dismissChurnRisk({ clientId: CLIENT_ID });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/churn-risk/${CLIENT_ID}/dismiss`,
      { method: 'POST' }
    );
  });

  it('UT-026 rejects when there is no session, without ever calling the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await dismissChurnRisk({ clientId: CLIENT_ID });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-026 maps a 404 (client not found or not owned by this academia) to a clear message', async () => {
    apiClientMock.mockRejectedValue(new AppError('not found', 404));

    const [, error] = await dismissChurnRisk({ clientId: CLIENT_ID });

    expect(error?.message).toBe('Aluno não encontrado nesta academia.');
  });

  it('rejects a non-cuid id before ever calling the backend', async () => {
    const [, error] = await dismissChurnRisk({ clientId: '../profile' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
