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
import { assignAccessPlan } from './assignAccessPlan';

const CLIENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';
const PLAN_ID = 'clz9q2r8c0001abcd5f1a2b3c';
const RAW = 'raw-internal: sk_live_leak';

describe('assignAccessPlan — financial-health US-012', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'owner-id' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('refuses a missing session before anything else runs', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(fetchPlanClaimsMock).not.toHaveBeenCalled();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not a gym owner', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });

    const [, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('sends only the plan when no billing is requested and returns the plain result', async () => {
    const result = { plan: { id: 'p1' }, billing: null, firstInvoice: null };
    apiClientMock.mockResolvedValue(result);

    const [data, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
    });

    expect(error).toBeNull();
    expect(data).toEqual(result);
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${CLIENT_ID}/access-plan`,
      { method: 'POST', body: JSON.stringify({ accessPlanId: PLAN_ID }) }
    );
  });

  it('forwards the fee terms, with the tax ID reduced to digits', async () => {
    apiClientMock.mockResolvedValue({ plan: { id: 'p1' } });

    await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
      billing: { dueDay: 10, amountCents: 14990, cpfCnpj: '529.982.247-25' },
    });

    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${CLIENT_ID}/access-plan`,
      {
        method: 'POST',
        body: JSON.stringify({
          accessPlanId: PLAN_ID,
          billing: { dueDay: 10, amountCents: 14990, cpfCnpj: '52998224725' },
        }),
      }
    );
  });

  it.each([0, 29, 1.5])(
    'rejects the due day %s without calling the backend',
    async dueDay => {
      const [, error] = await assignAccessPlan({
        clientId: CLIENT_ID,
        accessPlanId: PLAN_ID,
        billing: { dueDay },
      });

      expect(error).not.toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it.each([499, 5_000_001])(
    'rejects the amount %s without calling the backend',
    async amountCents => {
      const [, error] = await assignAccessPlan({
        clientId: CLIENT_ID,
        accessPlanId: PLAN_ID,
        billing: { dueDay: 10, amountCents },
      });

      expect(error).not.toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it('rejects an invalid student id before the backend', async () => {
    const [, error] = await assignAccessPlan({
      clientId: '../profile',
      accessPlanId: PLAN_ID,
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('maps a recurring_billing_exists failure to safe Portuguese copy', async () => {
    apiClientMock.mockRejectedValue(
      new AppError(RAW, 409, 'recurring_billing_exists')
    );

    const [, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
      billing: { dueDay: 10 },
    });

    expect(error?.message).toContain('já tem cobrança recorrente');
    expect(error?.message).not.toContain('raw-internal');
  });

  it('keeps tax_id_required identifiable so the form can ask for the tax ID', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Informe o CPF ou CNPJ do aluno.', 400, 'tax_id_required')
    );

    const [, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
      billing: { dueDay: 10 },
    });

    expect(error?.data).toBe('tax_id_required');
  });

  it('never echoes an unexpected backend failure', async () => {
    apiClientMock.mockRejectedValue(new AppError(RAW, 500));

    const [, error] = await assignAccessPlan({
      clientId: CLIENT_ID,
      accessPlanId: PLAN_ID,
    });

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
