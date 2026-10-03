import type { WorkoutEditorState } from '@/_types/workoutEditor';
import type { EditorExercise, EditorSession } from '@/_types/workoutEditor';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./exercisePicker', () => ({
  ExercisePicker: ({
    disabled,
    disabledReason,
  }: {
    disabled: boolean;
    disabledReason?: string;
  }) => (
    <div data-picker-disabled={String(disabled)}>
      {disabled ? disabledReason : 'Adicionar exercício'}
    </div>
  ),
}));

import { ActivationProblems, describeProblem } from './activationProblems';
import { ConflictMarker, conflictLabels } from './conflictMarker';
import { ConflictWarning } from './conflictWarning';
import { EditorFooter } from './editorFooter';
import { ExerciseFields, videoIndication } from './exerciseFields';
import { ExerciseRow } from './exerciseRow';
import { LibrarySearchResults } from './librarySearchResults';
import { LifecycleActions } from './lifecycleActions';
import { SessionPanel } from './sessionPanel';
import { SessionSwitch } from './sessionSwitch';

function exercise(overrides: Partial<EditorExercise> = {}): EditorExercise {
  return {
    key: 'x1',
    id: 'x1',
    source: 'FREE',
    exerciseId: null,
    name: 'Flexão',
    muscleGroup: 'Peito',
    equipment: null,
    sets: '3',
    reps: '12',
    load: '',
    videoUrl: '',
    libraryVideoUrl: null,
    conflicts: [],
    ...overrides,
  };
}

function session(
  key: string,
  name: string,
  exercises: EditorExercise[] = []
): EditorSession {
  return { key, id: key, name, exercises };
}

const noop = () => {};

