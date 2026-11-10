import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { ServicePackage } from '@/_types/servicePackages';

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
vi.mock('@/_actions/service-packages/createServicePackage', () => ({
  createServicePackage: {},
}));
vi.mock('@/_actions/service-packages/updateServicePackage', () => ({
  updateServicePackage: {},
}));
vi.mock('@/_actions/service-packages/deactivateServicePackage', () => ({
  deactivateServicePackage: {},
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

import { ServicePackagesSection } from './servicePackagesSection';

const PACKAGES: ServicePackage[] = [
  {
    id: 'sp1',
    name: 'Pacote de 10',
    sessionCount: 10,
    referencePrice: 1200,
    active: true,
  },
  {
    id: 'sp2',
    name: 'Antigo',
    sessionCount: 5,
    referencePrice: 500,
    active: false,
  },
];

describe('ServicePackagesSection — plan-pricing-management US-006, US-008', () => {
  it('shows the create form and every package with edit/deactivate actions', () => {
    const html = renderToStaticMarkup(
      <ServicePackagesSection packages={PACKAGES} />
    );

    expect(html).toContain('Criar pacote');
    expect(html).toContain('Pacote de 10');
    expect(html).toContain('10 sessões');
    expect(html).toContain('Antigo');
    expect(html).toContain('(desativado)');
    expect(html).toContain('Editar');
    expect(html).toContain('Desativar');
  });

  it('never offers Desativar for an already-deactivated package', () => {
    const html = renderToStaticMarkup(
      <ServicePackagesSection packages={[PACKAGES[1]]} />
    );

    expect(html).not.toContain('Desativar');
    expect(html).toContain('Editar');
  });

  it('shows an explicit empty state with no packages yet', () => {
    const html = renderToStaticMarkup(<ServicePackagesSection packages={[]} />);

    expect(html).toContain('Nenhum pacote cadastrado ainda.');
  });
});
