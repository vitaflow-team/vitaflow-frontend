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
import { changeBillingTerms } from './changeBillingTerms';

const CLIENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

describe('changeBillingTerms — financial-health US-014', () => {
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

    const [, error] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 20,
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not a gym owner', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

    const [, error] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 20,
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('patches only the terms that were sent', async () => {
    const billing = { clientId: CLIENT_ID, dueDay: 20, amountCents: 14990 };
    apiClientMock.mockResolvedValue(billing);

    const [data, error] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 20,
    });

    expect(error).toBeNull();
    expect(data).toEqual(billing);
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/students/${CLIENT_ID}/billing`,
      { method: 'PATCH', body: JSON.stringify({ dueDay: 20 }) }
    );
  });

  it('requires at least one term', async () => {
    const [, error] = await changeBillingTerms({ clientId: CLIENT_ID });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range due day or amount without calling the backend', async () => {
    const [, dueDayError] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 29,
    });
    const [, amountError] = await changeBillingTerms({
      clientId: CLIENT_ID,
      amountCents: 100,
    });

    expect(dueDayError).not.toBeNull();
    expect(amountError).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid id before the backend', async () => {
    const [, error] = await changeBillingTerms({
      clientId: '../x',
      dueDay: 5,
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('maps recurring_billing_not_found to safe copy', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 404, 'recurring_billing_not_found')
    );

    const [, error] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 5,
    });

    expect(error?.message).toBe(
      'Este aluno não tem cobrança recorrente ativa.'
    );
  });

  it('never echoes an unexpected backend failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw-internal', 503));

    const [, error] = await changeBillingTerms({
      clientId: CLIENT_ID,
      dueDay: 5,
    });

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
