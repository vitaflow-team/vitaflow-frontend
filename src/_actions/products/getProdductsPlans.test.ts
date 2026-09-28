import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionGetProductsPlans, type ProductsPlan } from './getProdductsPlans';

const CATALOG: ProductsPlan[] = [
  {
    id: 'plan-1',
    name: 'Usuário',
    createdAt: '',
    updatedAt: '',
    products: [],
  },
];

/** A fresh API double, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

// The catalog is public: the action never reads a session, so there is no
// no-session case to cover.
describe('test coverage — actionGetProductsPlans', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('returns the plan catalog from /products', async () => {
    apiClientMock.mockResolvedValue(CATALOG);

    const [result, error] = await actionGetProductsPlans();

    expect(error).toBeNull();
    expect(result).toEqual(CATALOG);
    expect(apiClientMock).toHaveBeenCalledWith(
      '/products',
      expect.objectContaining({ method: 'GET' })
    );
  });

  // UT-010
  it('falls back to the generic message when the backend fails', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionGetProductsPlans();

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
