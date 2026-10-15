import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { ProfessoresList } from '@/_types/professores';

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
vi.mock('@/_actions/academia/inviteAcademiaMember', () => ({
  inviteAcademiaMember: {},
}));
vi.mock('@/_actions/academia/cancelInvitation', () => ({
  cancelInvitation: {},
}));
vi.mock('@/_actions/academia/endEmployment', () => ({ endEmployment: {} }));
vi.mock('@/_components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));
vi.mock('@/_components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AlertDialogAction: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

import { ProfessoresView } from './professoresView';

const EMPTY: ProfessoresList = { items: [], total: 0, page: 1, pageSize: 50 };

const POPULATED: ProfessoresList = {
  items: [
    {
      id: 'e1',
      name: 'Ana Souza',
      email: 'ana@exemplo.com',
      status: 'ACTIVE',
      startedAt: '2026-01-10T00:00:00.000Z',
      academiaStudentCount: 3,
    },
    {
      id: 'i1',
      name: null,
      email: 'convidado@exemplo.com',
      status: 'PENDING',
      startedAt: null,
      academiaStudentCount: 0,
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
};

describe('ProfessoresView — gym-educators US-001, US-002, US-006, US-012', () => {
  it('shows the empty state with an invite CTA for a fresh academia', () => {
    const html = renderToStaticMarkup(<ProfessoresView list={EMPTY} />);

    expect(html).toContain('Você ainda não tem professores');
    expect(html).toContain('Convidar professor');
  });

  it('shows the distinct no-results state for a non-matching search, never the empty state', () => {
    const html = renderToStaticMarkup(
      <ProfessoresView list={EMPTY} search="zzz" />
    );

    expect(html).toContain('Nenhum professor encontrado');
    expect(html).not.toContain('Você ainda não tem professores');
  });

  it('renders active and pending rows with status, student count and the right actions', () => {
    const html = renderToStaticMarkup(<ProfessoresView list={POPULATED} />);

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Ativo');
    expect(html).toContain('3 alunos');
    expect(html).toContain('Remover');

    expect(html).toContain('convidado@exemplo.com');
    expect(html).toContain('Convite pendente');
    expect(html).toContain('Cancelar convite');
  });
});
