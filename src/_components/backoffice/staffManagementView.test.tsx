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

import { StaffManagementView } from './staffManagementView';

const STAFF: StaffListItem[] = [
  {
    id: 's1',
    name: 'Ana Suporte',
    email: 'ana@vitaflow.com',
    tier: 'ADMIN',
    active: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 's2',
    name: 'pendente',
    email: 'pendente@vitaflow.com',
    tier: 'EQUIPE',
    active: false,
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
