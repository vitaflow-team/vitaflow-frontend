import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchPlanClaimsMock, redirectMock } = vi.hoisted(() => ({
  fetchPlanClaimsMock: vi.fn(),
  redirectMock: vi.fn((): never => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
  unstable_rethrow: (error: unknown) => {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT')
      throw error;
  },
}));

import {
  assertBillingOwner,
  assertProfessional,
  redirectUnlessBillingOwner,
  redirectUnlessProfessional,
} from './billingAuthorization';

function productTypeIs(productType: string | null) {
  fetchPlanClaimsMock.mockResolvedValue({ productType });
}

describe('billing authorization', () => {
  beforeEach(() => {
    fetchPlanClaimsMock.mockReset();
    redirectMock.mockClear();
  });

  it.each(['NUTRITIONIST', 'PHYSICAL_EDUCATOR', 'ACADEMIA'])(
    'lets a %s hold a billing account',
    async productType => {
      productTypeIs(productType);

      await expect(assertBillingOwner()).resolves.toBeUndefined();
    }
  );

  it.each(['USER', null])(
    'refuses %s as a billing owner',
    async productType => {
      productTypeIs(productType);

      await expect(assertBillingOwner()).rejects.toMatchObject({
        code: 'NOT_AUTHORIZED',
      });
    }
  );

  it('keeps manual invoicing professional-only: a gym owner is refused', async () => {
    productTypeIs('ACADEMIA');

    await expect(assertProfessional()).rejects.toMatchObject({
      code: 'NOT_AUTHORIZED',
    });
    productTypeIs('NUTRITIONIST');
    await expect(assertProfessional()).resolves.toBeUndefined();
  });

  it('sends whoever is not a billing owner home with the access notice', async () => {
    productTypeIs('USER');

    await expect(redirectUnlessBillingOwner()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirectMock).toHaveBeenCalledWith('/restrict?aviso=sem-permissao');
  });

  it('lets a billing owner through without redirecting', async () => {
    productTypeIs('ACADEMIA');

    await expect(redirectUnlessBillingOwner()).resolves.toBeUndefined();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('sends a gym owner away from a professional-only page', async () => {
    productTypeIs('ACADEMIA');

    await expect(redirectUnlessProfessional()).rejects.toThrow('NEXT_REDIRECT');
  });
});
