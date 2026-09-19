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

    await deleteMeasurementRecord({ id: 'record-id' });

    expect(apiClientMock).toHaveBeenCalledWith('/progress-records/record-id', {
      method: 'DELETE',
    });
  });

  it('UT-050 rejects an unauthenticated request without calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await deleteMeasurementRecord({ id: 'record-id' });

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
