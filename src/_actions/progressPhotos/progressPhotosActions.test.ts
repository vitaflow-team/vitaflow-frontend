import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionDeletePhoto } from './deletePhoto';
import { actionGiveConsent } from './giveConsent';
import { actionUploadPhoto } from './uploadPhoto';

const PHOTO_ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

function lastCall(): [string, RequestInit] {
  return apiClientMock.mock.calls.at(-1) as [string, RequestInit];
}

function makeFile(): File {
  return new File([new Uint8Array(1024)], 'photo.png', { type: 'image/png' });
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

describe('actionGiveConsent', () => {
  it('posts to the consent endpoint', async () => {
    const [, error] = await actionGiveConsent();

    expect(error).toBeNull();
    expect(lastCall()[0]).toBe('/progress-photos/consent');
    expect(lastCall()[1].method).toBe('POST');
  });

  it('maps a 402 to the Premium-required message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 402));

    const [, error] = await actionGiveConsent();

    expect(error?.message).toContain('Premium');
  });

  it('rejects an unauthenticated call before touching the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionGiveConsent();

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('actionUploadPhoto', () => {
  it('builds multipart form data with angle and file', async () => {
    apiClientMock.mockResolvedValue({ id: 'photo-1', angle: 'FRONT' });

    const [result, error] = await actionUploadPhoto({
      angle: 'FRONT',
      file: makeFile(),
    });

    expect(error).toBeNull();
    expect(result).toEqual({ id: 'photo-1', angle: 'FRONT' });
    expect(lastCall()[0]).toBe('/progress-photos');
    expect(lastCall()[1].method).toBe('POST');
    const body = lastCall()[1].body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('angle')).toBe('FRONT');
    expect(body.get('file')).toBeInstanceOf(File);
  });

  it('maps a 403 to the consent-required message (US-001)', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 403));

    const [, error] = await actionUploadPhoto({
      angle: 'FRONT',
      file: makeFile(),
    });

    expect(error?.message).toContain('aceitar');
  });

  it('maps a 402 to the Premium-required message (US-006)', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 402));

    const [, error] = await actionUploadPhoto({
      angle: 'FRONT',
      file: makeFile(),
    });

    expect(error?.message).toContain('Premium');
  });

  it('rejects a non-image file before touching the backend', async () => {
    const [, error] = await actionUploadPhoto({
      angle: 'FRONT',
      file: new File(['x'], 'x.txt', { type: 'text/plain' }),
    });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('actionDeletePhoto', () => {
  it('deletes the given photo id', async () => {
    const [, error] = await actionDeletePhoto({ photoId: PHOTO_ID });

    expect(error).toBeNull();
    expect(lastCall()[0]).toBe(`/progress-photos/${PHOTO_ID}`);
    expect(lastCall()[1].method).toBe('DELETE');
  });

  it('maps a 404 to the not-found message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 404));

    const [, error] = await actionDeletePhoto({ photoId: PHOTO_ID });

    expect(error?.message).toContain('não encontrada');
  });

  it('rejects an invalid id before touching the backend', async () => {
    const [, error] = await actionDeletePhoto({ photoId: 'not-a-uuid' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
