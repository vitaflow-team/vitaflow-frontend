import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  fetchPlanClaimsMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));

import { actionGetClientsByUser } from './clients/getClientsByUser';
import { actionGetPlans } from './products/getPlans';
import { actionGetProductsPlans } from './products/getProdductsPlans';

const CATALOG_CACHE = {
  cache: 'force-cache',
  next: { revalidate: 3600, tags: ['plans'] },
};

describe('refactor — request caching', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    apiClientMock.mockResolvedValue([]);
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  });

  // UT-009
  it('caches the /plans catalog for an hour under the plans tag', async () => {
    await actionGetPlans();

    expect(apiClientMock).toHaveBeenCalledWith('/plans', {
      method: 'GET',
      ...CATALOG_CACHE,
    });
  });

  // UT-009
  it('caches the /products catalog for an hour under the plans tag', async () => {
    await actionGetProductsPlans();

    expect(apiClientMock).toHaveBeenCalledWith('/products', {
      method: 'GET',
      ...CATALOG_CACHE,
    });
  });

  // UT-009: the client list is per-user, so it stays uncached and untagged.
  it('never caches the client list and sets no inert tag', async () => {
    await actionGetClientsByUser();

    const [path, init] = apiClientMock.mock.calls.at(-1) ?? [];
    expect(path).toBe('/clients');
    expect(init).toEqual({ method: 'GET', cache: 'no-store' });
    expect(init).not.toHaveProperty('next');
  });
});
