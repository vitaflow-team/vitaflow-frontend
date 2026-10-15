import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/turmas/assignTurmaEducator', () => ({
  assignTurmaEducator: {},
}));

import { TurmaEducatorSelect } from './turmaEducatorSelect';

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

function turma(overrides: Partial<TurmaAgendaItem> = {}): TurmaAgendaItem {
  return {
    id: 't1',
    name: 'Spinning',
    weekday: 2,
    startMinute: 600,
    durationMinutes: 60,
    capacity: 10,
    enrolledCount: 3,
    responsibleEducator: null,
    ...overrides,
  };
}

describe('TurmaEducatorSelect — gym-classes US-004, US-010', () => {
  it('shows every currently-employed educator as an option, with the responsible one selected', () => {
    const html = renderToStaticMarkup(
      <TurmaEducatorSelect
        turma={turma({
          responsibleEducator: { id: 'educator-1', name: 'Ana Souza' },
        })}
        employments={EMPLOYMENTS}
      />
    );

    expect(html).toContain('Ana Souza');
    expect(html).toContain('value="educator-1" selected=""');
  });

  it('marks a turma with no responsible educator with "Sem responsável" selected', () => {
    const html = renderToStaticMarkup(
      <TurmaEducatorSelect
        turma={turma({ responsibleEducator: null })}
        employments={EMPLOYMENTS}
      />
    );

    expect(html).toContain('Sem responsável');
    expect(html).toContain('value="" selected=""');
  });
});
