import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchPlanClaimsMock } = vi.hoisted(() => ({
  fetchPlanClaimsMock: vi.fn(),
}));

vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));

import type { User } from 'next-auth';
import { jwtCallback } from './authCallbacks';

const PREVIOUS = {
  id: 'user-id',
  productId: 'p-old',
  productType: 'USER',
  productGroupId: 'g-old',
};

describe('immediate access update — jwtCallback', () => {
  beforeEach(() => {
    fetchPlanClaimsMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('UT-027 reads the claims from the server and ignores client data', async () => {
    fetchPlanClaimsMock.mockResolvedValue({
      productId: 'p-nutri',
      productType: 'NUTRITIONIST',
      productGroupId: 'g-nutri',
    });

    const token = await jwtCallback({
      token: { ...PREVIOUS },
      trigger: 'update',
      session: { user: { productType: 'HACKED', productId: 'p-hacked' } },
    });

    expect(fetchPlanClaimsMock).toHaveBeenCalledOnce();
    expect(token).toMatchObject({
      productId: 'p-nutri',
      productType: 'NUTRITIONIST',
      productGroupId: 'g-nutri',
    });
    expect(JSON.stringify(token)).not.toContain('HACKED');
    expect(JSON.stringify(token)).not.toContain('p-hacked');
  });

  it('UT-028 keeps the previous claims when the profile read fails', async () => {
    fetchPlanClaimsMock.mockRejectedValue(new Error('offline'));

    const token = await jwtCallback({
      token: { ...PREVIOUS },
      trigger: 'update',
      session: { user: { productType: 'HACKED' } },
    });

    expect(token).toMatchObject({
      productId: 'p-old',
      productType: 'USER',
      productGroupId: 'g-old',
    });
  });

  it('UT-029 keeps the login path copying the claims and no access token', async () => {
    const token = await jwtCallback({
      token: { sub: 'authjs-subject', id: 'initial-id' },
      user: {
        id: 'user-id',
        name: 'Vita User',
        email: 'user@example.com',
        productId: 'p-nutri',
        productType: 'NUTRITIONIST',
        productGroupId: 'g-nutri',
        accessToken: 'backend-secret',
      } as User & { accessToken: string },
    });

    expect(fetchPlanClaimsMock).not.toHaveBeenCalled();
    expect(token).toMatchObject({
      id: 'user-id',
      name: 'Vita User',
      email: 'user@example.com',
      productId: 'p-nutri',
      productType: 'NUTRITIONIST',
      productGroupId: 'g-nutri',
    });
    expect(token).not.toHaveProperty('accessToken');
  });
});
