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
import { declineEmploymentInvitation } from './declineEmploymentInvitation';

const INVITATION_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'educator-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('declineEmploymentInvitation — gym-foundation US-008', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('declines the invitation, creating no employment', async () => {
    apiClientMock.mockResolvedValue({});

    const [, error] = await declineEmploymentInvitation({
      id: INVITATION_ID,
    });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith(
      `/educators/me/academia-invitations/${INVITATION_ID}/decline`,
      { method: 'POST' }
    );
  });

  it('surfaces a cancelled/already-answered invitation clearly', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw', 404, 'invitation_not_found')
    );

    const [, error] = await declineEmploymentInvitation({
      id: INVITATION_ID,
    });

    expect(error?.message).toBe('Convite não encontrado ou já respondido.');
  });
});
