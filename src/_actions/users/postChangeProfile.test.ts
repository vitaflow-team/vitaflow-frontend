import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionChangeProfile } from './postChangeProfile';

const PROFILE = {
  name: 'Ana',
  email: 'Ana@Example.com',
  phone: '(11) 91234-5678',
  birthDate: '1990-01-01',
  address: {
    addressLine1: 'Rua A, 10',
    addressLine2: '',
    district: 'Centro',
    postalCode: '01001-000',
    region: 'sp',
    city: 'São Paulo',
  },
};

/** The multipart body the action sent to `/profile`. */
function sentFormData(): FormData {
  const [, init] = apiClientMock.mock.calls.at(-1) ?? [];
  return init.body as FormData;
}

/** A signed-in user, with the action's error log kept quiet. */
function resetMocks() {
  apiClientMock.mockReset();
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('test coverage — actionChangeProfile', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('posts the parsed profile as multipart data, without an avatar', async () => {
    apiClientMock.mockResolvedValue(undefined);

    const [, error] = await actionChangeProfile(PROFILE);

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/profile', {
      method: 'POST',
      body: expect.any(FormData),
    });
    const body = sentFormData();
    expect(body.get('name')).toBe('Ana');
    expect(body.get('email')).toBe('ana@example.com');
    expect(body.get('phone')).toBe('(11) 91234-5678');
    expect(body.get('birthDate')).toBe('1990-01-01');
    expect(body.get('addressLine1')).toBe('Rua A, 10');
    expect(body.get('addressLine2')).toBe('');
    expect(body.get('district')).toBe('Centro');
    expect(body.get('city')).toBe('São Paulo');
    expect(body.get('region')).toBe('SP');
    expect(body.get('postalCode')).toBe('01001-000');
    expect(body.has('avatar')).toBe(false);
  });

  // UT-010
  it('attaches the avatar file when one is chosen', async () => {
    apiClientMock.mockResolvedValue(undefined);
    const avatar = new File(['png'], 'avatar.png', { type: 'image/png' });

    const [, error] = await actionChangeProfile({ ...PROFILE, avatar });

    expect(error).toBeNull();
    const sent = sentFormData().get('avatar');
    expect(sent).toBeInstanceOf(File);
    expect((sent as File).name).toBe('avatar.png');
  });
});

describe('test coverage — actionChangeProfile rejections', () => {
  beforeEach(resetMocks);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // UT-010
  it('rejects a request without a session before calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionChangeProfile(PROFILE);

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(error?.message).toBe('Usuário não autenticado');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  // UT-010
  it('maps a backend 400 to its safe message', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 400));

    const [, error] = await actionChangeProfile(PROFILE);

    expect(error?.message).toBe(
      'Verifique os dados do perfil e tente novamente.'
    );
  });

  // UT-010
  it('falls back to the generic message on an unexpected backend error', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 500));

    const [, error] = await actionChangeProfile(PROFILE);

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
