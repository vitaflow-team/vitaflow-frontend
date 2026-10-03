import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZSAError } from 'zsa';

const { fetchPlanClaimsMock, redirectMock } = vi.hoisted(() => ({
  fetchPlanClaimsMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
  unstable_rethrow: vi.fn(),
}));

import { AppError } from './AppError';
import {
  assertProfessional,
  CLIENTS_ACCESS_DENIED,
  redirectUnlessProfessional,
} from './clientsAuthorization';

describe('auth input hardening — client-data role authorization', () => {
  beforeEach(() => {
    fetchPlanClaimsMock.mockReset();
    redirectMock.mockReset();
  });

  it.each(['USER', 'PHYSICAL_EDUCATOR', null])(
    'UT-011 rejects a caller whose profile productType is %j',
    async productType => {
      fetchPlanClaimsMock.mockResolvedValue({ productType });

      const rejection = assertProfessional();

      await expect(rejection).rejects.toBeInstanceOf(ZSAError);
      await expect(rejection).rejects.toMatchObject({
        code: 'NOT_AUTHORIZED',
        message: CLIENTS_ACCESS_DENIED,
      });
    }
  );

  // The physical educator has their own area (/restrict/students); the
  // clients area belongs to the nutritionist only.
  it('UT-011 lets a NUTRITIONIST through', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

    await expect(assertProfessional()).resolves.toBeUndefined();
  });

  it('fails closed with a safe message when the profile cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchPlanClaimsMock.mockRejectedValue(
      new AppError('db down: pg 5432', 500)
    );

    const rejection = assertProfessional();

    await expect(rejection).rejects.toBeInstanceOf(ZSAError);
    await expect(rejection).rejects.not.toMatchObject({
      message: 'db down: pg 5432',
    });
  });

  it('redirects a non-professional page visit to the access-denied notice', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

    await redirectUnlessProfessional();

    expect(redirectMock).toHaveBeenCalledWith('/restrict?aviso=sem-permissao');
  });

  it('lets a professional page visit render', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

    await redirectUnlessProfessional();

    expect(redirectMock).not.toHaveBeenCalled();
  });
});
