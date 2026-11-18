import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { receptionistCheckIn } from './receptionistCheckIn';

const CLIENT_ID = 'cly3x8p9b0000qzrm5f1a2b3c';

describe('receptionistCheckIn — financial-health US-019', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'staff-id' } });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('refuses a missing session', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await receptionistCheckIn({ clientId: CLIENT_ID });

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('returns { id, createdAt, notice } with the neutral notice as the backend sent it', async () => {
    const answer = {
      id: 'ck1',
      createdAt: '2026-11-17T14:30:00.000Z',
      notice: 'SEE_ADMINISTRATION',
    };
    apiClientMock.mockResolvedValue(answer);

    const [data, error] = await receptionistCheckIn({ clientId: CLIENT_ID });

    expect(error).toBeNull();
    expect(data).toEqual(answer);
    expect(apiClientMock).toHaveBeenCalledWith(
      `/academia/staff/students/${CLIENT_ID}/checkin`,
      { method: 'POST' }
    );
  });

  it('returns a null notice when the student owes nothing', async () => {
    apiClientMock.mockResolvedValue({
      id: 'ck2',
      createdAt: '2026-11-17T14:31:00.000Z',
      notice: null,
    });

    const [data] = await receptionistCheckIn({ clientId: CLIENT_ID });

    expect(data?.notice).toBeNull();
  });

  it('rejects an invalid student id before the backend', async () => {
    const [, error] = await receptionistCheckIn({ clientId: '../x' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('never echoes a backend failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw-internal', 500));

    const [, error] = await receptionistCheckIn({ clientId: CLIENT_ID });

    expect(error?.message).toBe(
      'Não foi possível concluir a ação. Tente novamente.'
    );
  });
});
