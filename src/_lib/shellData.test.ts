import type { Session } from 'next-auth';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));

import { getShellData } from './shellData';

const session = {
  user: {
    id: 'user-id',
    name: 'Fernando Vicari',
    avatar: 'https://cdn.example/session-avatar.png',
  },
  expires: '2026-12-31T00:00:00.000Z',
} as unknown as Session;

describe('restricted shell data — getShellData', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UT-043 maps the profile into the shell shape', async () => {
    apiClientMock.mockResolvedValue({
      name: 'Fernando Vicari',
      avatar: 'https://cdn.example/profile-avatar.png',
      productName: 'Premium',
      subscriptionStatus: 'active',
      subscriptionCancelAt: null,
      subscriptionCurrentPeriodEnd: '2026-10-18T15:00:00.000Z',
    });

    const shell = await getShellData(session);

    expect(apiClientMock).toHaveBeenCalledWith('/profile', { method: 'GET' });
    expect(shell).toEqual({
      firstName: 'Fernando',
      avatar: 'https://cdn.example/profile-avatar.png',
      productName: 'Premium',
      subscriptionStatus: 'active',
      subscriptionCancelAt: null,
      subscriptionCurrentPeriodEnd: '2026-10-18T15:00:00.000Z',
      profileLoaded: true,
    });
  });

  it('UT-044 falls back to the session when the profile request fails', async () => {
    apiClientMock.mockRejectedValue(new Error('backend indisponível'));

    const shell = await getShellData(session);

    expect(shell).toEqual({
      firstName: 'Fernando',
      avatar: 'https://cdn.example/session-avatar.png',
      productName: null,
      subscriptionStatus: null,
      subscriptionCancelAt: null,
      subscriptionCurrentPeriodEnd: null,
      profileLoaded: false,
    });

    // O aviso registra a degradação sem carregar dado pessoal.
    const warning = vi.mocked(console.warn).mock.calls[0]?.join(' ') ?? '';
    expect(warning).not.toContain('Fernando');
    expect(warning).not.toContain('user-id');
  });

  it('UT-044 also survives a missing session', async () => {
    apiClientMock.mockRejectedValue(new Error('backend indisponível'));

    await expect(getShellData(null)).resolves.toEqual({
      firstName: '',
      avatar: null,
      productName: null,
      subscriptionStatus: null,
      subscriptionCancelAt: null,
      subscriptionCurrentPeriodEnd: null,
      profileLoaded: false,
    });
  });
});
