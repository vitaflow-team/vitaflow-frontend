import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/_lib/AppError';

const { apiClientMock, authMock, gateMock, redirectMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  gateMock: vi.fn(),
  redirectMock: vi.fn((): never => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/_lib/billingAuthorization', () => ({
  redirectUnlessProfessional: gateMock,
}));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
  unstable_rethrow: () => {},
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import FinanceiroPage from './page';

const PAGE_SOURCE = readFileSync(
  fileURLToPath(new URL('./page.tsx', import.meta.url)),
  'utf8'
);

const SUMMARY = {
  audience: 'PROFESSIONAL',
  billingState: 'CONNECTED',
  hasHistory: true,
  month: '2026-11',
  current: {
    expectedCents: 60000,
    receivedCents: 10000,
    stillOwedCents: 50000,
  },
  previous: { expectedCents: 50000, receivedCents: 0, stillOwedCents: 0 },
  overdue: {
    totalCents: 70000,
    delinquentCount: 2,
    bands: { d1to7Cents: 30000, d8to30Cents: 40000, d31PlusCents: 0 },
  },
};

const DELINQUENTS = {
  items: [
    {
      clientId: 'c1',
      name: 'Ana Souza',
      totalOwedCents: 45000,
      overdueCount: 2,
      oldestDaysOverdue: 12,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
};

function backend(overrides: Record<string, unknown> = {}) {
  apiClientMock.mockImplementation(async (path: string) => {
    const monthParam = /month=([\d-]+)/.exec(path)?.[1];
    const answers: Record<string, unknown> = {
      '/financial-health/summary': { ...SUMMARY, month: monthParam },
      '/financial-health/delinquents': DELINQUENTS,
      '/billing/account': { premium: true },
      ...overrides,
    };
    const key = Object.keys(answers).find(prefix => path.startsWith(prefix));
    const answer = key ? answers[key] : undefined;
    if (answer instanceof Error) throw answer;
    return answer;
  });
}

async function renderPage(query: Record<string, string | string[]> = {}) {
  const page = await FinanceiroPage({ searchParams: Promise.resolve(query) });
  return renderToStaticMarkup(<>{page}</>);
}

function requestedPaths(): string[] {
  return apiClientMock.mock.calls.map(call => call[0] as string);
}

describe('professional financial page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T15:00:00Z'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({
      user: { id: 'u1', productType: 'PHYSICAL_EDUCATOR' },
    });
    gateMock.mockResolvedValue(undefined);
    backend();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('UT-145 renders the selected month label and requests that month', async () => {
    const html = await renderPage({ month: '2026-03' });

    expect(html).toContain('Resumo de Março de 2026');
    expect(requestedPaths()).toContain(
      '/financial-health/summary?month=2026-03'
    );
  });

  it('UT-145 requests the current month for an invalid, future or too old month', async () => {
    for (const month of ['2026-13', 'abc', '2027-01', '2025-10']) {
      apiClientMock.mockClear();
      await renderPage({ month });
      expect(requestedPaths()).toContain(
        '/financial-health/summary?month=2026-11'
      );
    }
  });

  it('UT-145 requests the current month when no month is given and forwards a valid page', async () => {
    await renderPage({ page: '2' });

    expect(requestedPaths()).toContain(
      '/financial-health/summary?month=2026-11'
    );
    expect(requestedPaths()).toContain('/financial-health/delinquents?page=2');
  });

  it('IT-044 renders tiles, bands and rows with links from the backend answers', async () => {
    const html = await renderPage();

    expect(html).toContain('Previsto');
    expect(html).toContain('R$ 600,00');
    expect(html).toContain('1–7 dias');
    expect(html).toContain('8–30 dias');
    expect(html).toContain('31+ dias');
    expect(html).toContain('Ana Souza');
    expect(html).toContain('href="/restrict/students/c1/billing"');
  });

  it('IT-044 renders the access-denied message on a 403', async () => {
    backend({ '/financial-health/summary': new AppError('x', 403) });

    const html = await renderPage();

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).not.toContain('R$');
  });

  it('IT-044 renders the retry message on a 500', async () => {
    backend({ '/financial-health/summary': new AppError('x', 500) });

    const html = await renderPage();

    expect(html).toContain('Não foi possível carregar o painel financeiro.');
    expect(html).toContain('Tentar novamente');
    expect(html).not.toContain('R$');
  });

  it('IT-044 redirects a missing session to sign-in and reads nothing', async () => {
    authMock.mockResolvedValue(null);

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirectMock).toHaveBeenCalledWith(
      '/signin?callbackUrl=%2Frestrict%2Ffinanceiro'
    );
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-147 preserves the panel path as the sign-in callback', async () => {
    authMock.mockResolvedValue({});

    await expect(renderPage({ month: '2026-03' })).rejects.toThrow(
      'NEXT_REDIRECT'
    );
    expect(redirectMock).toHaveBeenCalledWith(
      '/signin?callbackUrl=%2Frestrict%2Ffinanceiro'
    );
  });

  it('stops before reading data when the role check redirects', async () => {
    gateMock.mockRejectedValue(new Error('NEXT_REDIRECT'));

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('uses "pacientes" and the patient billing tab for a nutritionist', async () => {
    authMock.mockResolvedValue({
      user: { id: 'u1', productType: 'NUTRITIONIST' },
    });

    const html = await renderPage();

    expect(html).toContain('Lista de pacientes');
    expect(html).toContain('href="/restrict/patients/c1/cobranca"');
  });

  it('asks whether the plan can bill only when the account is not connected', async () => {
    await renderPage();
    expect(requestedPaths()).not.toContain('/billing/account');

    apiClientMock.mockClear();
    backend({
      '/financial-health/summary': {
        ...SUMMARY,
        billingState: 'NOT_CONNECTED',
        hasHistory: false,
      },
      '/billing/account': { premium: false },
    });
    const html = await renderPage();

    expect(requestedPaths()).toContain('/billing/account');
    expect(html).toContain('recurso Premium');
    expect(html).not.toContain('R$');
  });

  it('keeps page.tsx to orchestration: no formatting or business rules of its own', () => {
    expect(PAGE_SOURCE).not.toMatch(/formatBRL|Intl\.|toLocale|\.toFixed/);
    expect(PAGE_SOURCE).not.toMatch(/BillingState|NOT_CONNECTED|hasHistory/);
    expect(PAGE_SOURCE.split('\n').length).toBeLessThan(60);
  });
});
