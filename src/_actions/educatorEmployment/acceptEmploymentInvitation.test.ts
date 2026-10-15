import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { AppError } from '@/_lib/AppError';
import { acceptEmploymentInvitation } from './acceptEmploymentInvitation';

const INVITATION_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'educator-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('acceptEmploymentInvitation — gym-foundation US-007, US-010', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('accepts the invitation', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await acceptEmploymentInvitation({ id: INVITATION_ID });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/educators/me/academia-invitations/${INVITATION_ID}/accept`,
      { method: 'POST' }
    );
  });

  it('rejects a non-educator account before calling the API', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'USER' });

    const [, error] = await acceptEmploymentInvitation({ id: INVITATION_ID });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('surfaces a cancelled/already-answered invitation clearly', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw', 404, 'invitation_not_found')
    );

    const [, error] = await acceptEmploymentInvitation({ id: INVITATION_ID });

    expect(error?.message).toBe('Convite não encontrado ou já respondido.');
  });
});
