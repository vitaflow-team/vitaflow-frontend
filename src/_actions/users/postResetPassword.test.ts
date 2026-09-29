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
import { actionResetPassword } from './postResetPassword';

/** A fresh API double, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

// Password recovery is for signed-out users: the action never reads a
// session, so there is no no-session case to cover.
describe('test coverage — actionResetPassword', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('requests the recovery e-mail for the normalized address', async () => {
    apiClientMock.mockResolvedValue(undefined);

    const [, error] = await actionResetPassword({ email: 'Ana@Example.com' });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/users/recoverpass', {
      method: 'POST',
      body: JSON.stringify({ email: 'ana@example.com' }),
    });
  });

  // UT-010
  it('maps a backend 429 to the rate-limit message', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 429));

    const [, error] = await actionResetPassword({ email: 'ana@example.com' });

    expect(error?.message).toBe(TOO_MANY_REQUESTS.message);
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionResetPassword({ email: 'ana@example.com' });

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
