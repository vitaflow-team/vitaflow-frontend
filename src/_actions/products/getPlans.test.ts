import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import { actionGetPlans, type Product } from './getPlans';

const PLANS: Product[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    groupId: 'group-id',
    type: 'USER',
    stripeId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    productInfos: [],
  },
];

describe('plan category tabs — actionGetPlans', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('UT-032 returns the flat plan list from GET /plans', async () => {
    apiClientMock.mockResolvedValue(PLANS);

    const [result, error] = await actionGetPlans();

    expect(error).toBeNull();
    expect(result).toEqual(PLANS);
    expect(apiClientMock).toHaveBeenCalledWith('/plans', { method: 'GET' });
  });

  it('UT-032 turns a failure into a generic error', async () => {
    apiClientMock.mockRejectedValue(
      new Error('connect ECONNREFUSED 10.0.0.1:3000')
    );

    const [result, error] = await actionGetPlans();

    expect(result).toBeNull();
    expect(error?.code).toBe('ERROR');
    // O motivo técnico fica no log, não na tela (US-006.EC-3).
    expect(error?.message).toBe('Não foi possível carregar os planos.');
  });
});
