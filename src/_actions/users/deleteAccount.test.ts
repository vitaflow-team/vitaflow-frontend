import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, signOutMock, clearCookieMock, calls } =
  vi.hoisted(() => ({
    // Ordem é contrato aqui (ADR-005), então cada dublê registra a própria
    // chamada nesta lista e os testes conferem quem veio antes de quem.
    calls: [] as string[],
    apiClientMock: vi.fn(),
    authMock: vi.fn(),
    signOutMock: vi.fn(),
    clearCookieMock: vi.fn(),
  }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock, signOut: signOutMock }));
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
    asaasSubscriptionId: null,
    ...overrides,
  };
}

function mockApi(impl: (path: string, init?: RequestInit) => Promise<unknown>) {
  apiClientMock.mockImplementation((path: string, init?: RequestInit) => {
    calls.push(`${init?.method ?? 'GET'} ${path}`);
    return impl(path, init);
  });
}

describe('account deletion action', () => {
  beforeEach(() => {
    calls.length = 0;
    apiClientMock.mockReset();
    authMock.mockReset();
    signOutMock.mockReset();
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
    mockApi(async path =>
      path === '/users/subscription' ? subscriptionState() : {}
    );
  });

  it('UT-030 refuses without a session and touches nothing', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await deleteAccount();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-031 skips the cancel call entirely when the user has no subscription', async () => {
    await deleteAccount();

    expect(apiClientMock).toHaveBeenCalledWith('/profile', {
      method: 'DELETE',
    });
    expect(calls).not.toContain('PATCH /users/subscription/cancel');
    expect(clearCookieMock).toHaveBeenCalled();
    expect(signOutMock).toHaveBeenCalledWith({
      redirectTo: '/?aviso=conta-excluida',
    });
  });

  it('UT-032 cancels the subscription before deleting any data', async () => {
    mockApi(async path =>
      path === '/users/subscription'
        ? subscriptionState({ asaasSubscriptionId: 'sub_1' })
        : {}
    );

    await deleteAccount();

    expect(calls.indexOf('PATCH /users/subscription/cancel')).toBeLessThan(
      calls.indexOf('DELETE /profile')
    );
  });

  it('UT-033 deletes nothing when the cancellation fails', async () => {
    mockApi(async (path, init) => {
      if (path === '/users/subscription') {
        return subscriptionState({ asaasSubscriptionId: 'sub_1' });
      }
      if (path === '/users/subscription/cancel' && init?.method === 'PATCH') {
        throw new AppError('O Asaas está indisponível no momento.', 503);
      }
      return {};
    });

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(calls).not.toContain('DELETE /profile');
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-034 keeps the session when the backend deletion fails', async () => {
    mockApi(async (path, init) => {
      if (path === '/users/subscription') {
        return subscriptionState({ asaasSubscriptionId: 'sub_1' });
      }
      if (path === '/profile' && init?.method === 'DELETE') {
        throw new AppError('internal detail', 500);
      }
      return {};
    });

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it('UT-036 treats the backend\'s "no active subscription" as a successful cancellation', async () => {
    mockApi(async (path, init) => {
      if (path === '/users/subscription') {
        return subscriptionState({ asaasSubscriptionId: 'sub_1' });
      }
      if (path === '/users/subscription/cancel' && init?.method === 'PATCH') {
        throw new AppError('Nenhuma assinatura ativa para cancelar.', 400);
      }
      return {};
    });

    const [, error] = await deleteAccount();

    expect(error).toBeNull();
    expect(calls).toContain('DELETE /profile');
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
    mockApi(async (path, init) => {
      if (path === '/users/subscription') {
        return subscriptionState({ asaasSubscriptionId: 'sub_1' });
      }
      if (path === '/users/subscription/cancel' && init?.method === 'PATCH') {
        throw new AppError('chave sk_live_123 inválida', 500);
      }
      return {};
    });

    const [, error] = await deleteAccount();

    expect(error?.message).toBe(GENERIC_FAILURE);
    expect(error?.message).not.toContain('sk_live_');
    expect(JSON.stringify(error)).not.toContain('sk_live_');
  });
});
