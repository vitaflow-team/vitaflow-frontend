import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { EducatorAcademiaInvitation } from '@/_types/educatorEmployment';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/educatorEmployment/acceptEmploymentInvitation', () => ({
  acceptEmploymentInvitation: {},
}));
vi.mock('@/_actions/educatorEmployment/declineEmploymentInvitation', () => ({
  declineEmploymentInvitation: {},
}));

import { PendingInvitationsList } from './pendingInvitationsList';

const INVITATIONS: EducatorAcademiaInvitation[] = [
  {
    id: 'i1',
    createdAt: '2026-01-01T00:00:00.000Z',
    academia: { id: 'academia-1', name: 'Academia Vida Ativa' },
  },
  {
    id: 'i2',
    createdAt: '2026-02-01T00:00:00.000Z',
    academia: { id: 'academia-2', name: 'Academia Corpo e Saude' },
  },
];

describe('PendingInvitationsList — gym-educators US-008, US-009, US-010', () => {
  it('shows two invitations from different academias, each with accept/decline', () => {
    const html = renderToStaticMarkup(
      <PendingInvitationsList invitations={INVITATIONS} />
    );

    expect(html).toContain('Academia Vida Ativa');
    expect(html).toContain('Academia Corpo e Saude');
    expect(html.match(/Aceitar/g)).toHaveLength(2);
    expect(html.match(/Recusar/g)).toHaveLength(2);
  });

  it('shows an explicit empty state, never a blank list (US-008.EC-1)', () => {
    const html = renderToStaticMarkup(
      <PendingInvitationsList invitations={[]} />
    );

    expect(html).toContain('Nenhum convite pendente no momento.');
  });
});
