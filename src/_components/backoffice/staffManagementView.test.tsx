import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { StaffListItem } from '@/_types/backofficeStaff';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/backoffice/inviteStaff', () => ({ inviteStaff: {} }));
vi.mock('@/_actions/backoffice/changeStaffTier', () => ({
  changeStaffTier: {},
}));
vi.mock('@/_actions/backoffice/removeStaff', () => ({ removeStaff: {} }));
vi.mock('@/_actions/backoffice/resendStaffInvitation', () => ({
  resendStaffInvitation: {},
}));

import { StaffManagementView } from './staffManagementView';

const STAFF: StaffListItem[] = [
  {
    id: 's1',
    name: 'Ana Suporte',
    email: 'ana@vitaflow.com',
    tier: 'ADMIN',
    active: true,
    pending: false,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 's2',
    name: 'pendente',
    email: 'pendente@vitaflow.com',
    tier: 'EQUIPE',
    active: false,
    pending: true,
    createdAt: '2026-10-10T00:00:00.000Z',
  },
];

describe('StaffManagementView — platform-admin-access US-007 through US-009', () => {
  it('US-007.EC-2 empty state for a freshly provisioned team', () => {
    const html = renderToStaticMarkup(<StaffManagementView staff={[]} />);

    expect(html).toContain('Nenhum membro da equipe ainda');
    expect(html).toContain('Convidar membro');
  });

  it('shows every staff member, their tier control, and a pending-invite marker', () => {
    const html = renderToStaticMarkup(<StaffManagementView staff={STAFF} />);

    expect(html).toContain('Ana Suporte');
    expect(html).toContain('ana@vitaflow.com');
    expect(html).toContain('pendente@vitaflow.com');
    expect(html).toContain('Convite pendente');
    expect(html).toContain('Remover acesso');
  });
});

describe('StaffManagementView — unified login account UT-044', () => {
  // An existing account that was invited: it is active as an account,
  // and pending only as a staff member.
  const INVITED: StaffListItem = {
    id: 's3',
    name: 'Bia Cliente',
    email: 'bia@example.test',
    tier: 'ADMIN',
    active: true,
    pending: true,
    createdAt: '2026-11-01T00:00:00.000Z',
  };

  it('marks a pending invitation with the tier it offers and lets it be re-sent', () => {
    const html = renderToStaticMarkup(
      <StaffManagementView staff={[INVITED]} />
    );

    expect(html).toContain('Convite pendente · Admin interno');
    expect(html).toContain('Reenviar convite');
    expect(html).toContain('aria-label="Reenviar convite para Bia Cliente"');
    expect(html).toContain('Remover acesso');
  });

  it('offers no tier control for an invitation that was not accepted yet', () => {
    const html = renderToStaticMarkup(
      <StaffManagementView staff={[INVITED]} />
    );

    expect(html).not.toContain('<select');
  });

  it('offers the tier control, and no re-send, for an active member', () => {
    const html = renderToStaticMarkup(
      <StaffManagementView staff={[STAFF[0]]} />
    );

    expect(html).toContain('<select');
    expect(html).not.toContain('Reenviar convite');
    expect(html).not.toContain('Convite pendente');
  });
});
