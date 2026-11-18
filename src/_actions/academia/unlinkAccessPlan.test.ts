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
import { unlinkAccessPlan } from './unlinkAccessPlan';

const CLIENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

describe('unlinkAccessPlan — financial-health US-014', () => {
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

    const [, error] = await unlinkAccessPlan({ clientId: CLIENT_ID });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not a gym owner', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

    const [, error] = await unlinkAccessPlan({ clientId: CLIENT_ID });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('deletes the access plan link of the student', async () => {
    apiClientMock.mockResolvedValue(undefined);

    const [, error] = await unlinkAccessPlan({ clientId: CLIENT_ID });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${CLIENT_ID}/access-plan`,
      { method: 'DELETE' }
    );
  });

  it('rejects an invalid id before the backend', async () => {
    const [, error] = await unlinkAccessPlan({ clientId: 'x/../y' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('maps student_has_no_plan to safe copy', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 404, 'student_has_no_plan')
    );

    const [, error] = await unlinkAccessPlan({ clientId: CLIENT_ID });

    expect(error?.message).toBe('Este aluno não tem plano de acesso.');
  });

  it('never echoes an unexpected backend failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw-internal', 500));

    const [, error] = await unlinkAccessPlan({ clientId: CLIENT_ID });

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
