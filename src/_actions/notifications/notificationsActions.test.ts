import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionMarkRead } from './markRead';
import { actionSetPreference } from './setPreference';

const NOTIFICATION_ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

function lastCall(): [string, RequestInit] {
  return apiClientMock.mock.calls.at(-1) as [string, RequestInit];
}

beforeEach(() => {
  apiClientMock.mockReset();
  apiClientMock.mockResolvedValue({});
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('actionMarkRead', () => {
  it('posts to the read endpoint for the given notification', async () => {
    const [, error] = await actionMarkRead({
      notificationId: NOTIFICATION_ID,
    });

    expect(error).toBeNull();
    expect(lastCall()[0]).toBe(`/notifications/${NOTIFICATION_ID}/read`);
    expect(lastCall()[1].method).toBe('POST');
  });

  it('maps a 404 to the not-found message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 404));

    const [, error] = await actionMarkRead({
      notificationId: NOTIFICATION_ID,
    });

    expect(error?.message).toContain('não encontrada');
  });

  it('rejects an invalid id before touching the backend', async () => {
    const [, error] = await actionMarkRead({ notificationId: 'not-a-uuid' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('rejects an unauthenticated call before touching the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionMarkRead({
      notificationId: NOTIFICATION_ID,
    });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('actionSetPreference', () => {
  it('patches the given category with the enabled flag', async () => {
    const [, error] = await actionSetPreference({
      category: 'MESSAGES',
      enabled: false,
    });

    expect(error).toBeNull();
    expect(lastCall()[0]).toBe('/notifications/preferences/MESSAGES');
    expect(lastCall()[1].method).toBe('PATCH');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      enabled: false,
    });
  });

  it('rejects an unauthenticated call before touching the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionSetPreference({
      category: 'BILLING',
      enabled: true,
    });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
