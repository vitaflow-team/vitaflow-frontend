import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { exerciseFixture } from './exerciseFixture';
import { ExerciseList } from './exerciseList';

const BASE = '/restrict/exercises';

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

function manyExercises(count: number) {
  return Array.from({ length: count }, (_, index) =>
    exerciseFixture({ id: `id-${index}`, name: `Exercício ${index}` })
  );
}

describe('exercise list', () => {
  it('shows name, muscle group, level and equipment per row (US-001.AC-1)', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={[
          exerciseFixture(),
          exerciseFixture({
            id: 'id-2',
            name: 'Push-up',
            muscleGroup: 'Peito',
            difficulty: null,
            equipment: 'BODYWEIGHT',
          }),
        ]}
        filter={{ page: 1 }}
        basePath={BASE}
      />
    );
    const body = text(html);

    expect(html.match(/<li /g)).toHaveLength(2);
    expect(body).toContain('Supino reto');
    expect(body).toContain('Intermediário');
    expect(body).toContain('Academia');
    expect(body).toContain('Push-up');
    expect(body).toContain('Nível não informado');
    expect(body).toContain('Só peso corporal');
    expect(html).toContain(
      `href="${BASE}/0190aaaa-bbbb-7ccc-8ddd-eeeeffff0001"`
    );
  });

  it('offers "Ver vídeo" only on rows that have a video', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={[
          exerciseFixture({ videoUrl: 'https://youtu.be/x' }),
          exerciseFixture({ id: 'id-2', name: 'Sem vídeo' }),
        ]}
        filter={{ page: 1 }}
        basePath={BASE}
      />
    );

    expect(text(html).match(/Ver vídeo/g)).toHaveLength(1);
    expect(html).toContain('href="https://youtu.be/x"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('explains an empty result for a filter (US-002.EC-1, US-011.EC-1)', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={[]}
        filter={{ muscleGroup: 'Peito', equipment: 'BODYWEIGHT', page: 1 }}
        basePath={BASE}
      />
    );

    expect(text(html)).toContain(
      'Nenhum exercício encontrado para este filtro'
    );
    expect(html).not.toContain('<ul');
  });

  it('explains an empty catalog (US-001.EC-1)', () => {
    const html = renderToStaticMarkup(
      <ExerciseList exercises={[]} filter={{ page: 1 }} basePath={BASE} />
    );

    expect(text(html)).toContain('O catálogo de exercícios está sendo montado');
  });

  it('pages through a large catalog, keeping the filters (US-001.EC-3)', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={manyExercises(50)}
        filter={{ muscleGroup: 'Peito', page: 2 }}
        basePath={BASE}
      />
    );

    expect(html).toContain(`href="${BASE}?grupo=Peito"`);
    expect(html).toContain(`href="${BASE}?grupo=Peito&amp;pagina=3"`);
    expect(text(html)).toContain('Página 2');
  });

  it('shows no pagination when everything fits on one page', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={manyExercises(3)}
        filter={{ page: 1 }}
        basePath={BASE}
      />
    );

    expect(html).not.toContain('Paginação');
  });

  it('adds the per-row controls it is given', () => {
    const html = renderToStaticMarkup(
      <ExerciseList
        exercises={[exerciseFixture()]}
        filter={{ page: 1 }}
        basePath={BASE}
        renderActions={exercise => <button>Editar {exercise.name}</button>}
      />
    );

    expect(text(html)).toContain('Editar Supino reto');
  });
});
