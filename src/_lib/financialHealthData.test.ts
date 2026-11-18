import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import {
  loadDelinquents,
  loadFinancialHealth,
  loadFinancialPanel,
} from './financialHealthData';

const SUMMARY = {
  audience: 'PROFESSIONAL',
  billingState: 'CONNECTED',
  hasHistory: true,
  month: '2026-03',
};

const REDIRECT = Object.assign(new Error('NEXT_REDIRECT'), {
  digest: 'NEXT_REDIRECT;replace;/restrict;307;',
});

describe('financial health loaders', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('reads the summary of a month from the backend, never cached', async () => {
    apiClientMock.mockResolvedValue(SUMMARY);

    expect(await loadFinancialHealth('2026-03')).toEqual(SUMMARY);
    expect(apiClientMock).toHaveBeenCalledWith(
      '/financial-health/summary?month=2026-03',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('reads a page of delinquent people from the backend, never cached', async () => {
    apiClientMock.mockResolvedValue({
      items: [],
      page: 2,
      pageSize: 20,
      total: 0,
    });

    await loadDelinquents(2);

    expect(apiClientMock).toHaveBeenCalledWith(
      '/financial-health/delinquents?page=2',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it.each([
    [403, 'forbidden'],
    [401, 'forbidden'],
    [500, 'failed'],
    [503, 'failed'],
    [404, 'not-found'],
  ])('UT-144 maps an AppError %d to %s', async (status, expected) => {
    apiClientMock.mockRejectedValue(new AppError('backend detail', status));

    expect(await loadFinancialHealth('2026-03')).toBe(expected);
    apiClientMock.mockRejectedValue(new AppError('backend detail', status));
    expect(await loadDelinquents(1)).toBe(expected);
  });

  it('UT-144 reads a failure that is not a backend answer as failed, without leaking its message', async () => {
    apiClientMock.mockRejectedValue(new Error('connection string leaked'));

    expect(await loadFinancialHealth('2026-03')).toBe('failed');
    expect(console.error).toHaveBeenCalledWith(expect.any(String), {
      status: undefined,
    });
  });

  it('UT-144 rethrows framework control-flow errors instead of mapping them', async () => {
    apiClientMock.mockRejectedValue(REDIRECT);

    await expect(loadFinancialHealth('2026-03')).rejects.toBe(REDIRECT);
    await expect(loadDelinquents(1)).rejects.toBe(REDIRECT);
  });
});

describe('financial panel loader', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  function answer(routes: Record<string, unknown>) {
    apiClientMock.mockImplementation(async (path: string) => {
      const route = Object.keys(routes).find(key => path.startsWith(key));
      const result = route ? routes[route] : undefined;
      if (result instanceof Error) throw result;
      return result;
    });
  }

  it('does not ask about the plan while the account is connected', async () => {
    answer({
      '/financial-health/summary': SUMMARY,
      '/financial-health/delinquents': {
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
      },
    });

    const data = await loadFinancialPanel({ month: '2026-03', page: 1 });

    expect(data.summary).toEqual(SUMMARY);
    expect(data.canBill).toBeNull();
    expect(apiClientMock).not.toHaveBeenCalledWith(
      '/billing/account',
      expect.anything()
    );
  });

  it('asks whether the plan can bill when the account is not connected', async () => {
    answer({
      '/financial-health/summary': {
        ...SUMMARY,
        billingState: 'NOT_CONNECTED',
      },
      '/financial-health/delinquents': {
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
      },
      '/billing/account': { premium: false },
    });

    const data = await loadFinancialPanel({ month: '2026-03', page: 1 });

    expect(data.canBill).toBe(false);
  });

  it('treats an unknown plan as unknown, not as a refusal', async () => {
    answer({
      '/financial-health/summary': {
        ...SUMMARY,
        billingState: 'RECONNECT_NEEDED',
      },
      '/financial-health/delinquents': {
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
      },
      '/billing/account': new AppError('down', 503),
    });

    const data = await loadFinancialPanel({ month: '2026-03', page: 1 });

    expect(data.canBill).toBeNull();
  });

  it('lets the summary and the list fail on their own', async () => {
    answer({
      '/financial-health/summary': SUMMARY,
      '/financial-health/delinquents': new AppError('down', 503),
    });

    const data = await loadFinancialPanel({ month: '2026-03', page: 1 });

    expect(data.summary).toEqual(SUMMARY);
    expect(data.delinquents).toBe('failed');
  });
});
