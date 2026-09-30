import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, redirectMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
  unstable_rethrow: vi.fn(),
}));

import { AppError } from './AppError';
import {
  getBackofficeAccess,
  redirectUnlessBackoffice,
} from './backofficeAuthorization';
import {
  isLoadFailure,
  loadExercise,
  loadExercises,
  loadOwnSubmissions,
  loadPendingQueue,
} from './exerciseCatalog';

const ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

beforeEach(() => {
  apiClientMock.mockReset();
  redirectMock.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('exercise catalog loaders', () => {
  it('lists the catalog with every filter, never cached', async () => {
    apiClientMock.mockResolvedValue([]);

    await loadExercises({ q: 'supino', muscleGroup: 'Peito', page: 1 });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/exercises?muscleGroup=Peito&q=supino&page=1',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('reads one exercise, the educator submissions and the pending queue', async () => {
    apiClientMock.mockResolvedValue([]);

    await loadExercise(ID);
    await loadOwnSubmissions();
    await loadPendingQueue();

    const paths = apiClientMock.mock.calls.map(([path]) => path);
    expect(paths).toEqual([
      `/exercises/${ID}`,
      '/exercises/submissions/mine',
      '/admin/exercises/pending',
    ]);
  });

  it('never sends an id that is not a UUID to the backend', async () => {
    expect(await loadExercise('../profile')).toBe('not-found');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('turns backend answers into load failures', async () => {
    apiClientMock.mockRejectedValueOnce(new AppError('x', 403));
    expect(await loadOwnSubmissions()).toBe('forbidden');

    apiClientMock.mockRejectedValueOnce(new AppError('x', 401));
    expect(await loadPendingQueue()).toBe('forbidden');

    apiClientMock.mockRejectedValueOnce(new AppError('x', 404));
    expect(await loadExercise(ID)).toBe('not-found');

    apiClientMock.mockRejectedValueOnce(new AppError('x', 503));
    expect(await loadExercises({ page: 1 })).toBe('failed');
  });

  it('tells data apart from a failure', () => {
    expect(isLoadFailure([])).toBe(false);
    expect(isLoadFailure('failed')).toBe(true);
  });
});

describe('backoffice route protection', () => {
  it('allows staff: the backend answers the pending queue', async () => {
    apiClientMock.mockResolvedValue([]);

    expect(await getBackofficeAccess()).toBe('allowed');
    await expect(redirectUnlessBackoffice()).resolves.toBeUndefined();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('sends a non-staff user away with the access notice', async () => {
    apiClientMock.mockRejectedValue(new AppError('Forbidden', 403));

    expect(await getBackofficeAccess()).toBe('denied');
    await expect(redirectUnlessBackoffice()).rejects.toThrow(
      'NEXT_REDIRECT:/restrict?aviso=sem-permissao'
    );
  });

  it('fails closed when the backend cannot confirm staff status', async () => {
    apiClientMock.mockRejectedValue(new AppError('down', 503));

    expect(await getBackofficeAccess()).toBe('unavailable');
    await expect(redirectUnlessBackoffice()).rejects.toThrow('NEXT_REDIRECT');
  });
});
