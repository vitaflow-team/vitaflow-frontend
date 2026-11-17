import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { activateAsCustomer } from './activateAsCustomer';

const CONSENT = { termsAccepted: true, healthDataConsent: true };

describe('unified login account — UT-045 customer activation action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({ user: { id: 'user-1' } });
    apiClientMock.mockResolvedValue({});
  });

  it('posts both consents and no account identifier', async () => {
    const [, error] = await activateAsCustomer(CONSENT);

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/profile/customer-activation', {
      method: 'POST',
      body: JSON.stringify(CONSENT),
    });
    expect(apiClientMock.mock.calls[0][1].body).not.toContain('user-1');
  });

  it('maps already_customer to its own message', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 409, 'already_customer'));

    const [, error] = await activateAsCustomer(CONSENT);

    expect(error?.message).toBe(
      'Sua conta já utiliza o Vita Flow como cliente.'
    );
  });

  it('tells the person when the free plan is unavailable', async () => {
    apiClientMock.mockRejectedValue(new AppError('internal detail', 500));

    const [, error] = await activateAsCustomer(CONSENT);

    expect(error?.message).toContain('plano Gratuito está indisponível');
    expect(error?.message).not.toContain('internal detail');
  });

  it('falls back to the generic message for any other failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('internal detail', 400));

    const [, error] = await activateAsCustomer(CONSENT);

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });

  it.each([
    { termsAccepted: false, healthDataConsent: true },
    { termsAccepted: true, healthDataConsent: false },
  ])('refuses %o before calling the backend', async input => {
    const [, error] = await activateAsCustomer(input);

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('refuses without a session', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await activateAsCustomer(CONSENT);

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
