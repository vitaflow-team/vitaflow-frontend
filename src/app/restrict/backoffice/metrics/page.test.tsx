import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlatformMetrics } from '@/_types/platformMetrics';

const {
  redirectUnlessAdminTierMock,
  loadPlatformMetricsMock,
  redirectAccessDeniedMock,
} = vi.hoisted(() => ({
  redirectUnlessAdminTierMock: vi.fn(),
  loadPlatformMetricsMock: vi.fn(),
  redirectAccessDeniedMock: vi.fn(),
}));

vi.mock('@/_lib/adminTierAuthorization', () => ({
  redirectUnlessAdminTier: redirectUnlessAdminTierMock,
}));
vi.mock('@/_lib/accessDenied', () => ({
  redirectAccessDenied: redirectAccessDeniedMock,
}));
vi.mock('@/_lib/platformMetrics', () => ({
  loadPlatformMetrics: loadPlatformMetricsMock,
  isPlatformMetricsLoadFailure: (result: unknown) => typeof result === 'string',
}));

import BackofficeMetricsPage from './page';

const METRICS: PlatformMetrics = {
  mrr: { current: 12345, previousMonth: 11000, asOf: '2026-11-01T00:00:00Z' },
  registeredByRole: [
    { role: 'USER', free: 100, premium: 20, newThisMonth: 5 },
    { role: 'NUTRITIONIST', free: 10, premium: 3, newThisMonth: 1 },
    { role: 'PHYSICAL_EDUCATOR', free: 8, premium: 2, newThisMonth: 0 },
    { role: 'ACADEMIA', free: 4, premium: 1, newThisMonth: 0 },
  ],
  churnByRole: [
    { role: 'USER', canceledThisMonth: 2 },
    { role: 'NUTRITIONIST', canceledThisMonth: 0 },
    { role: 'PHYSICAL_EDUCATOR', canceledThisMonth: 0 },
    { role: 'ACADEMIA', canceledThisMonth: 0 },
  ],
  cohortRetention: [],
  ltvBySegment: [
    { role: 'USER', ltv: 2000 },
    { role: 'NUTRITIONIST', ltv: null },
  ],
};

function resetMocks() {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  redirectUnlessAdminTierMock.mockResolvedValue(undefined);
  loadPlatformMetricsMock.mockResolvedValue(METRICS);
}

// Stands in for the real `redirectAccessDenied`/Next.js `redirect`, which
// both throw to abort rendering — the mock must do the same so the page
// function's control flow after the call stops here too.
function throwNextRedirect(): never {
  throw new Error('NEXT_REDIRECT');
}

describe('Backoffice metrics page — admin gate (UT-018, UT-019)', () => {
  beforeEach(resetMocks);

  // UT-018
  it('renders the loaded metrics when admin-tier access is granted', async () => {
    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(redirectUnlessAdminTierMock).toHaveBeenCalledTimes(1);
    expect(loadPlatformMetricsMock).toHaveBeenCalledTimes(1);
    expect(html).toContain('R$');
    expect(html).toContain('Usuário · Free');
    expect(html).toContain('Cancelamentos por papel');
  });

  // UT-019
  it('redirects before loading any metrics when admin-tier access is denied', async () => {
    redirectUnlessAdminTierMock.mockImplementation(throwNextRedirect);

    await expect(BackofficeMetricsPage()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirectUnlessAdminTierMock).toHaveBeenCalledTimes(1);
    expect(loadPlatformMetricsMock).not.toHaveBeenCalled();
  });
});

describe('Backoffice metrics page — MRR comparison unavailable (UT-020)', () => {
  beforeEach(resetMocks);

  // UT-020
  it('renders a "comparison unavailable" state, not a false zero, when previousMonth is null', async () => {
    loadPlatformMetricsMock.mockResolvedValue({
      ...METRICS,
      mrr: { ...METRICS.mrr, previousMonth: null },
    });

    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Comparação indisponível');
    expect(html).not.toContain('0%');
    expect(html).not.toContain('+0%');
  });

  it('still renders current MRR and the rest of the dashboard when previousMonth is null', async () => {
    loadPlatformMetricsMock.mockResolvedValue({
      ...METRICS,
      mrr: { ...METRICS.mrr, previousMonth: null },
    });

    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('R$');
    expect(html).toContain('Cancelamentos por papel');
  });

  it('redirects on a forbidden metrics response instead of rendering', async () => {
    loadPlatformMetricsMock.mockResolvedValue('forbidden');

    await BackofficeMetricsPage();

    expect(redirectAccessDeniedMock).toHaveBeenCalledTimes(1);
  });

  it('renders a distinct failure message when the metrics load fails', async () => {
    loadPlatformMetricsMock.mockResolvedValue('failed');

    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Não foi possível carregar as métricas agora');
  });
});

describe('Backoffice metrics page — cohort retention and LTV by segment (cohort-ltv-analysis)', () => {
  beforeEach(resetMocks);

  it('renders the cohort retention grid and the LTV-by-segment tiles alongside the existing sections', async () => {
    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Retenção por coorte de cadastro');
    expect(html).toContain('LTV projetado por segmento');
  });

  // UT-022
  it('renders the "unavailable" tone, never a literal zero, for a role with ltv: null', async () => {
    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Dados insuficientes');
  });

  it('omits a role entirely from the LTV section when the backend omits it', async () => {
    loadPlatformMetricsMock.mockResolvedValue({
      ...METRICS,
      ltvBySegment: [{ role: 'USER', ltv: 2000 }],
    });

    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('2.000,00');
    expect(html).not.toContain('Dados insuficientes');
  });

  it('labels the LTV section as projected, and never shows an LTV:CAC figure', async () => {
    const page = await BackofficeMetricsPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('LTV projetado');
    expect(html.toLowerCase()).not.toContain('cac');
  });
});
