import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClient = vi.hoisted(() => vi.fn());

vi.mock('@/_lib/apiClient', () => ({ apiClient }));
vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
}));

import { actionCancelFixedSession } from './cancelFixedSession';

const SESSION_ID = '01890a5d-ac96-774b-bcce-b302099a8099';

describe('actionCancelFixedSession (UT-114)', () => {
  beforeEach(() => {
    apiClient.mockReset();
  });

  it('answers an already canceled session with a clear message instead of failing', async () => {
    apiClient.mockRejectedValue(
      new AppError('raw backend text', 409, 'session_not_cancelable')
    );

    const [, error] = await actionCancelFixedSession({ slotId: SESSION_ID });

    expect(error?.message).toBe('Esta sessão já foi cancelada.');
    expect(error?.message).not.toContain('raw backend text');
  });

  it('cancels one date through the fixed-session route', async () => {
    apiClient.mockResolvedValue(undefined);

    const [, error] = await actionCancelFixedSession({ slotId: SESSION_ID });

    expect(error).toBeNull();
    expect(apiClient).toHaveBeenCalledWith(
      `/scheduling/fixed-sessions/${SESSION_ID}/cancel`,
      expect.objectContaining({ method: 'POST' })
    );
  });
});
