import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { EducatorEmployment } from '@/_types/educatorEmployment';
import { StudentOwnershipField } from './studentOwnershipField';

const noop = () => {};

function employment(academiaId: string, name: string): EducatorEmployment {
  return {
    id: academiaId,
    academiaId,
    startedAt: '2026-01-01T00:00:00.000Z',
    academia: { id: academiaId, name },
  };
}

describe('StudentOwnershipField — gym-foundation US-013', () => {
  it('renders nothing with zero active employments (US-013.EC-1)', () => {
    const html = renderToStaticMarkup(
      <StudentOwnershipField
        employments={[]}
        ownership="PARTICULAR"
        academiaId={null}
        disabled={false}
        onOwnershipChange={noop}
        onAcademiaChange={noop}
      />
    );

    expect(html).toBe('');
  });

  it('offers the particular/academia choice with exactly one employment, no picker', () => {
    const html = renderToStaticMarkup(
      <StudentOwnershipField
        employments={[employment('academia-1', 'Academia Vida Ativa')]}
        ownership="PARTICULAR"
        academiaId={null}
        disabled={false}
        onOwnershipChange={noop}
        onAcademiaChange={noop}
      />
    );

    expect(html).toContain('Particular');
    expect(html).toContain('Da academia');
    expect(html).not.toContain('Selecione a academia');
  });

  it('shows the academia picker only with more than one employment and "Da academia" selected', () => {
    const employments = [
      employment('academia-1', 'Academia Vida Ativa'),
      employment('academia-2', 'Academia Corpo e Saude'),
    ];

    const particular = renderToStaticMarkup(
      <StudentOwnershipField
        employments={employments}
        ownership="PARTICULAR"
        academiaId={null}
        disabled={false}
        onOwnershipChange={noop}
        onAcademiaChange={noop}
      />
    );
    expect(particular).not.toContain('Selecione a academia');

    const academia = renderToStaticMarkup(
      <StudentOwnershipField
        employments={employments}
        ownership="ACADEMIA"
        academiaId={null}
        disabled={false}
        onOwnershipChange={noop}
        onAcademiaChange={noop}
      />
    );
    expect(academia).toContain('Selecione a academia');
    expect(academia).toContain('Academia Vida Ativa');
    expect(academia).toContain('Academia Corpo e Saude');
  });
});
