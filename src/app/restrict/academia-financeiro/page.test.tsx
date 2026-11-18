import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canAccess } from '@/_lib/routeAccess';

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
vi.mock('@/_lib/academiaAuthorization', () => ({
  redirectUnlessAcademiaOwner: gateMock,
}));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
  unstable_rethrow: () => {},
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import AcademiaFinanceiroPage from './page';

const GYM_PATH = '/restrict/academia-financeiro';

const SUMMARY = {
  audience: 'GYM',
  billingState: 'CONNECTED',
  hasHistory: true,
  month: '2026-11',
  current: {
    expectedCents: 60000,
    receivedCents: 10000,
    stillOwedCents: 50000,
  },
  previous: { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 },
  overdue: {
    totalCents: 40000,
    delinquentCount: 1,
    bands: { d1to7Cents: 0, d8to30Cents: 40000, d31PlusCents: 0 },
  },
};

const DELINQUENTS = {
  items: [
    {
      clientId: 's1',
      name: 'Carla Dias',
      totalOwedCents: 40000,
      overdueCount: 1,
      oldestDaysOverdue: 15,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
};

function backend(overrides: Record<string, unknown> = {}) {
  apiClientMock.mockImplementation(async (path: string) => {
    const answers: Record<string, unknown> = {
      '/financial-health/summary': SUMMARY,
      '/financial-health/delinquents': DELINQUENTS,
      '/billing/account': { premium: true },
      ...overrides,
    };
    const key = Object.keys(answers).find(prefix => path.startsWith(prefix));
    return key ? answers[key] : undefined;
  });
}

async function renderPage(query: Record<string, string> = {}) {
  const page = await AcademiaFinanceiroPage({
    searchParams: Promise.resolve(query),
  });
  return renderToStaticMarkup(<>{page}</>);
}

describe('gym financial page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T15:00:00Z'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({ user: { id: 'g1', productType: 'ACADEMIA' } });
    gateMock.mockResolvedValue(undefined);
    backend();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('IT-046 renders gym wording for an ACADEMIA session', async () => {
    const html = await renderPage();

    expect(html).toContain('Financeiro da academia');
    expect(html).toContain('Lista de alunos com ao menos uma cobrança');
    expect(html).toContain('Mensalidades em atraso');
    expect(html).toContain('href="/restrict/academia-alunos/s1"');
    expect(html).not.toContain('pacientes');
    expect(html).not.toContain('Premium');
  });

  it('IT-046 denies a NUTRITIONIST session by the route', () => {
    expect(canAccess(GYM_PATH, 'NUTRITIONIST')).toBe(false);
    expect(canAccess(GYM_PATH, 'PHYSICAL_EDUCATOR')).toBe(false);
    expect(canAccess(GYM_PATH, 'ACADEMIA')).toBe(true);
  });

  it('IT-046 stops a non-owner at the page too, before reading any data', async () => {
    gateMock.mockRejectedValue(new Error('NEXT_REDIRECT'));

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('IT-046 links the empty state to the settings Cobrança tab', async () => {
    backend({
      '/financial-health/summary': {
        ...SUMMARY,
        billingState: 'NOT_CONNECTED',
        hasHistory: false,
      },
    });

    const html = await renderPage();

    expect(html).toContain('href="/restrict/settings?tab=cobranca"');
    expect(html).toContain('Conecte a conta Asaas da academia');
    expect(html).not.toContain('R$');
  });

  it('asks a gym without a paid subscription for a subscription, never for Premium', async () => {
    backend({
      '/financial-health/summary': {
        ...SUMMARY,
        billingState: 'NOT_CONNECTED',
        hasHistory: false,
      },
      '/billing/account': { premium: false },
    });

    const html = await renderPage();

    expect(html).toContain('assinatura ativa da academia');
    expect(html).not.toContain('Premium');
  });

  it('UT-147 sends a missing session to sign-in keeping the gym panel path', async () => {
    authMock.mockResolvedValue(null);

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirectMock).toHaveBeenCalledWith(
      `/signin?callbackUrl=${encodeURIComponent(GYM_PATH)}`
    );
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('normalizes the month of the address like the professional page', async () => {
    await renderPage({ month: '2027-01' });

    expect(apiClientMock.mock.calls.map(call => call[0])).toContain(
      '/financial-health/summary?month=2026-11'
    );
  });
});
