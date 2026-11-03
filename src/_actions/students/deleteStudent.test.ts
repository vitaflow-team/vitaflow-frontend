import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClient = vi.hoisted(() => vi.fn());

vi.mock('@/_lib/apiClient', () => ({ apiClient }));
vi.mock('@/_lib/studentsAuthorization', () => ({
  assertEducator: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'educator-1' } }),
}));

import { deleteStudent } from './deleteStudent';

const STUDENT_ID = '01890a5d-ac96-774b-bcce-b302099a8057';

describe('deleteStudent', () => {
  beforeEach(() => {
    apiClient.mockReset();
  });

  it('UT-131 passes the backend billingWarnings through', async () => {
    apiClient.mockResolvedValue({
      billingWarnings: [{ competenceYear: 2026, competenceMonth: 11 }],
    });

    const [result, error] = await deleteStudent({ id: STUDENT_ID });

    expect(error).toBeNull();
    expect(result?.billingWarnings).toEqual([
      { competenceYear: 2026, competenceMonth: 11 },
    ]);
  });

  it('succeeds with no warnings when the student is already gone', async () => {
    apiClient.mockRejectedValue(new AppError('not found', 404));

    const [result, error] = await deleteStudent({ id: STUDENT_ID });

    expect(error).toBeNull();
    expect(result?.billingWarnings).toEqual([]);
  });
});