describe('session switch', () => {
  it('UT-091 labels the tabs A, B, C by position', () => {
    const html = renderToStaticMarkup(
      <SessionSwitch
        sessions={[session('a', 'Peito'), session('b', 'Costas')]}
        activeKey="a"
        canAdd
        onSelect={noop}
        onAdd={noop}
      />
    );

    expect(html.match(/role="tab"/g)).toHaveLength(2);
    expect(html).toContain('Sessão A:');
    expect(html).toContain('Sessão B:');
    expect(html).toContain('aria-selected="true"');
    expect(html).not.toContain('disabled=""');
  });

  it('UT-091 disables adding the eighth session and says why', () => {
    const html = renderToStaticMarkup(
      <SessionSwitch
        sessions={[session('a', 'Peito')]}
        activeKey="a"
        canAdd={false}
        onSelect={noop}
        onAdd={noop}
      />
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('no máximo 7 sessões (A a G)');
    expect(html).toContain('aria-describedby="sessions-limit"');
  });

  it('shows a placeholder for a session that has no name yet', () => {
    const html = renderToStaticMarkup(
      <SessionSwitch
        sessions={[session('a', '')]}
        activeKey="a"
        canAdd
        onSelect={noop}
        onAdd={noop}
      />
    );

    expect(html).toContain('Sem nome');
  });
});

describe('session panel', () => {
  function panel(exercises: EditorExercise[], errors = {}) {
    return renderToStaticMarkup(
      <SessionPanel
        studentId="s1"
        session={session('a', 'Peito', exercises)}
        position={0}
        total={1}
        errors={errors}
        dispatch={noop}
      />
    );
  }

  it('UT-093 disables the add control of a session with thirty exercises and explains', () => {
    const thirty = Array.from({ length: 30 }, (_, index) =>
      exercise({ key: `e${index}`, id: `e${index}` })
    );

    const html = panel(thirty);

    expect(html).toContain('data-picker-disabled="true"');
    expect(html).toContain('no máximo 30 exercícios');
  });

  it('keeps the add control enabled below thirty', () => {
    const html = panel([exercise()]);

    expect(html).toContain('data-picker-disabled="false"');
  });

  it('shows the empty state of a session without exercises', () => {
    const html = panel([]);

    expect(html).toContain('Nenhum exercício nesta sessão ainda.');
  });

  it('UT-092 shows the name and exercises messages next to the session', () => {
    const html = panel([], {
      'sessions.0.name': 'O nome da sessão é obrigatório.',
      'sessions.0.exercises': 'Uma sessão pode ter no máximo 30 exercícios.',
    });

    expect(html).toContain('O nome da sessão é obrigatório.');
    expect(html).toContain('Uma sessão pode ter no máximo 30 exercícios.');
    expect(html).toContain('aria-invalid="true"');
  });

  it('UT-099 offers the removal of the session behind a confirmation', () => {
    const html = panel([exercise()]);

    expect(html).toContain('Remover sessão');
    expect(html).not.toContain('As sessões seguintes passam a usar');
  });
});

describe('exercise row', () => {
  function row(value: EditorExercise, errors = {}) {
    return renderToStaticMarkup(
      <ExerciseRow
        sessionKey="a"
        exercise={value}
        index={0}
        total={2}
        path="sessions.0.exercises.0"
        errors={errors}
        dispatch={noop}
      />
    );
  }

  it('UT-097 renders names, loads and repetitions with markup as visible text', () => {
    const html = row(
      exercise({
        name: '<img src=x onerror=alert(1)>',
        reps: '<b>10</b>',
        load: '<script>x()</script>',
      })
    );

    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&lt;b&gt;10&lt;/b&gt;');
  });

  it('UT-098 offers up, down and remove, with the first row unable to go up', () => {
    const html = row(exercise());

    expect(html).toContain('aria-label="Mover Flexão para cima"');
    expect(html).toContain('aria-label="Mover Flexão para baixo"');
    expect(html).toContain('aria-label="Remover Flexão"');
    expect(html).toMatch(/disabled=""[^>]*aria-label="Mover Flexão para cima"/);
  });

  it('UT-108 marks a conflicting exercise with words and none otherwise', () => {
    const marked = row(exercise({ conflicts: ['KNEE', 'SPINE'] }));
    const clean = row(exercise({ conflicts: [] }));

    expect(marked).toContain('Atenção: restrição do aluno — Joelho e Coluna');
    expect(clean).not.toContain('Atenção');
  });

  it('UT-110 shows the series, repetitions, load and link messages beside their fields', () => {
    const html = row(exercise(), {
      'sessions.0.exercises.0.sets': 'Séries deve ser de 1 a 20.',
      'sessions.0.exercises.0.reps': 'Informe as repetições.',
      'sessions.0.exercises.0.load':
        'A carga deve ter no máximo 30 caracteres.',
      'sessions.0.exercises.0.videoUrl':
        'Use um link http ou https, sem espaços.',
    });

    for (const message of [
      'Séries deve ser de 1 a 20.',
      'Informe as repetições.',
      'A carga deve ter no máximo 30 caracteres.',
      'Use um link http ou https, sem espaços.',
    ]) {
      expect(html).toContain(message);
    }
    expect(html.match(/aria-invalid="true"/g)).toHaveLength(4);
  });
});

describe('video indication', () => {
  it('UT-111 says which video the student will get', () => {
    expect(videoIndication(exercise({ videoUrl: 'https://x.com/v' }))).toBe(
      'O aluno verá o seu link.'
    );
    expect(
      videoIndication(exercise({ libraryVideoUrl: 'https://x.com/lib' }))
    ).toBe('Sem link seu, o aluno verá o vídeo da biblioteca.');
    expect(videoIndication(exercise())).toBe(
      'Sem vídeo: o aluno não verá o botão de vídeo.'
    );
  });

  it('shows the indication as the hint of the link field', () => {
    const html = renderToStaticMarkup(
      <ExerciseFields
        sessionKey="a"
        exercise={exercise({ libraryVideoUrl: 'https://x.com/lib' })}
        errors={{}}
        path="sessions.0.exercises.0"
        dispatch={noop}
      />
    );

    expect(html).toContain('Sem link seu, o aluno verá o vídeo da biblioteca.');
  });
});

describe('conflict display', () => {
  it('names one, two or three restrictions in words', () => {
    expect(conflictLabels(['KNEE'])).toBe('Joelho');
    expect(conflictLabels(['KNEE', 'SPINE'])).toBe('Joelho e Coluna');
    expect(conflictLabels(['KNEE', 'SPINE', 'HIP'])).toBe(
      'Joelho, Coluna e Quadril'
    );
  });

  it('UT-108 shows no marker without conflicts', () => {
    expect(renderToStaticMarkup(<ConflictMarker conflicts={[]} />)).toBe('');
  });

  it('UT-107 warns naming the exercise and the restriction, and lets it stay', () => {
    const html = renderToStaticMarkup(
      <ConflictWarning
        exerciseName="Agachamento"
        conflicts={['KNEE']}
        onDismiss={noop}
      />
    );

    expect(html).toContain('Agachamento pode não ser indicado');
    expect(html).toContain('restrição em Joelho');
    expect(html).toContain('Você pode mantê-lo no treino.');
    expect(html).toContain('role="alert"');
  });
});

describe('library search results', () => {
  const LIBRARY = {
    id: 'lib1',
    name: 'Supino reto',
    muscleGroup: 'Peito',
    equipment: 'GYM',
  } as never;

  function results(state: Parameters<typeof LibrarySearchResults>[0]['state']) {
    return renderToStaticMarkup(
      <LibrarySearchResults
        state={state}
        query="supino"
        disabled={false}
        onPick={noop}
        onUseName={noop}
      />
    );
  }

  it('UT-101 lists approved matches with an add button each', () => {
    const html = results({ kind: 'results', exercises: [LIBRARY] });

    expect(html).toContain('Supino reto');
    expect(html).toContain('Peito · Academia');
    expect(html).toContain('aria-label="Adicionar Supino reto"');
  });

  it('UT-102 offers to add by name when nothing matches', () => {
    const html = results({ kind: 'results', exercises: [] });

    expect(html).toContain('Nenhum exercício encontrado para “supino”.');
    expect(html).toContain('Adicionar “supino” pelo nome');
  });

  it('UT-104 shows the failure and keeps the free-name path open', () => {
    const html = results({ kind: 'error', message: 'Falha na busca.' });

    expect(html).toContain('Falha na busca.');
    expect(html).toContain('Você ainda pode adicionar o exercício pelo nome.');
  });

  it('shows nothing while idle and a status while loading', () => {
    expect(results({ kind: 'idle' })).toBe('');
    expect(results({ kind: 'loading' })).toContain('Buscando…');
  });
});

describe('save bar', () => {
  it('UT-094 disables the save button while saving', () => {
    const saving = renderToStaticMarkup(
      <EditorFooter isSaving isDirty saveError={null} onSave={noop} />
    );
    const idle = renderToStaticMarkup(
      <EditorFooter isSaving={false} isDirty saveError={null} onSave={noop} />
    );

    expect(saving).toContain('disabled=""');
    expect(saving).toContain('Salvando…');
    expect(idle).not.toContain('disabled=""');
    expect(idle).toContain('Há alterações não salvas.');
  });

  it('UT-095 shows the failure of a save', () => {
    const html = renderToStaticMarkup(
      <EditorFooter
        isSaving={false}
        isDirty
        saveError="Não foi possível salvar."
        onSave={noop}
      />
    );

    expect(html).toContain('Não foi possível salvar.');
    expect(html).toContain('role="alert"');
  });
});

describe('lifecycle actions', () => {
  function actions(
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
    extra: Partial<Parameters<typeof LifecycleActions>[0]> = {}
  ) {
    return renderToStaticMarkup(
      <LifecycleActions
        title="Hipertrofia"
        status={status}
        isDirty={false}
        isPending={false}
        error={null}
        problems={[]}
        onActivate={noop}
        onDeactivate={noop}
        onDelete={noop}
        {...extra}
      />
    );
  }

  it('UT-113 offers "Desativar" for the active workout and never "Ativar"', () => {
    const html = actions('ACTIVE');

    expect(html).toContain('Desativar');
    expect(html).not.toContain('Ativar<');
    expect(html).not.toContain('Excluir');
  });

  it('UT-113 offers "Ativar" for an archived workout, and for a draft', () => {
    for (const status of ['ARCHIVED', 'DRAFT'] as const) {
      const html = actions(status);

      expect(html).toContain('Ativar');
      expect(html).not.toContain('Desativar');
    }
  });

  it('UT-114 offers deleting only for drafts and archived', () => {
    expect(actions('DRAFT')).toContain('Excluir');
    expect(actions('ARCHIVED')).toContain('Excluir');
    expect(actions('ACTIVE')).not.toContain('Excluir');
  });

  it('asks to save before activating a workout with unsaved changes', () => {
    const html = actions('DRAFT', { isDirty: true });

    expect(html).toContain('Salve as alterações antes de ativar o treino.');
    expect(html).toContain('disabled=""');
  });

  it('UT-112 names the sessions that stop the activation', () => {
    const html = actions('DRAFT', {
      problems: [
        { code: 'empty_session', sessionLabel: 'B', sessionName: 'Costas' },
      ],
    });

    expect(html).toContain('Não foi possível ativar o treino.');
    expect(html).toContain('Sessão B — Costas está sem exercícios.');
  });

  it('UT-115 shows the failure of a lifecycle change', () => {
    const html = actions('DRAFT', { error: 'Algo deu errado.' });

    expect(html).toContain('Algo deu errado.');
  });

  it('disables every action while one is running', () => {
    const html = actions('DRAFT', { isPending: true });

    expect(html.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(2);
  });
});

describe('activation problems', () => {
  it('describes each kind of problem', () => {
    expect(describeProblem({ code: 'no_sessions' })).toBe(
      'O treino não tem nenhuma sessão.'
    );
    expect(describeProblem({ code: 'empty_session', sessionLabel: 'C' })).toBe(
      'Sessão C está sem exercícios.'
    );
  });

  it('renders nothing without problems', () => {
    expect(renderToStaticMarkup(<ActivationProblems problems={[]} />)).toBe('');
  });
});

// Keeps the helper type referenced for editors that tree-shake unused imports.
export type _EditorState = WorkoutEditorState;
