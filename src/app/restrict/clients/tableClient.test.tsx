import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/clients/deleteClientsByUser', () => ({
  actionDeleteClientsByUser: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_components/ui/dataTable', () => ({
  DataTable: ({
    deleteAction,
    deleteWarning,
  }: {
    deleteAction?: (row: { id: string }) => Promise<unknown>;
    deleteWarning?: (row: { id: string }) => string;
  }) => (
    <p>
      {deleteWarning?.({ id: 'c1' })}
      {deleteAction ? ' tem ação de exclusão' : ''}
    </p>
  ),
}));

import TableClients from './tableClient';

describe('clients table', () => {
  it('UT-131 mentions that open invoices will be canceled before removing', () => {
    const html = renderToStaticMarkup(<TableClients data={[]} />);

    expect(html).toContain(
      'Cobranças em aberto deste cliente serão canceladas.'
    );
    expect(html).toContain('tem ação de exclusão');
  });
});
