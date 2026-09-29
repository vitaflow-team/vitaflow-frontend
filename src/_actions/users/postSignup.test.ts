import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import { AppError } from '@/_lib/AppError';
import {
  SAFE_ACTION_FALLBACK,
  TOO_MANY_REQUESTS,
} from '@/_lib/safeActionError';
import { actionSignUp } from './postSignup';

const INPUT = {
  name: 'Ana',
  email: 'Ana@Example.com',
  password: 'Senha1234',
  checkPassword: 'Senha1234',
  termsAccepted: true,
  healthDataConsent: true,
};

/** A fresh API double, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

// Sign-up creates the account: the action never reads a session, so there is
// no no-session case to cover.
describe('test coverage — actionSignUp', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('creates the account and returns what the backend answers', async () => {
    apiClientMock.mockResolvedValue({ id: 'user-id' });

    const [result, error] = await actionSignUp(INPUT);

    expect(error).toBeNull();
    expect(result).toEqual({ id: 'user-id' });
    expect(apiClientMock).toHaveBeenCalledWith('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ ...INPUT, email: 'ana@example.com' }),
    });
  });

  // UT-010
  it.each([
    [
      400,
      'Não foi possível criar a conta. Verifique os dados ou use outro e-mail — este pode já estar cadastrado.',
    ],
    [429, TOO_MANY_REQUESTS.message],
  ])('maps a backend %i to its safe message', async (status, message) => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', status));

    const [, error] = await actionSignUp(INPUT);

    expect(error?.message).toBe(message);
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionSignUp(INPUT);

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
