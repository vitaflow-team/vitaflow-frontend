import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import {
  loadPlatformDelinquents,
  loadPlatformFinancialPanel,
  loadPlatformSummary,
} from './platformFinancialHealth';

const REDIRECT = Object.assign(new Error('NEXT_REDIRECT'), {
  digest: 'NEXT_REDIRECT;replace;/restrict;307;',
});

function page(tier: 'ADMIN' | 'EQUIPE') {
  return {
    tier,
    bandCounts: { d1to7: 1, d8to30: 0, d31Plus: 0 },
    items: [],
    page: 1,
    pageSize: 20,
    total: 1,
  };
}

const SUMMARY = { month: '2026-11', available: true };

function answer(routes: Record<string, unknown>) {
  apiClientMock.mockImplementation(async (path: string) => {
    const route = Object.keys(routes).find(key => path.startsWith(key));
    const result = route ? routes[route] : undefined;
    if (result instanceof Error) throw result;
    return result;
  });
}

describe('platform financial health loaders', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('reads the summary as the staff member themselves, never cached', async () => {
    apiClientMock.mockResolvedValue(SUMMARY);

    expect(await loadPlatformSummary('2026-03')).toEqual(SUMMARY);
    expect(apiClientMock).toHaveBeenCalledWith(
      '/backoffice/financial-health/summary?month=2026-03',
      { method: 'GET', cache: 'no-store' },
      { ownToken: true }
    );
  });

  it('reads a page of delinquent subscribers as the staff member themselves, never cached', async () => {
    apiClientMock.mockResolvedValue(page('EQUIPE'));

    await loadPlatformDelinquents(3);

    expect(apiClientMock).toHaveBeenCalledWith(
      '/backoffice/financial-health/delinquents?page=3',
      { method: 'GET', cache: 'no-store' },
      { ownToken: true }
    );
  });

  it.each([
    [403, 'forbidden'],
    [401, 'forbidden'],
    [404, 'not-found'],
    [500, 'failed'],
    [503, 'failed'],
  ])('maps an AppError %d to %s', async (status, expected) => {
    apiClientMock.mockRejectedValue(new AppError('backend detail', status));
    expect(await loadPlatformSummary('2026-11')).toBe(expected);

    apiClientMock.mockRejectedValue(new AppError('backend detail', status));
    expect(await loadPlatformDelinquents(1)).toBe(expected);
  });

  it('reports a 503 access_log_failed as its own case, not as a generic failure', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw-internal', 503, 'access_log_failed')
    );

    expect(await loadPlatformDelinquents(1)).toBe('access-log-failed');
  });

  it('reads a failure that is not a backend answer as failed, without leaking its message', async () => {
    apiClientMock.mockRejectedValue(new Error('connection string leaked'));

    expect(await loadPlatformDelinquents(1)).toBe('failed');
    expect(console.error).toHaveBeenCalledWith(expect.any(String), {
      status: undefined,
    });
  });

  it('rethrows framework control-flow errors instead of mapping them', async () => {
    apiClientMock.mockRejectedValue(REDIRECT);

    await expect(loadPlatformSummary('2026-11')).rejects.toBe(REDIRECT);
    await expect(loadPlatformDelinquents(1)).rejects.toBe(REDIRECT);
  });
});

describe('platform financial panel loader — ADR-010', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('requests the summary after the list when the tier is ADMIN', async () => {
    answer({
      '/backoffice/financial-health/delinquents': page('ADMIN'),
      '/backoffice/financial-health/summary': SUMMARY,
    });

    const data = await loadPlatformFinancialPanel({
      month: '2026-03',
      page: 2,
    });

    expect(data.summary).toEqual(SUMMARY);
    expect(apiClientMock.mock.calls.map(call => call[0])).toEqual([
      '/backoffice/financial-health/delinquents?page=2',
      '/backoffice/financial-health/summary?month=2026-03',
    ]);
  });

  it('never requests the summary when the tier is EQUIPE', async () => {
    answer({ '/backoffice/financial-health/delinquents': page('EQUIPE') });

    const data = await loadPlatformFinancialPanel({
      month: '2026-03',
      page: 1,
    });

    expect(data.summary).toBeNull();
    expect(apiClientMock).toHaveBeenCalledTimes(1);
  });

  it.each(['forbidden', 'failed', 'access-log-failed'])(
    'never requests the summary when the list failed (%s)',
    async failure => {
      const error =
        failure === 'forbidden'
          ? new AppError('x', 403)
          : failure === 'failed'
            ? new AppError('x', 500)
            : new AppError('x', 503, 'access_log_failed');
      answer({ '/backoffice/financial-health/delinquents': error });

      const data = await loadPlatformFinancialPanel({
        month: '2026-03',
        page: 1,
      });

      expect(data.delinquents).toBe(failure);
      expect(data.summary).toBeNull();
      expect(apiClientMock).toHaveBeenCalledTimes(1);
    }
  );

  it('lets the summary fail on its own without hiding the list', async () => {
    answer({
      '/backoffice/financial-health/delinquents': page('ADMIN'),
      '/backoffice/financial-health/summary': new AppError('x', 403),
    });

    const data = await loadPlatformFinancialPanel({
      month: '2026-03',
      page: 1,
    });

    expect(data.summary).toBe('forbidden');
    expect(data.delinquents).toEqual(page('ADMIN'));
  });
});
