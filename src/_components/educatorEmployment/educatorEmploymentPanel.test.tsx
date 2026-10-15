import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type {
  EducatorAcademiaInvitation,
  EducatorEmployment,
} from '@/_types/educatorEmployment';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/educatorEmployment/acceptEmploymentInvitation', () => ({
  acceptEmploymentInvitation: {},
}));
vi.mock('@/_actions/educatorEmployment/declineEmploymentInvitation', () => ({
  declineEmploymentInvitation: {},
}));

import { EducatorEmploymentPanel } from './educatorEmploymentPanel';

const INVITATION: EducatorAcademiaInvitation = {
  id: 'i1',
  createdAt: '2026-01-01T00:00:00.000Z',
  academia: { id: 'academia-1', name: 'Academia Vida Ativa' },
};

const EMPLOYMENTS: EducatorEmployment[] = [
  {
    id: 'e1',
    academiaId: 'academia-1',
    startedAt: '2026-01-01T00:00:00.000Z',
    academia: { id: 'academia-1', name: 'Academia Vida Ativa' },
  },
  {
    id: 'e2',
    academiaId: 'academia-2',
    startedAt: '2026-02-01T00:00:00.000Z',
    academia: { id: 'academia-2', name: 'Academia Corpo e Saude' },
  },
];

describe('EducatorEmploymentPanel — gym-foundation US-007, US-008, US-010, US-012', () => {
  it('shows a pending invitation with accept/decline actions', () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel invitations={[INVITATION]} employments={[]} />
    );

    expect(html).toContain('Academia Vida Ativa');
    expect(html).toContain('Aceitar');
    expect(html).toContain('Recusar');
  });

  it('lists two simultaneous employers independently (US-010)', () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel invitations={[]} employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Academia Vida Ativa');
    expect(html).toContain('Academia Corpo e Saude');
  });

  it('shows explicit empty markers, never a blank list (US-012.AC-2)', () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel invitations={[]} employments={[]} />
    );

    expect(html).toContain('Nenhum convite pendente no momento.');
    expect(html).toContain('Você não tem nenhum vínculo ativo no momento.');
  });
});
