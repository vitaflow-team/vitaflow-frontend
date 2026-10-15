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
import { inviteAcademiaMember } from './inviteAcademiaMember';

function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'owner-id' } });
  fetchPlanClaimsMock.mockResolvedValue({ productType: 'ACADEMIA' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('inviteAcademiaMember — gym-foundation US-003, US-006', () => {
  beforeEach(resetMocks);
  afterEach(() => vi.restoreAllMocks());

  it('invites an educator by e-mail', async () => {
    apiClientMock.mockResolvedValue({ id: 'invite-1' });

    const [, error] = await inviteAcademiaMember({
      email: 'Educador@Exemplo.com',
      kind: 'EMPLOYMENT',
    });

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/academia/invitations', {
      method: 'POST',
      body: JSON.stringify({
        email: 'educador@exemplo.com',
        kind: 'EMPLOYMENT',
      }),
    });
  });

  it('rejects when the caller is not an Academia owner, without calling the API', async () => {
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });

    const [, error] = await inviteAcademiaMember({
      email: 'educador@exemplo.com',
      kind: 'EMPLOYMENT',
    });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it.each([
    [
      409,
      'invitation_pending',
      'Já existe um convite pendente para este e-mail.',
    ],
    [
      400,
      'not_physical_educator',
      'Só é possível convidar um educador físico para este vínculo.',
    ],
    [
      409,
      'already_employed',
      'Este educador já está empregado por esta academia.',
    ],
  ])(
    'maps a backend %i/%s to its safe message',
    async (status, code, message) => {
      apiClientMock.mockRejectedValue(
        new AppError('raw backend detail', status, code)
      );

      const [, error] = await inviteAcademiaMember({
        email: 'educador@exemplo.com',
        kind: 'EMPLOYMENT',
      });

      expect(error?.message).toBe(message);
    }
  );
});
