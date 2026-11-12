import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({ unstable_rethrow: vi.fn() }));

import { isLoadFailure, loadAcademiaMirror } from './academiaMirrorData';

describe('loadAcademiaMirror', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('calls GET /me/academia, never cached', async () => {
    apiClientMock.mockResolvedValue([]);

    await loadAcademiaMirror();

    expect(apiClientMock).toHaveBeenCalledWith('/me/academia', {
      method: 'GET',
      cache: 'no-store',
    });
  });

  it('returns the membership list on success', async () => {
    apiClientMock.mockResolvedValue([{ academiaId: 'a1' }]);

    expect(await loadAcademiaMirror()).toEqual([{ academiaId: 'a1' }]);
  });

  // UT-025
  it('reads a 401/403 refusal as forbidden, and any other failure as failed', async () => {
    apiClientMock.mockRejectedValueOnce(new AppError('x', 401));
    expect(await loadAcademiaMirror()).toBe('forbidden');

    apiClientMock.mockRejectedValueOnce(new AppError('x', 403));
    expect(await loadAcademiaMirror()).toBe('forbidden');

    apiClientMock.mockRejectedValueOnce(new AppError('secret detail', 500));
    expect(await loadAcademiaMirror()).toBe('failed');
    expect(console.error).toHaveBeenCalledWith(expect.any(String), {
      status: 500,
    });
  });

  it('tells a failure apart from a loaded value', () => {
    expect(isLoadFailure('failed')).toBe(true);
    expect(isLoadFailure([])).toBe(false);
  });
});
