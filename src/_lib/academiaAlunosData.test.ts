import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({ unstable_rethrow: () => {} }));

import { loadAcademiaAlunos } from './academiaAlunosData';

const LIST = { items: [], total: 0, page: 1, pageSize: 50 };
const PARAMS = { search: undefined, horario: undefined, page: 1 };

function answer(account: unknown) {
  apiClientMock.mockImplementation(async (path: string) => {
    if (path.startsWith('/academia/students')) return LIST;
    if (path === '/academia/educators') return [];
    if (path === '/billing/account') {
      if (account instanceof Error) throw account;
      return account;
    }
    throw new Error(`unexpected ${path}`);
  });
}

describe('loadAcademiaAlunos — financial-health US-012, US-015', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('reports the billing availability of the gym next to the list', async () => {
    answer({
      premium: true,
      connected: true,
      status: 'CONNECTED',
      accountName: 'Academia',
      openInvoiceCount: 0,
    });

    const data = await loadAcademiaAlunos(PARAMS);

    expect(data).toMatchObject({
      list: LIST,
      employments: [],
      billing: 'READY',
    });
  });

  it('says what is in the way when billing is not connected or the subscription is unpaid', async () => {
    answer({ premium: true, connected: false, status: 'NOT_CONNECTED' });
    expect(await loadAcademiaAlunos(PARAMS)).toMatchObject({
      billing: 'NOT_CONNECTED',
    });

    answer({ premium: false, connected: false, status: 'NOT_CONNECTED' });
    expect(await loadAcademiaAlunos(PARAMS)).toMatchObject({
      billing: 'SUBSCRIPTION_REQUIRED',
    });
  });

  it('never loses the list when the billing account cannot be read', async () => {
    answer(new AppError('down', 503));

    const data = await loadAcademiaAlunos(PARAMS);

    expect(data).toMatchObject({ list: LIST, billing: 'READY' });
  });

  it('fails as before when the list itself cannot be read', async () => {
    apiClientMock.mockRejectedValue(new AppError('down', 500));

    expect(await loadAcademiaAlunos(PARAMS)).toBe('failed');
  });
});
