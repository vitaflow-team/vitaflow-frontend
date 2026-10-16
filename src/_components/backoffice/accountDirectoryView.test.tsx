import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { DirectoryListResult } from '@/_types/backofficeDirectory';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('@/_actions/backoffice/startViewAs', () => ({ startViewAs: {} }));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));

import { AccountDirectoryView } from './accountDirectoryView';

const EMPTY: DirectoryListResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
};

const POPULATED: DirectoryListResult = {
  items: [
    {
      kind: 'USER',
      id: 'u1',
      name: 'Diego Martins',
      email: 'diego@example.com',
    },
    {
      kind: 'ACADEMIA_OWNER',
      id: 'o1',
      name: 'Academia Vida Forte',
      email: 'owner@vidaforte.test',
    },
    {
      kind: 'ACADEMIA_RECEPTIONIST',
      id: 'r1',
      name: 'Recepção Vida Forte',
      email: 'recepcao@vidaforte.test',
    },
  ],
  total: 3,
  page: 1,
  pageSize: 50,
};

describe('AccountDirectoryView — platform-admin-access US-001, US-002, US-013, US-014', () => {
  it('US-013 shows a clean empty state for a search matching nothing', () => {
    const html = renderToStaticMarkup(<AccountDirectoryView result={EMPTY} />);

    expect(html).toContain('Nenhuma conta encontrada');
  });

  it('US-002, US-014 shows every result clearly labeled, academia owner distinguishable from receptionist', () => {
    const html = renderToStaticMarkup(
      <AccountDirectoryView result={POPULATED} />
    );

    expect(html).toContain('Diego Martins');
    expect(html).toContain('Usuário');
    expect(html).toContain('Academia Vida Forte');
    expect(html).toContain('Academia');
    expect(html).toContain('Recepção Vida Forte');
    expect(html).toContain('Recepcionista');
  });

  it('US-001 shows a "Ver como" action for every result', () => {
    const html = renderToStaticMarkup(
      <AccountDirectoryView result={POPULATED} />
    );

    expect(html.match(/Ver como/g)?.length).toBe(3);
  });
});
