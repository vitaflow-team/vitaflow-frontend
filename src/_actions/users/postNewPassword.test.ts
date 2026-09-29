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
import { actionNewPassword } from './postNewPassword';

const INPUT = {
  password: 'Senha1234',
  checkPassword: 'Senha1234',
  token: 'reset-token',
};

/** A fresh API double, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

// The reset link's token authenticates the request: the action never reads a
// session, so there is no no-session case to cover.
describe('test coverage — actionNewPassword', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('sends the new password with the reset token', async () => {
    apiClientMock.mockResolvedValue(undefined);

    const [, error] = await actionNewPassword(INPUT);

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/users/newpassword', {
      method: 'POST',
      body: JSON.stringify(INPUT),
    });
  });

  // UT-010
  it.each([
    [400, 'Link de redefinição inválido ou expirado. Solicite um novo.'],
    [401, 'A confirmação da senha não corresponde à senha.'],
    [429, TOO_MANY_REQUESTS.message],
  ])('maps a backend %i to its safe message', async (status, message) => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', status));

    const [, error] = await actionNewPassword(INPUT);

    expect(error?.message).toBe(message);
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new Error('socket hang up'));

    const [, error] = await actionNewPassword(INPUT);

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
