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
import { connectAccount } from './connectAccount';

const KEY = 'a'.repeat(20);

describe('connectAccount — financial-health US-007', () => {
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

    const [, error] = await connectAccount({ apiKey: KEY });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('lets a gym owner connect the gym account', async () => {
    apiClientMock.mockResolvedValue({ connected: true });

    const [data, error] = await connectAccount({ apiKey: KEY });

    expect(error).toBeNull();
    expect(data).toEqual({ connected: true });
    expect(apiClientMock).toHaveBeenCalledWith('/billing/account', {
      method: 'PUT',
      body: JSON.stringify({ apiKey: KEY }),
    });
  });

  it('refuses a caller that cannot hold a billing account', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

    const [, error] = await connectAccount({ apiKey: KEY });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('US-007.EC-8 tells a gym without a paid subscription why it cannot connect', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 403, 'subscription_required')
    );

    const [, error] = await connectAccount({ apiKey: KEY });

    expect(error?.message).toBe(
      'Este recurso requer uma assinatura ativa da academia.'
    );
  });

  it('maps not_billing_owner to safe copy', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 403, 'not_billing_owner')
    );

    const [, error] = await connectAccount({ apiKey: KEY });

    expect(error?.message).toContain('donos de academia');
    expect(error?.message).not.toContain('raw-internal');
  });

  it('keeps the existing messages for the codes that were already passed through', async () => {
    apiClientMock.mockRejectedValue(
      new AppError(
        'Esta chave já está em uso por outra conta.',
        409,
        'account_key_in_use'
      )
    );

    const [, error] = await connectAccount({ apiKey: KEY });

    expect(error?.message).toBe('Esta chave já está em uso por outra conta.');
  });
});
