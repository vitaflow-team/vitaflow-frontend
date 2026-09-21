import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  apiClientMock,
  authMock,
  signOutMock,
  cancelMock,
  delCustomerMock,
  clearCookieMock,
  calls,
} = vi.hoisted(() => ({
  // Ordem é contrato aqui (ADR-005), então cada dublê registra a própria
  // chamada nesta lista e os testes conferem quem veio antes de quem.
  calls: [] as string[],
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  signOutMock: vi.fn(),
  cancelMock: vi.fn(),
  delCustomerMock: vi.fn(),
  clearCookieMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock, signOut: signOutMock }));
vi.mock('@/_lib/stripe', () => ({
  stripe: {
    subscriptions: { cancel: cancelMock },
    customers: { del: delCustomerMock },
  },
}));
vi.mock('@/_lib/accessTokenCookie', () => ({
  clearAccessTokenCookie: clearCookieMock,
}));

import { AppError } from '@/_lib/AppError';
import { deleteAccount } from './deleteAccount';

const GENERIC_FAILURE = 'Não foi possível excluir a conta. Tente novamente.';

/** Um `redirect()` do Next é um Error com esta mensagem e este digest. */
function redirectError(): Error {
  const error = new Error('NEXT_REDIRECT');
  (error as Error & { digest: string }).digest =
    'NEXT_REDIRECT;replace;/?aviso=conta-excluida;307;';
  return error;
}

function subscriptionState(overrides: Record<string, string | null> = {}) {
  return {
    productId: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    ...overrides,
  };
}

describe('account deletion action', () => {
  beforeEach(() => {
    calls.length = 0;
    apiClientMock.mockReset();
    authMock.mockReset();
    signOutMock.mockReset();
    cancelMock.mockReset();
    delCustomerMock.mockReset();
    clearCookieMock.mockReset();

    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    signOutMock.mockImplementation(() => {
      calls.push('signOut');
      return Promise.resolve();
    });
    clearCookieMock.mockImplementation(() => {
      calls.push('clearCookie');
      return Promise.resolve();
    });
    cancelMock.mockImplementation(() => {
      calls.push('stripe.cancel');
      return Promise.resolve({});
    });
    delCustomerMock.mockImplementation(() => {
      calls.push('stripe.customers.del');
      return Promise.resolve({});
    });
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(subscriptionState());
      }
      return Promise.resolve({});
    });
  });

  it('UT-030 refuses without a session and touches nothing', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await deleteAccount();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(cancelMock).not.toHaveBeenCalled();
    expect(delCustomerMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-031 skips Stripe entirely when the user has no Stripe ids', async () => {
    await deleteAccount();

    expect(apiClientMock).toHaveBeenCalledWith('/profile', {
      method: 'DELETE',
    });
    expect(cancelMock).not.toHaveBeenCalled();
    expect(delCustomerMock).not.toHaveBeenCalled();
    expect(clearCookieMock).toHaveBeenCalled();
    expect(signOutMock).toHaveBeenCalledWith({
      redirectTo: '/?aviso=conta-excluida',
    });
  });

  it('UT-032 cancels the subscription before deleting any data', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({ stripeSubscriptionId: 'sub_1' })
        );
      }
      return Promise.resolve({});
    });

    await deleteAccount();

    expect(cancelMock).toHaveBeenCalledWith('sub_1');
    expect(calls.indexOf('stripe.cancel')).toBeLessThan(
      calls.indexOf('DELETE /profile')
    );
  });

  it('UT-033 deletes nothing when the Stripe cancellation fails', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({ stripeSubscriptionId: 'sub_1' })
        );
      }
      return Promise.resolve({});
    });
    cancelMock.mockRejectedValue(new Error('Stripe indisponível'));

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(calls).not.toContain('DELETE /profile');
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-034 keeps the session when the backend deletion fails', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({
            stripeSubscriptionId: 'sub_1',
            stripeCustomerId: 'cus_1',
          })
        );
      }
      return Promise.reject(new AppError('internal detail', 500));
    });

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(delCustomerMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-035 still ends the session when the Customer removal fails', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({ stripeCustomerId: 'cus_1' })
        );
      }
      return Promise.resolve({});
    });
    delCustomerMock.mockRejectedValue(new Error('Stripe indisponível'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const [, error] = await deleteAccount();

    expect(error).toBeNull();
    expect(signOutMock).toHaveBeenCalledWith({
      redirectTo: '/?aviso=conta-excluida',
    });
    expect(consoleSpy.mock.calls.flat().join(' ')).not.toContain('cus_1');
    consoleSpy.mockRestore();
  });

  it.each([
    [
      'resource_missing code',
      Object.assign(new Error('No such subscription: sub_1'), {
        code: 'resource_missing',
      }),
    ],
    [
      'already cancelled subscription',
      new Error("A subscription with status 'canceled' may not be updated"),
    ],
  ])(
    'UT-036 treats a %s as a successful cancellation',
    async (_label, thrown) => {
      apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
        calls.push(`${init?.method ?? 'GET'} ${path}`);
        if (path === '/users/subscription') {
          return Promise.resolve(
            subscriptionState({ stripeSubscriptionId: 'sub_1' })
          );
        }
        return Promise.resolve({});
      });
      cancelMock.mockImplementation(() => {
        calls.push('stripe.cancel');
        return Promise.reject(thrown);
      });

      const [, error] = await deleteAccount();

      expect(error).toBeNull();
      expect(calls).toContain('DELETE /profile');
    }
  );

  it('UT-037 removes the Stripe Customer after the backend deletion', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({ stripeCustomerId: 'cus_1' })
        );
      }
      return Promise.resolve({});
    });

    await deleteAccount();

    expect(cancelMock).not.toHaveBeenCalled();
    expect(delCustomerMock).toHaveBeenCalledWith('cus_1');
    expect(calls.indexOf('DELETE /profile')).toBeLessThan(
      calls.indexOf('stripe.customers.del')
    );
  });

  it('UT-038 lets the sign-out redirect escape after clearing the cookie', async () => {
    signOutMock.mockImplementation(() => {
      calls.push('signOut');
      return Promise.reject(redirectError());
    });

    await expect(deleteAccount()).rejects.toThrow('NEXT_REDIRECT');

    expect(calls.indexOf('clearCookie')).toBeGreaterThanOrEqual(0);
    expect(calls.indexOf('clearCookie')).toBeLessThan(calls.indexOf('signOut'));
  });

  it('UT-039 never leaks the internal failure text to the user', async () => {
    apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path === '/users/subscription') {
        return Promise.resolve(
          subscriptionState({ stripeSubscriptionId: 'sub_1' })
        );
      }
      return Promise.resolve({});
    });
    cancelMock.mockRejectedValue(new Error('sk_test_123 invalid'));

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(error?.message).not.toContain('sk_test_');
    expect(JSON.stringify(error)).not.toContain('sk_test_');
  });
});
