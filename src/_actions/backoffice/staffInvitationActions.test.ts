import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { acceptStaffInvitation } from './acceptStaffInvitation';
import { previewStaffInvitation } from './previewStaffInvitation';
import { resendStaffInvitation } from './resendStaffInvitation';

const STAFF_ID = '0190a5f0-7c3a-7b1e-8d2f-0123456789ab';
const INVALID_LINK =
  'Link de convite inválido ou expirado. Peça um novo convite.';

function backendFailure(status: number, code?: string) {
  apiClientMock.mockRejectedValue(new AppError('backend detail', status, code));
}

describe('unified login account — UT-043 staff invitation actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({ user: { id: 'admin-1' } });
    apiClientMock.mockResolvedValue({});
  });

  describe('previewStaffInvitation', () => {
    it('posts the token in the body and returns the preview', async () => {
      apiClientMock.mockResolvedValue({ tier: 'ADMIN', googleLinked: true });

      const [preview, error] = await previewStaffInvitation({ token: 'raw' });

      expect(error).toBeNull();
      expect(preview).toEqual({ tier: 'ADMIN', googleLinked: true });
      expect(apiClientMock).toHaveBeenCalledWith(
        '/backoffice/staff/invitation/preview',
        { method: 'POST', body: JSON.stringify({ token: 'raw' }) }
      );
    });

    it('maps invalid_token to the invalid-link message', async () => {
      backendFailure(400, 'invalid_token');

      const [preview, error] = await previewStaffInvitation({ token: 'raw' });

      expect(preview).toBeNull();
      expect(error?.message).toBe(INVALID_LINK);
    });

    it('rejects an empty token without calling the backend', async () => {
      const [, error] = await previewStaffInvitation({ token: '' });

      expect(error).not.toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    });
  });

  describe('acceptStaffInvitation', () => {
    const input = { token: 'raw', password: 'SenhaAtual123' };

    it('posts the token and the password in the body, never in the URL', async () => {
      const [, error] = await acceptStaffInvitation(input);

      expect(error).toBeNull();
      expect(apiClientMock).toHaveBeenCalledWith('/backoffice/staff/accept', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      expect(apiClientMock.mock.calls[0][0]).not.toContain('raw');
    });

    it.each([
      [400, 'invalid_token', INVALID_LINK],
      [401, 'invalid_password', 'Senha incorreta. Confira e tente novamente.'],
      [
        409,
        'account_inactive',
        'Ative sua conta antes de aceitar o convite para a equipe.',
      ],
    ])('maps %i %s to its own message', async (status, code, message) => {
      backendFailure(status, code);

      const [, error] = await acceptStaffInvitation(input);

      expect(error?.message).toBe(message);
    });

    it('never forwards an unexpected backend message', async () => {
      backendFailure(500);

      const [, error] = await acceptStaffInvitation(input);

      expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
      expect(error?.message).not.toContain('backend detail');
    });

    it('requires a password before calling the backend', async () => {
      const [, error] = await acceptStaffInvitation({
        token: 'raw',
        password: '',
      });

      expect(error).not.toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    });
  });

  describe('resendStaffInvitation', () => {
    it('posts to the member resend route as the admin themselves', async () => {
      const [, error] = await resendStaffInvitation({ staffId: STAFF_ID });

      expect(error).toBeNull();
      expect(apiClientMock).toHaveBeenCalledWith(
        `/backoffice/staff/${STAFF_ID}/resend`,
        { method: 'POST' },
        { ownToken: true }
      );
    });

    it('maps not_pending to its own message', async () => {
      backendFailure(409, 'not_pending');

      const [, error] = await resendStaffInvitation({ staffId: STAFF_ID });

      expect(error?.message).toBe('Este convite já foi aceito ou cancelado.');
    });

    it('refuses without a session and never calls the backend', async () => {
      authMock.mockResolvedValue(null);

      const [, error] = await resendStaffInvitation({ staffId: STAFF_ID });

      expect(error?.code).toBe('NOT_AUTHORIZED');
      expect(apiClientMock).not.toHaveBeenCalled();
    });

    it('refuses an id that is not a backend id', async () => {
      const [, error] = await resendStaffInvitation({
        staffId: '../profile',
      });

      expect(error).not.toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    });
  });
});
