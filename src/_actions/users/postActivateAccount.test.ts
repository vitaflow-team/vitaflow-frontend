import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionActivateAccount } from './postActivateAccount';

describe('platform hardening — activation Server Action', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    apiClientMock.mockResolvedValue({});
  });

  it('UT-010 activates the account with a POST carrying the token', async () => {
    const [, error] = await actionActivateAccount({ token: 'raw-token' });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledTimes(1);
    expect(apiClientMock).toHaveBeenCalledWith('/users/activate', {
      method: 'POST',
      body: JSON.stringify({ token: 'raw-token' }),
    });
  });

  it('UT-010 rejects an empty token without calling the backend', async () => {
    const [, error] = await actionActivateAccount({ token: '' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-010 reports an invalid or expired token with a safe message', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Token inválido ou expirado.', 400)
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const [, error] = await actionActivateAccount({ token: 'raw-token' });

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
