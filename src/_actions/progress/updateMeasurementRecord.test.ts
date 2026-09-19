import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { updateMeasurementRecord } from './updateMeasurementRecord';

describe('updateMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('UT-047 patches the selected record', async () => {
    const response = { id: 'record-id', weightKg: 60, heightCm: 168 };
    apiClientMock.mockResolvedValue(response);

    const [result, error] = await updateMeasurementRecord({
      id: 'record-id',
      weightKg: 60,
      heightCm: 168,
    });

    expect(apiClientMock).toHaveBeenCalledWith('/progress-records/record-id', {
      method: 'PATCH',
      body: JSON.stringify({ weightKg: 60, heightCm: 168 }),
    });
    expect(result).toEqual(response);
    expect(error).toBeNull();
  });

  it('UT-048 carries the backend ownership error message', async () => {
    apiClientMock.mockRejectedValue(new Error('Ação não permitida.'));

    const [, error] = await updateMeasurementRecord({
      id: 'record-id',
      weightKg: 60,
      heightCm: 168,
    });

    expect(error?.message).toBe('Ação não permitida.');
  });
});
