import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import type {
  AcademiaEmployment,
  AcademiaInvitation,
  AcademiaStaffMember,
} from '@/_types/academia';

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
vi.mock('@/_actions/academia/removeStaff', () => ({ removeStaff: {} }));
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

import { TeamSection } from './teamSection';

const INVITATIONS: AcademiaInvitation[] = [
  {
    id: 'i1',
    kind: 'EMPLOYMENT',
    email: 'pendente@exemplo.com',
    status: 'PENDING',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const EMPLOYMENTS: AcademiaEmployment[] = [
  {
    id: 'e1',
    educatorId: 'educator-1',
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    endedAt: null,
    educator: { id: 'educator-1', name: 'Ana Souza', email: 'ana@exemplo.com' },
  },
];

const STAFF: AcademiaStaffMember[] = [
  {
    id: 's1',
    name: 'Beatriz Lima',
    email: 'beatriz@exemplo.com',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('TeamSection — gym-foundation US-003, US-004, US-006, US-011', () => {
  it('shows both invite forms, the pending invitation, and the active rosters', () => {
    const html = renderToStaticMarkup(
      <TeamSection
        invitations={INVITATIONS}
        employments={EMPLOYMENTS}
        staff={STAFF}
      />
    );

    expect(html).toContain('Convidar educador por e-mail');
    expect(html).toContain('Convidar recepcionista por e-mail');
    expect(html).toContain('pendente@exemplo.com');
    expect(html).toContain('Ana Souza');
    expect(html).toContain('Beatriz Lima');
    expect(html).toContain('Encerrar vínculo');
    expect(html).toContain('Remover');
  });

  it('shows explicit empty markers with nothing to list', () => {
    const html = renderToStaticMarkup(
      <TeamSection invitations={[]} employments={[]} staff={[]} />
    );

    expect(html).toContain('Nenhum educador com vínculo ativo.');
    expect(html).toContain('Nenhuma recepcionista ativa.');
  });
});
