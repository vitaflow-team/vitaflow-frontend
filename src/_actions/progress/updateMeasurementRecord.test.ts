import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { updateMeasurementRecord } from './updateMeasurementRecord';

describe('updateMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('UT-047 patches the selected record', async () => {
    const response = {
      id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
      weightKg: 60,
      heightCm: 168,
    };
    apiClientMock.mockResolvedValue(response);

    const [result, error] = await updateMeasurementRecord({
      id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
      weightKg: 60,
      heightCm: 168,
    });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/progress-records/0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
      {
        method: 'PATCH',
        body: JSON.stringify({ weightKg: 60, heightCm: 168 }),
      }
    );
    expect(result).toEqual(response);
    expect(error).toBeNull();
  });

  it('UT-048 maps the backend ownership error to its safe message', async () => {
    apiClientMock.mockRejectedValue(new AppError('Ação não permitida.', 401));

    const [, error] = await updateMeasurementRecord({
      id: '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b',
      weightKg: 60,
      heightCm: 168,
    });

    expect(error?.message).toBe('Ação não permitida.');
  });
});

describe('path id validation — updateMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
  });

  it('UT-013 rejects a non-UUID id before calling the API', async () => {
    const [, error] = await updateMeasurementRecord({
      id: '../users/profile',
      weightKg: 60,
      heightCm: 168,
    });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
