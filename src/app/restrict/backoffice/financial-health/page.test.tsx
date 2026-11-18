import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/_lib/AppError';

const { apiClientMock, gateMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  gateMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/_lib/backofficeAuthorization', () => ({
  redirectUnlessBackoffice: gateMock,
}));
vi.mock('next/navigation', () => ({ unstable_rethrow: () => {} }));

import BackofficeFinancialHealthPage from './page';

const PAGE_SOURCE = readFileSync(
  fileURLToPath(new URL('./page.tsx', import.meta.url)),
  'utf8'
);

const SUMMARY_PATH = '/backoffice/financial-health/summary';
const DELINQUENTS_PATH = '/backoffice/financial-health/delinquents';

const ZERO = { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 };
const NO_OVERDUE = {
  totalCents: 0,
  delinquentCount: 0,
  bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
};

function summary(month: string, overrides: Record<string, unknown> = {}) {
  return {
    month,
    available: true,
    syncedAt: '2026-11-17T17:30:00.000Z',
    totals: {
      expectedCents: 24980,
      receivedCents: 14990,
      stillOwedCents: 9990,
    },
    byAccountType: {
      USER: ZERO,
      NUTRITIONIST: ZERO,
      PHYSICAL_EDUCATOR: ZERO,
      ACADEMIA: ZERO,
    },
    previous: null,
    overdue: {
      totalCents: 9990,
      delinquentCount: 1,
      bands: { d1to7Cents: 9990, d8to30Cents: 0, d31PlusCents: 0 },
      byAccountType: {
        USER: NO_OVERDUE,
        NUTRITIONIST: NO_OVERDUE,
        PHYSICAL_EDUCATOR: NO_OVERDUE,
        ACADEMIA: NO_OVERDUE,
      },
    },
    ...overrides,
  };
}

function delinquents(tier: 'ADMIN' | 'EQUIPE') {
  return {
    tier,
    bandCounts: { d1to7: 3, d8to30: 2, d31Plus: 1 },
    items: [
      {
        userId: 'u1',
        name: 'Ana Souza',
        accountType: 'NUTRITIONIST',
        planName: 'Profissional Premium',
        totalOwedCents: 9990,
        oldestDaysOverdue: 12,
      },
    ],
    page: 1,
    pageSize: 20,
    total: 1,
  };
}

function backend(overrides: Record<string, unknown> = {}) {
  apiClientMock.mockImplementation(async (path: string) => {
    const month = /month=([\d-]+)/.exec(path)?.[1] ?? '2026-11';
    const answers: Record<string, unknown> = {
      [DELINQUENTS_PATH]: delinquents('ADMIN'),
      [SUMMARY_PATH]: summary(month),
      ...overrides,
    };
    const key = Object.keys(answers).find(prefix => path.startsWith(prefix));
    const answer = key ? answers[key] : undefined;
    if (answer instanceof Error) throw answer;
    return answer;
  });
}

async function renderPage(query: Record<string, string | string[]> = {}) {
  const page = await BackofficeFinancialHealthPage({
    searchParams: Promise.resolve(query),
  });
  return renderToStaticMarkup(<>{page}</>);
}

function requestedPaths(): string[] {
  return apiClientMock.mock.calls.map(call => call[0] as string);
}

describe('backoffice financial health page — financial-health US-021 to US-026', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T15:00:00Z'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    gateMock.mockResolvedValue(undefined);
    backend();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('UT-137 IT-045 tier EQUIPE renders the list and the band counts, never requests the summary and shows no revenue totals', async () => {
    backend({ [DELINQUENTS_PATH]: delinquents('EQUIPE') });

    const html = await renderPage();

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Inadimplentes por faixa de atraso');
    expect(html).not.toContain('Recebido');
    expect(html).not.toContain('Previsto');
    expect(requestedPaths().some(path => path.startsWith(SUMMARY_PATH))).toBe(
      false
    );
  });

  it('UT-137 IT-045 tier ADMIN requests the summary after the list and renders totals and the list', async () => {
    const html = await renderPage();

    expect(html).toContain('Recebido');
    expect(html).toMatch(/R\$\s249,80/);
    expect(html).toContain('Ana Souza');
    expect(requestedPaths()).toEqual([
      `${DELINQUENTS_PATH}?page=1`,
      `${SUMMARY_PATH}?month=2026-11`,
    ]);
  });

  it('IT-045 reads both endpoints with the staff member own token', async () => {
    await renderPage();

    for (const call of apiClientMock.mock.calls) {
      expect(call[2]).toEqual({ ownToken: true });
    }
  });

  it('IT-045 a 403 not_backoffice on the list renders access denied and requests no summary', async () => {
    backend({
      [DELINQUENTS_PATH]: new AppError('x', 403, 'not_backoffice'),
    });

    const html = await renderPage();

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).not.toContain('Ana Souza');
    expect(requestedPaths().some(path => path.startsWith(SUMMARY_PATH))).toBe(
      false
    );
  });

  it('IT-045 a month flagged available: false renders "indisponível" instead of zeros', async () => {
    backend({
      [SUMMARY_PATH]: summary('2025-12', {
        available: false,
        totals: null,
        byAccountType: null,
        previous: null,
      }),
    });

    const html = await renderPage({ month: '2025-12' });

    expect(html).toContain('indisponível');
    expect(html).not.toContain('R$ 0,00');
    expect(html).toContain('Em atraso hoje');
  });

  it('US-023.EC-3 a 503 access_log_failed renders its own state with no list and no counts', async () => {
    backend({
      [DELINQUENTS_PATH]: new AppError('x', 503, 'access_log_failed'),
    });

    const html = await renderPage();

    expect(html).toContain('Não foi possível registrar o seu acesso');
    expect(html).not.toContain('Ana Souza');
    expect(html).not.toContain('faixa de atraso');
    expect(requestedPaths()).toEqual([`${DELINQUENTS_PATH}?page=1`]);
  });

  it('US-025.EC-2 asks for the current month when the address has an invalid, future or too old month', async () => {
    for (const month of ['2026-13', 'abc', '2027-01', '2025-10']) {
      apiClientMock.mockClear();
      await renderPage({ month });
      expect(requestedPaths()).toContain(`${SUMMARY_PATH}?month=2026-11`);
    }
  });

  it('asks for the month and the page of the address when they are valid', async () => {
    await renderPage({ month: '2026-03', page: '2' });

    expect(requestedPaths()).toEqual([
      `${DELINQUENTS_PATH}?page=2`,
      `${SUMMARY_PATH}?month=2026-03`,
    ]);
  });

  it('IT-045 a 500 on the summary renders the retry message and keeps the list', async () => {
    backend({ [SUMMARY_PATH]: new AppError('x', 500) });

    const html = await renderPage();

    expect(html).toContain('Não foi possível carregar o resumo financeiro');
    expect(html).toContain('Ana Souza');
  });

  it('stops before reading anything when the backoffice gate redirects', async () => {
    gateMock.mockRejectedValue(new Error('NEXT_REDIRECT'));

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('keeps page.tsx to orchestration: no formatting or tier rules of its own', () => {
    expect(PAGE_SOURCE).not.toMatch(/formatBRL|Intl\.|toLocale|\.toFixed/);
    expect(PAGE_SOURCE).not.toMatch(/ADMIN|EQUIPE|available/);
    expect(PAGE_SOURCE.split('\n').length).toBeLessThan(60);
  });
});
