import type { WorkoutList, WorkoutSummary } from '@/_types/educatorWorkouts';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./newWorkoutDialog', () => ({
  NewWorkoutDialog: () => <button type="button">Novo treino</button>,
}));

import { CurrentWorkoutCard } from './currentWorkoutCard';
import { WorkoutsTab } from './workoutsTab';

const ID = 's1';

function summary(
  id: string,
  title: string,
  status: WorkoutSummary['status']
): WorkoutSummary {
  return {
    id,
    title,
    status,
    weeklyFrequency: 4,
    sessionCount: 3,
    exerciseCount: 1,
    updatedAt: '2026-09-20T12:00:00.000Z',
  };
}

function list(overrides: Partial<WorkoutList> = {}): WorkoutList {
  return {
    active: null,
    drafts: [],
    archived: { items: [], total: 0, page: 1, pageSize: 20 },
    ...overrides,
  };
}

function html(value: WorkoutList): string {
  return renderToStaticMarkup(<WorkoutsTab studentId={ID} list={value} />);
}

describe('workouts tab', () => {
  it('UT-083 shows the active workout first, then drafts, then archived, with counts and a new-workout action', () => {
    const output = html(
      list({
        active: summary('w1', 'Hipertrofia', 'ACTIVE'),
        drafts: [summary('w2', 'Rascunho de força', 'DRAFT')],
        archived: {
          items: [summary('w3', 'Treino antigo', 'ARCHIVED')],
          total: 1,
          page: 1,
          pageSize: 20,
        },
      })
    );

    const order = ['Hipertrofia', 'Rascunho de força', 'Treino antigo'].map(
      title => output.indexOf(title)
    );
    expect(order.every(position => position >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(output).toContain('Ativo');
    expect(output).toContain('Rascunho');
    expect(output).toContain('Arquivado');
    expect(output).toContain('3 sessões');
    expect(output).toContain('1 exercício');
    expect(output).toContain('Atualizado em');
    expect(output).toContain('Novo treino');
    expect(output).toContain('href="/restrict/students/s1/workouts/w1"');
  });

  it('UT-084 shows the empty state with "Novo treino" when there is no workout', () => {
    const output = html(list());

    expect(output).toContain('ainda não tem treinos');
    expect(output).toContain('Novo treino');
    expect(output).not.toContain('Treino ativo');
  });

  it('UT-085 says no workout is active when there are only drafts', () => {
    const output = html(list({ drafts: [summary('w2', 'Rascunho', 'DRAFT')] }));

    expect(output).toContain('Nenhum treino ativo');
    expect(output).toContain('Rascunhos');
    expect(output).not.toContain('Arquivados');
  });

  it('UT-086 offers the next page when there are more than twenty archived', () => {
    const items = Array.from({ length: 20 }, (_, index) =>
      summary(`a${index}`, `Antigo ${index}`, 'ARCHIVED')
    );

    const output = html(
      list({ archived: { items, total: 45, page: 1, pageSize: 20 } })
    );

    expect(output).toContain('Página 1 de 3');
    expect(output).toContain(
      'href="/restrict/students/s1/workouts?arquivados=2"'
    );
    expect(output).not.toContain('Mais recentes');
  });

  it('UT-086 offers the way back from the last page and keeps the control past the end', () => {
    const last = html(
      list({
        archived: {
          items: [summary('a1', 'Antigo', 'ARCHIVED')],
          total: 41,
          page: 3,
          pageSize: 20,
        },
      })
    );
    expect(last).toContain('Mais recentes');
    expect(last).toContain('?arquivados=2');
    expect(last).not.toContain('Mais antigos');

    const beyond = html(
      list({ archived: { items: [], total: 41, page: 9, pageSize: 20 } })
    );
    expect(beyond).toContain('Não há treinos arquivados nesta página.');
    expect(beyond).toContain('Página 9 de 3');
    expect(beyond).toContain('Mais recentes');
  });

  it('UT-087 does not depend on whether the student has an account', () => {
    const output = html(list({ drafts: [summary('w2', 'Rascunho', 'DRAFT')] }));

    expect(output).not.toMatch(/conta|account/i);
  });

  it('UT-097 renders a title with markup as visible text', () => {
    const output = html(
      list({
        drafts: [summary('w2', '<img src=x onerror=alert(1)> 💪', 'DRAFT')],
      })
    );

    expect(output).not.toContain('<img');
    expect(output).toContain('&lt;img src=x onerror=alert(1)&gt; 💪');
  });
});

describe('"Treino atual" card', () => {
  const WORKOUT = {
    id: 'w1',
    title: 'Hipertrofia',
    weeklyFrequency: 4,
    sessionNames: ['Peito', 'Costas', 'Pernas'],
  };

  it('UT-119 shows title, weekly frequency, session names and "Ver treinos"', () => {
    const output = renderToStaticMarkup(
      <CurrentWorkoutCard studentId={ID} workout={WORKOUT} />
    );

    expect(output).toContain('Hipertrofia');
    expect(output).toContain('4x por semana');
    expect(output).toContain('Peito, Costas, Pernas');
    expect(output).toContain('Ver treinos');
    expect(output).toContain('href="/restrict/students/s1/workouts"');
  });

  it('UT-120 omits the frequency when unset', () => {
    const output = renderToStaticMarkup(
      <CurrentWorkoutCard
        studentId={ID}
        workout={{ ...WORKOUT, weeklyFrequency: null }}
      />
    );

    expect(output).toContain('Hipertrofia');
    expect(output).not.toContain('por semana');
  });

  it('UT-120 shows the empty state with "Novo treino" when no workout is active', () => {
    const output = renderToStaticMarkup(
      <CurrentWorkoutCard studentId={ID} workout={null} />
    );

    expect(output).toContain('Nenhum treino ativo para este aluno.');
    expect(output).toContain('Novo treino');
    expect(output).not.toContain('Ver treinos');
  });
});
