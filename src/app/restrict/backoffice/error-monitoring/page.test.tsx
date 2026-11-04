import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ErrorMonitoringListResult } from '@/_types/errorMonitoringListResult';

const {
  redirectUnlessAdminTierMock,
  loadErrorListMock,
  redirectAccessDeniedMock,
} = vi.hoisted(() => ({
  redirectUnlessAdminTierMock: vi.fn(),
  loadErrorListMock: vi.fn(),
  redirectAccessDeniedMock: vi.fn(),
}));

vi.mock('@/_lib/adminTierAuthorization', () => ({
  redirectUnlessAdminTier: redirectUnlessAdminTierMock,
}));
vi.mock('@/_lib/accessDenied', () => ({
  redirectAccessDenied: redirectAccessDeniedMock,
}));
vi.mock('@/_lib/errorMonitoring', () => ({
  loadErrorList: loadErrorListMock,
  isErrorMonitoringLoadFailure: (result: unknown) => typeof result === 'string',
}));

import BackofficeErrorMonitoringPage from './page';

const POPULATED: ErrorMonitoringListResult = {
  items: [
    {
      id: 'issue-1',
      title: 'TypeError: cannot read property of undefined',
      culprit: 'checkout.controller.ts',
      level: 'error',
      count: 12,
      firstSeen: '2026-10-15T13:00:00.000Z',
      lastSeen: '2026-10-20T09:30:00.000Z',
      status: 'unresolved',
      app: 'backend',
    },
  ],
};

function resetMocks() {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  redirectUnlessAdminTierMock.mockResolvedValue(undefined);
  loadErrorListMock.mockResolvedValue(POPULATED);
}

// Stands in for the real `redirectAccessDenied`/Next.js `redirect`, which
// both throw to abort rendering — the mock must do the same so the page
// function's control flow after the call stops here too.
function throwNextRedirect(): never {
  throw new Error('NEXT_REDIRECT');
}

describe('Backoffice error-monitoring page — admin gate (UT-022, UT-023)', () => {
  beforeEach(resetMocks);

  // UT-022
  it('renders the loaded list when admin-tier access is granted', async () => {
    const page = await BackofficeErrorMonitoringPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(redirectUnlessAdminTierMock).toHaveBeenCalledTimes(1);
    expect(loadErrorListMock).toHaveBeenCalledTimes(1);
    expect(html).toContain('TypeError: cannot read property of undefined');
  });

  // UT-023
  it('redirects before loading any data when admin-tier access is denied', async () => {
    redirectUnlessAdminTierMock.mockImplementation(throwNextRedirect);

    await expect(BackofficeErrorMonitoringPage()).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(redirectUnlessAdminTierMock).toHaveBeenCalledTimes(1);
    expect(loadErrorListMock).not.toHaveBeenCalled();
  });
});

describe('Backoffice error-monitoring page — list states (UT-024, US-001.EC-1)', () => {
  beforeEach(resetMocks);

  // UT-024
  it('renders the "can\'t load errors right now" state on sentry_unavailable, not an empty list', async () => {
    loadErrorListMock.mockResolvedValue('failed');

    const page = await BackofficeErrorMonitoringPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Não foi possível carregar os erros agora');
    expect(html).not.toContain('Nenhum erro inesperado');
  });

  // US-001.EC-1 — explicit empty state, distinct from the failure state above.
  it('renders a distinct empty state when the list is empty', async () => {
    loadErrorListMock.mockResolvedValue({ items: [] });

    const page = await BackofficeErrorMonitoringPage();
    const html = renderToStaticMarkup(<>{page}</>);

    expect(html).toContain('Nenhum erro inesperado');
    expect(html).not.toContain('Não foi possível carregar');
  });

  it('redirects on a forbidden list response instead of rendering', async () => {
    loadErrorListMock.mockResolvedValue('forbidden');

    await BackofficeErrorMonitoringPage();

    expect(redirectAccessDeniedMock).toHaveBeenCalledTimes(1);
  });
});
