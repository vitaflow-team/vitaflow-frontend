import type {
  StudentEducatorWorkout,
  StudentWorkoutExercise,
} from '@/_types/educatorWorkouts';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EducatorWorkoutView } from './educatorWorkoutView';

function exercise(
  overrides: Partial<StudentWorkoutExercise> = {}
): StudentWorkoutExercise {
  return {
    name: 'Supino reto',
    muscleGroup: 'Peito',
    sets: 4,
    reps: '8-10',
    load: '40 kg',
    videoUrl: 'https://example.com/supino',
    ...overrides,
  };
}

function item(
  sessions: StudentEducatorWorkout['workout']['sessions'],
  weeklyFrequency: number | null = 4
): StudentEducatorWorkout {
  return {
    educator: { id: 'e1', name: 'Thiago Ramos' },
    workout: {
      id: 'w1',
      title: 'Hipertrofia',
      weeklyFrequency,
      updatedAt: '2026-10-01T10:00:00.000Z',
      sessions,
    },
  };
}

function session(label: string, name: string, exercises = [exercise()]) {
  return { id: `s-${label}`, label, name, exercises };
}

function html(value: StudentEducatorWorkout): string {
  return renderToStaticMarkup(<EducatorWorkoutView item={value} />);
}

describe('educator workout view', () => {
  it('UT-123 shows title, educator, sessions with names and each exercise with series, repetitions and load', () => {
    const output = html(
      item([
        session('A', 'Peito'),
        session('B', 'Costas', [exercise({ name: 'Remada' })]),
      ])
    );

    expect(output).toContain('Hipertrofia');
    expect(output).toContain('Treino de Thiago Ramos');
    expect(output).toContain('4x por semana');
    expect(output).toContain('Sessão A — Peito');
    expect(output).toContain('Sessão B — Costas');
    expect(output).toContain('Supino reto');
    expect(output).toContain('4 × 8-10');
    expect(output).toContain('Carga: 40 kg');
  });

  it('UT-123 omits a missing load, a missing video and an unset frequency', () => {
    const output = html(
      item(
        [session('A', 'Peito', [exercise({ load: null, videoUrl: null })])],
        null
      )
    );

    expect(output).not.toContain('Carga');
    expect(output).not.toContain('Ver vídeo');
    expect(output).not.toContain('por semana');
  });

  it('UT-123 has no edit control, no conflict marker and no AI disclaimer', () => {
    const output = html(item([session('A', 'Peito')]));

    expect(output).not.toMatch(/<button|<input|<textarea|<select/);
    expect(output).not.toMatch(/Editar|Remover|Excluir|Salvar/);
    expect(output).not.toMatch(/restrição|Atenção/);
    expect(output).not.toMatch(
      /gerado por IA|inteligência artificial|não substitui/i
    );
  });

  it('UT-124 opens "Ver vídeo" in a new tab, isolated from this page', () => {
    const output = html(item([session('A', 'Peito')]));

    expect(output).toMatch(
      /<a href="https:\/\/example\.com\/supino" target="_blank" rel="noopener noreferrer"/
    );
    expect(output).toContain('Ver vídeo');
    expect(output).toContain('abre em outra aba');
  });

  it('UT-124 never renders a link that is not http or https', () => {
    const output = html(
      item([
        session('A', 'Peito', [
          exercise({ videoUrl: 'javascript:alert(1)' }),
          exercise({ name: 'Outro', videoUrl: 'data:text/html,x' }),
        ]),
      ])
    );

    expect(output).not.toContain('javascript:');
    expect(output).not.toContain('data:text');
    expect(output).not.toContain('Ver vídeo');
  });

  it('UT-097 renders names with markup as visible text', () => {
    const output = html(
      item([
        session('A', '<b>Peito</b>', [
          exercise({ name: '<img src=x onerror=alert(1)>', reps: '<i>10</i>' }),
        ]),
      ])
    );

    expect(output).not.toContain('<img');
    expect(output).not.toContain('<b>Peito');
    expect(output).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('UT-126 renders seven sessions of thirty exercises with every session reachable', () => {
    const labels = 'ABCDEFG'.split('');
    const sessions = labels.map(label =>
      session(
        label,
        `Sessão número ${label}`,
        Array.from({ length: 30 }, (_, index) =>
          exercise({ name: `Exercício ${label}${index + 1}` })
        )
      )
    );

    const output = html(item(sessions));

    expect(output.match(/<li /g)).toHaveLength(210);
    for (const label of labels) {
      expect(output).toContain(`id="sessao-${label.toLowerCase()}"`);
      expect(output).toContain(`href="#sessao-${label.toLowerCase()}"`);
    }
  });

  it('offers no session navigation for a single session', () => {
    const output = html(item([session('A', 'Peito')]));

    expect(output).not.toContain('href="#sessao-a"');
    expect(output).toContain('id="sessao-a"');
  });
});
