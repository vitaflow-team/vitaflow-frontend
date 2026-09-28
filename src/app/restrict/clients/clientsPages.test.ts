import { beforeEach, describe, expect, it, vi } from 'vitest';

const { redirectUnlessProfessionalMock, getClientsMock } = vi.hoisted(() => ({
  redirectUnlessProfessionalMock: vi.fn(),
  getClientsMock: vi.fn(),
}));

vi.mock('@/_lib/clientsAuthorization', () => ({
  redirectUnlessProfessional: redirectUnlessProfessionalMock,
}));
vi.mock('@/_actions/clients/getClientsByUser', () => ({
  actionGetClientsByUser: getClientsMock,
}));
vi.mock('./tableClient', () => ({ default: () => null }));
vi.mock('./[id]/clientView', () => ({ default: () => null }));

import ClientPage from './[id]/page';
import ClientsPage from './page';

const DENIED = new Error('NEXT_REDIRECT');

describe('auth input hardening — client pages re-check the role', () => {
  beforeEach(() => {
    redirectUnlessProfessionalMock.mockReset();
    getClientsMock.mockReset();
    getClientsMock.mockResolvedValue([[], null]);
  });

  it('the list page stops before loading data when the check redirects', async () => {
    redirectUnlessProfessionalMock.mockRejectedValue(DENIED);

    await expect(ClientsPage()).rejects.toBe(DENIED);
    expect(getClientsMock).not.toHaveBeenCalled();
  });

  it('the list page renders for a professional', async () => {
    redirectUnlessProfessionalMock.mockResolvedValue(undefined);

    await expect(ClientsPage()).resolves.toBeTruthy();
    expect(getClientsMock).toHaveBeenCalledTimes(1);
  });

  it('the detail page stops when the check redirects', async () => {
    redirectUnlessProfessionalMock.mockRejectedValue(DENIED);

    await expect(
      ClientPage({ params: Promise.resolve({ id: 'x' }) })
    ).rejects.toBe(DENIED);
  });

  it('the detail page renders for a professional', async () => {
    redirectUnlessProfessionalMock.mockResolvedValue(undefined);

    await expect(
      ClientPage({ params: Promise.resolve({ id: 'x' }) })
    ).resolves.toBeTruthy();
    expect(redirectUnlessProfessionalMock).toHaveBeenCalledTimes(1);
  });
});
