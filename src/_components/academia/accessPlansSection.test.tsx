import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaAccessPlan } from '@/_types/academia';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/createAccessPlan', () => ({
  createAccessPlan: {},
}));
vi.mock('@/_actions/academia/updateAccessPlan', () => ({
  updateAccessPlan: {},
}));
vi.mock('@/_actions/academia/deactivateAccessPlan', () => ({
  deactivateAccessPlan: {},
}));
vi.mock('@/_components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

import { AccessPlansSection } from './accessPlansSection';

const PLANS: AcademiaAccessPlan[] = [
  {
    id: 'p1',
    name: 'Mensal',
    validityType: 'DAYS',
    validityValue: 30,
    referencePrice: '129.90',
    active: true,
  },
  {
    id: 'p2',
    name: 'Antigo',
    validityType: 'VISITS',
    validityValue: 10,
    referencePrice: '99.00',
    active: false,
  },
];

describe('AccessPlansSection — gym-foundation US-018, US-019', () => {
  it('shows the informational notice, the create form and every plan', () => {
    const html = renderToStaticMarkup(<AccessPlansSection plans={PLANS} />);

    expect(html).toContain('o VitaFlow nunca cobra esse valor de ninguém');
    expect(html).toContain('Criar plano');
    expect(html).toContain('Mensal');
    expect(html).toContain('30 dias');
    expect(html).toContain('Antigo');
    expect(html).toContain('(desativado)');
    expect(html).toContain('Desativar');
  });

  it('never offers Desativar for an already-deactivated plan', () => {
    const html = renderToStaticMarkup(
      <AccessPlansSection plans={[PLANS[1]]} />
    );

    expect(html).not.toContain('Desativar');
    expect(html).toContain('Editar');
  });

  it('shows an explicit empty state with no plans yet', () => {
    const html = renderToStaticMarkup(<AccessPlansSection plans={[]} />);

    expect(html).toContain('Nenhum plano de acesso cadastrado ainda.');
  });
});
