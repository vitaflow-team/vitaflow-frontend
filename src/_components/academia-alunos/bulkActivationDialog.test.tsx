import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_hooks/useBulkActivation', () => ({
  useBulkActivation: () => ({
    students: [
      {
        clientId: 'c1',
        name: 'Ana Souza',
        planName: 'Mensal',
        amountCents: 14990,
        hasTaxId: true,
      },
      {
        clientId: 'c2',
        name: 'Bruno Lima',
        planName: 'Mensal',
        amountCents: 14990,
        hasTaxId: false,
      },
    ],
    selected: ['c1'],
    dueDay: 17,
    outcome: null,
    loadError: null,
    isLoading: false,
    isRunning: false,
    load: vi.fn(),
    run: vi.fn(),
    setDueDay: vi.fn(),
    toggle: vi.fn(),
    selectAll: vi.fn(),
    clear: vi.fn(),
  }),
}));
vi.mock('@/_components/ui/dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => <>{children}</>;
  return {
    Dialog: Pass,
    DialogTrigger: Pass,
    DialogContent: Pass,
    DialogHeader: Pass,
    DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    DialogDescription: ({ children }: { children: ReactNode }) => (
      <p>{children}</p>
    ),
  };
});

import { BulkActivationDialog } from './bulkActivationDialog';

describe('BulkActivationDialog — financial-health US-015', () => {
  const html = renderToStaticMarkup(<BulkActivationDialog />);

  it('UT-143 lists the eligible students and warns about the one without a tax ID', () => {
    expect(html).toContain('Ana Souza');
    expect(html).toContain('Bruno Lima');
    expect(html.split('Sem CPF ou CNPJ cadastrado')).toHaveLength(2);
  });

  it('offers one due day for the selection and the activation button', () => {
    expect([...html.matchAll(/<option /g)]).toHaveLength(28);
    expect(html).toContain('Ativar selecionados');
    expect(html).toContain('1 de 2 selecionados');
  });

  it('explains that the first fee is issued now at the plan price', () => {
    expect(html).toContain('A primeira cobrança é emitida agora');
  });
});
