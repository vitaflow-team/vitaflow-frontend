import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { EducatorEmployment } from '@/_types/educatorEmployment';

import { EducatorEmploymentPanel } from './educatorEmploymentPanel';

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

describe('EducatorEmploymentPanel — gym-foundation US-012, gym-educators ADR-004', () => {
  it('lists two simultaneous employers independently (US-010)', () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Academia Vida Ativa');
    expect(html).toContain('Academia Corpo e Saude');
  });

  it('shows an explicit empty marker, never a blank list (US-012.AC-2)', () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel employments={[]} />
    );

    expect(html).toContain('Você não tem nenhum vínculo ativo no momento.');
  });

  it("never renders pending-invitation content — that is the standalone Convites screen's job now", () => {
    const html = renderToStaticMarkup(
      <EducatorEmploymentPanel employments={EMPLOYMENTS} />
    );

    expect(html).not.toContain('Convite');
    expect(html).not.toContain('Aceitar');
    expect(html).not.toContain('Recusar');
  });
});
