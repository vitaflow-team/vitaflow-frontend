import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { deleteMeasurementRecord } from './deleteMeasurementRecord';

describe('deleteMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
  });

  it('UT-049 deletes the selected record', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockResolvedValue({});

    await deleteMeasurementRecord({
      id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
    });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/progress-records/0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
      {
        method: 'DELETE',
      }
    );
  });

  it('UT-050 rejects an unauthenticated request without calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await deleteMeasurementRecord({
      id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
    });

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('path id validation — deleteMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('UT-013 rejects a non-UUID id before calling the API', async () => {
    const [, error] = await deleteMeasurementRecord({ id: '../profile' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
