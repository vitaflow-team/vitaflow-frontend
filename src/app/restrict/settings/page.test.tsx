import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, getPlansMock, updateSubscriptionMock } =
  vi.hoisted(() => ({
    apiClientMock: vi.fn(),
    authMock: vi.fn(),
    getPlansMock: vi.fn(),
    updateSubscriptionMock: vi.fn(),
  }));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/_actions/products/getPlans', () => ({
  actionGetPlans: getPlansMock,
}));
vi.mock('@/_actions/users/postUpdateSubscription', () => ({
  actionUpdateSubscription: updateSubscriptionMock,
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('@/_components/settings/planSessionSync', () => ({
  PlanSessionSync: ({ stale }: { stale: boolean }) => (
    <i data-stale={String(stale)} />
  ),
}));
vi.mock('@/_components/settings/settingsBreadcrumb', () => ({
  SettingsBreadcrumb: () => null,
}));
vi.mock('@/_components/settings/settingsTabs', () => ({
  SettingsTabs: () => null,
}));
vi.mock('@/_components/settings/unsavedChangesProvider', () => ({
  UnsavedChangesProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock('./settingsPanel', () => ({
  SettingsPanel: (props: { tab: string; plansFailed: boolean }) => (
    <b data-tab={props.tab} data-plans-failed={String(props.plansFailed)} />
  ),
}));

import Settings from './page';

const PAGE_SOURCE = readFileSync(
  fileURLToPath(new URL('./page.tsx', import.meta.url)),
  'utf8'
);

async function renderPage(query: Record<string, string | string[]>) {
  const page = await Settings({ searchParams: Promise.resolve(query) });
  return renderToStaticMarkup(<>{page}</>);
}

function silence() {}

function resetMocks() {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(silence);
  authMock.mockResolvedValue({ user: { productId: 'premium' } });
  apiClientMock.mockResolvedValue({ name: 'Ana', productId: 'premium' });
  getPlansMock.mockResolvedValue([[], null]);
  updateSubscriptionMock.mockResolvedValue([null, null]);
}

describe('refactor — settings page structure', () => {
  beforeEach(resetMocks);

  // UT-007: structural check — the page keeps no business logic of its own.
  it('holds no local profile type, status lists or staleness logic', () => {
    expect(PAGE_SOURCE).not.toMatch(/ACTIVE_STATUSES|PROFESSIONAL_TYPES/);
    expect(PAGE_SOURCE).not.toMatch(/type SettingsProfile\s*=/);
    expect(PAGE_SOURCE).not.toContain('isSessionPlanStale');
    expect(PAGE_SOURCE.split('\n').length).toBeLessThan(130);
  });

  it('renders nothing without a session', async () => {
    authMock.mockResolvedValue(null);

    expect(await Settings({ searchParams: Promise.resolve({}) })).toBeNull();
  });

  // UT-007
  it('loads the catalog only on the plan tab', async () => {
    await renderPage({ tab: 'perfil' });
    expect(getPlansMock).not.toHaveBeenCalled();

    const markup = await renderPage({ tab: 'plano' });
    expect(getPlansMock).toHaveBeenCalledTimes(1);
    expect(markup).toContain('data-plans-failed="false"');
  });
});

describe('refactor — settings page checkout sync and failures', () => {
  beforeEach(resetMocks);

  // UT-007 (US-002.EC-1): the checkout sync keeps its exact behavior.
  it('syncs a returning checkout before reading the profile', async () => {
    const markup = await renderPage({ checkout_session_id: 'cs_123' });

    expect(updateSubscriptionMock).toHaveBeenCalledWith({
      sessionId: 'cs_123',
    });
    expect(updateSubscriptionMock.mock.invocationCallOrder[0]).toBeLessThan(
      apiClientMock.mock.invocationCallOrder[0]
    );
    expect(markup).toContain('data-stale="true"');
  });

  // UT-005
  it('swallows a failed checkout sync and skips a repeated session id', async () => {
    updateSubscriptionMock.mockRejectedValue(new Error('stripe down'));
    await expect(
      renderPage({ checkout_session_id: 'cs_123' })
    ).resolves.toContain('data-tab="perfil"');

    updateSubscriptionMock.mockClear();
    const markup = await renderPage({ checkout_session_id: ['a', 'b'] });
    expect(updateSubscriptionMock).not.toHaveBeenCalled();
    expect(markup).toContain('data-stale="false"');
  });

  // UT-005
  it('keeps the tabs up when the profile or catalog fails to load', async () => {
    apiClientMock.mockRejectedValue(new Error('backend down'));
    getPlansMock.mockResolvedValue([null, { message: 'x' }]);

    const markup = await renderPage({ tab: 'plano' });

    expect(markup).toContain('data-tab="plano"');
    expect(markup).toContain('data-plans-failed="true"');
    expect(markup).toContain('data-stale="false"');
  });
});
