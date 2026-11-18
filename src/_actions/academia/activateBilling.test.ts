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
import { activateBilling } from './activateBilling';

const FIRST = 'cly3x8p9b0000qzrm5f1a2b3c';
const SECOND = 'clz9q2r8c0001abcd5f1a2b3c';

function items(count: number) {
  return Array.from({ length: count }, () => ({ clientId: FIRST, dueDay: 10 }));
}

describe('activateBilling — financial-health US-015', () => {
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

    const [, error] = await activateBilling({ items: items(1) });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not a gym owner', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

    const [, error] = await activateBilling({ items: items(1) });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('posts the selection and returns the outcome from the backend', async () => {
    const outcome = {
      activated: [FIRST],
      skipped: [{ clientId: SECOND, reason: 'tax_id_missing' }],
    };
    apiClientMock.mockResolvedValue(outcome);
    const selection = [
      { clientId: FIRST, dueDay: 10 },
      { clientId: SECOND, dueDay: 10, amountCents: 12000 },
    ];

    const [data, error] = await activateBilling({ items: selection });

    expect(error).toBeNull();
    expect(data).toEqual(outcome);
    expect(apiClientMock).toHaveBeenCalledWith(
      '/academia/students/billing/activate',
      { method: 'POST', body: JSON.stringify({ items: selection }) }
    );
  });

  it('accepts exactly 200 items and rejects 0 or 201 before the backend', async () => {
    apiClientMock.mockResolvedValue({ activated: [], skipped: [] });

    const [, atLimit] = await activateBilling({ items: items(200) });
    const [, empty] = await activateBilling({ items: [] });
    const [, tooMany] = await activateBilling({ items: items(201) });

    expect(atLimit).toBeNull();
    expect(empty).not.toBeNull();
    expect(tooMany).not.toBeNull();
    expect(apiClientMock).toHaveBeenCalledTimes(1);
  });

  it('rejects an invalid student id in the selection', async () => {
    const [, error] = await activateBilling({
      items: [{ clientId: '../x', dueDay: 10 }],
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('maps billing_not_connected to safe copy', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 409, 'billing_not_connected')
    );

    const [, error] = await activateBilling({ items: items(1) });

    expect(error?.message).toContain('Conecte a conta Asaas');
    expect(error?.message).not.toContain('raw-internal');
  });
});
