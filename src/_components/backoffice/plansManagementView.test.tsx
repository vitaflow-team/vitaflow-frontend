import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { ProductCatalogEntry } from '@/_types/backofficePlans';

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
vi.mock('@/_actions/backoffice/plans/createProduct', () => ({
  createProduct: {},
}));
vi.mock('@/_actions/backoffice/plans/repriceProduct', () => ({
  repriceProduct: {},
}));
vi.mock('@/_actions/backoffice/plans/deactivateProduct', () => ({
  deactivateProduct: {},
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

import { PlansManagementView } from './plansManagementView';

const CATALOG: ProductCatalogEntry[] = [
  {
    id: 'p1',
    name: 'Mensal',
    price: 29.9,
    type: 'USER',
    tier: 'STANDARD',
    active: true,
    groupId: 'g1',
    groupName: 'Mensal',
  },
  {
    id: 'p2',
    name: 'Mensal (antigo)',
    price: 19.9,
    type: 'USER',
    tier: 'STANDARD',
    active: false,
    groupId: 'g1',
    groupName: 'Mensal',
  },
  {
    id: 'p3',
    name: 'Profissional mensal',
    price: 99.9,
    type: 'NUTRITIONIST',
    tier: 'PREMIUM',
    active: true,
    groupId: 'g2',
    groupName: 'Profissional',
  },
];

describe('PlansManagementView — plan-pricing-management US-001 through US-005', () => {
  it('UT-020: canMutate true renders create/reprice/deactivate controls', () => {
    const html = renderToStaticMarkup(
      <PlansManagementView catalog={CATALOG} canMutate={true} />
    );

    expect(html).toContain('Criar produto');
    expect(html).toContain('Reprecificar');
    expect(html).toContain('Desativar');
  });

  it('UT-021: canMutate false hides mutation controls but keeps the read-only list', () => {
    const html = renderToStaticMarkup(
      <PlansManagementView catalog={CATALOG} canMutate={false} />
    );

    expect(html).not.toContain('Criar produto');
    expect(html).not.toContain('Reprecificar');
    expect(html).not.toContain('Desativar');

    expect(html).toContain('Usuário');
    expect(html).toContain('Mensal');
    expect(html).toContain('(desativado)');
    expect(html).toContain('Nutricionista');
    expect(html).toContain('Profissional mensal');
  });

  it('shows the explicit empty-state message for a role with zero active products', () => {
    const html = renderToStaticMarkup(
      <PlansManagementView catalog={CATALOG} canMutate={true} />
    );

    expect(html).toContain('Nenhum produto ativo para Educador físico.');
    expect(html).toContain('Nenhum produto ativo para Academia.');
  });
});
