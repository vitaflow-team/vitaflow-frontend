import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/exercises/createExercise', () => ({
  createExercise: vi.fn(),
}));
vi.mock('@/_actions/exercises/submitExercise', () => ({
  submitExercise: vi.fn(),
}));
vi.mock('@/_actions/exercises/updateExercise', () => ({
  updateExercise: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

import { ExerciseFilters } from './exerciseFilters';
import { ExerciseForm } from './exerciseForm';
import { ExerciseLibraryHeader } from './exerciseLibraryHeader';

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('exercise filters', () => {
  it('offers search, muscle group and equipment together (US-011)', () => {
    const html = renderToStaticMarkup(
      <ExerciseFilters
        filter={{
          q: 'supino',
          muscleGroup: 'Peito',
          equipment: 'BODYWEIGHT',
          page: 1,
        }}
        basePath="/restrict/exercises"
      />
    );

    expect(html).toContain('role="search"');
    expect(html).toContain('value="supino"');
    expect(html).toMatch(/<option value="Peito" selected="">Peito<\/option>/);
    expect(html).toMatch(
      /<option value="BODYWEIGHT" selected="">Só peso corporal<\/option>/
    );
    expect(text(html)).toContain('Todos os grupos');
    expect(text(html)).toContain('Todos os equipamentos');
    expect(html).not.toMatch(/<button[^>]*disabled=""[^>]*>Limpar filtros/);
  });

  it('disables "Limpar filtros" when nothing is filtered', () => {
    const html = renderToStaticMarkup(
      <ExerciseFilters filter={{ page: 1 }} basePath="/restrict/exercises" />
    );

    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Limpar filtros/);
  });

  it('is the only client boundary of the library page', () => {
    const read = (file: string) =>
      readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8');

    expect(read('./exerciseFilters.tsx')).toContain("'use client'");
    for (const file of [
      './exerciseList.tsx',
      './exerciseListItem.tsx',
      './exerciseDetail.tsx',
      './exerciseEmptyState.tsx',
      './pendingQueue.tsx',
      './submissionList.tsx',
    ]) {
      expect(read(file)).not.toContain("'use client'");
    }
  });
});

describe('exercise form', () => {
  it('marks the four required fields and the optional ones', () => {
    const body = text(
      renderToStaticMarkup(<ExerciseForm mode={{ kind: 'submit' }} />)
    );

    for (const label of [
      'Nome *',
      'Grupo muscular *',
      'Equipamento *',
      'Descrição *',
    ]) {
      expect(body).toContain(label);
    }
    expect(body).toContain('Nível');
    expect(body).toContain('Link do vídeo');
    expect(body).toContain('Contraindicações (opcional)');
    expect(body).toContain('Enviar para revisão');
  });

  it('names the save button after who is saving', () => {
    expect(
      text(renderToStaticMarkup(<ExerciseForm mode={{ kind: 'create' }} />))
    ).toContain('Publicar exercício');
    expect(
      text(
        renderToStaticMarkup(<ExerciseForm mode={{ kind: 'edit', id: 'x' }} />)
      )
    ).toContain('Salvar alterações');
  });

  it('starts an edit with the stored values', () => {
    const html = renderToStaticMarkup(
      <ExerciseForm
        mode={{ kind: 'edit', id: 'x' }}
        defaultValues={{
          name: 'Bench Press',
          description: 'Push the bar.',
          muscleGroup: 'Peito',
          equipment: 'GYM',
          contraindications: ['KNEE'],
          difficulty: '',
          imageUrl: '',
          videoUrl: '',
        }}
      />
    );

    expect(html).toContain('value="Bench Press"');
    expect(html).toContain('Push the bar.');
    expect(html).toMatch(/<option value="GYM" selected="">Academia<\/option>/);
    expect(html).toMatch(
      /<button(?=[^>]*id="contraindication-KNEE")(?=[^>]*aria-checked="true")/
    );
  });
});

describe('exercise library header', () => {
  it('shows each shortcut only to who can use it', () => {
    const everyone = text(
      renderToStaticMarkup(
        <ExerciseLibraryHeader canSubmit={false} canManage={false} />
      )
    );
    expect(everyone).not.toContain('Sugerir exercício');
    expect(everyone).not.toContain('Gerenciar catálogo');

    const staffEducator = renderToStaticMarkup(
      <ExerciseLibraryHeader canSubmit canManage />
    );
    expect(staffEducator).toContain('href="/restrict/exercises/submissions"');
    expect(staffEducator).toContain('href="/restrict/backoffice/exercises"');
  });
});
