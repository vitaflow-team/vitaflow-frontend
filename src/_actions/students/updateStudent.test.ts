import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClient = vi.hoisted(() => vi.fn());
const accountNameFor = vi.hoisted(() => vi.fn());

vi.mock('@/_lib/apiClient', () => ({ apiClient }));
vi.mock('@/_lib/accountLookup', () => ({ accountNameFor }));
vi.mock('@/_lib/studentsAuthorization', () => ({
  assertEducator: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'educator-1' } }),
}));

import { updateStudent } from './updateStudent';

const STUDENT_ID = '01890a5d-ac96-774b-bcce-b302099a8057';
const changes = {
  id: STUDENT_ID,
  name: 'Diego Aluno',
  phone: '11999990000',
  birthDate: '',
};

describe('updateStudent (late account link)', () => {
  beforeEach(() => {
    apiClient.mockReset();
    accountNameFor.mockReset();
  });

  it('reports an existing account with its holder name instead of failing', async () => {
    apiClient.mockRejectedValue(new AppError('raw', 409, 'account_exists'));
    accountNameFor.mockResolvedValue('Diego Aluno');

    const [result, error] = await updateStudent({
      ...changes,
      email: 'diego@example.test',
      linkExistingAccount: false,
    });

    expect(error).toBeNull();
    expect(result).toEqual({
      outcome: 'account_exists',
      email: 'diego@example.test',
      accountName: 'Diego Aluno',
    });
    expect(accountNameFor).toHaveBeenCalledWith('diego@example.test');
  });

  it('sends the confirmed link so the account is linked on the second request', async () => {
    apiClient.mockResolvedValue(undefined);

    const [result, error] = await updateStudent({
      ...changes,
      email: 'diego@example.test',
      linkExistingAccount: true,
    });

    expect(error).toBeNull();
    expect(result).toEqual({ outcome: 'saved' });
    const body = JSON.parse(apiClient.mock.calls[0][1].body as string);
    expect(body.linkExistingAccount).toBe(true);
    expect(body.email).toBe('diego@example.test');
  });
});
