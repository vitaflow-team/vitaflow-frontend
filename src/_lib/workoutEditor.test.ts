import type { WorkoutTree } from '@/_types/educatorWorkouts';
import type { Exercise } from '@/_types/exercise';
import type { WorkoutEditorState } from '@/_types/workoutEditor';
import { describe, expect, it } from 'vitest';
import {
  ACTIVE_RULE_MESSAGE,
  BLANK_SESSION_KEY,
  activeRuleViolation,
  breaksActiveRule,
  canAddExercise,
  canAddSession,
  exerciseFromLibrary,
  exerciseFromName,
  initialEditorState,
  isEditorDirty,
  sessionLabel,
  snapshotOf,
  treeToEditor,
  validateEditor,
  workoutEditorReducer as reduce,
} from './workoutEditor';

const TREE: WorkoutTree = {
  id: 'w1',
  title: 'Hipertrofia',
  status: 'DRAFT',
  weeklyFrequency: 4,
  updatedAt: '2026-10-01T10:00:00.000Z',
  sessions: [
    {
      id: 's1',
      label: 'A',
      name: 'Peito',
      exercises: [
        {
          id: 'x1',
          source: 'LIBRARY',
          exerciseId: 'lib1',
          name: 'Supino',
          muscleGroup: 'Peito',
          equipment: 'GYM',
          sets: 4,
          reps: '8-10',
          load: '40 kg',
          videoUrl: null,
          libraryVideoUrl: 'https://example.com/supino',
          conflicts: ['SHOULDER'],
        },
        {
          id: 'x2',
          source: 'FREE',
          exerciseId: null,
          name: 'Flexão',
          muscleGroup: 'Peito',
          equipment: null,
          sets: 3,
          reps: '12',
          load: null,
          videoUrl: 'https://example.com/flexao',
          libraryVideoUrl: null,
          conflicts: [],
        },
      ],
    },
    { id: 's2', label: 'B', name: 'Costas', exercises: [] },
  ],
};

const LIBRARY: Exercise = {
  id: 'lib2',
  name: 'Remada',
  muscleGroup: 'Costas',
  equipment: 'GYM',
  videoUrl: null,
} as Exercise;

function editor(): WorkoutEditorState {
  return treeToEditor(TREE);
}

describe('working copy of a saved workout', () => {
  it('turns every number into text and keeps the saved ids as keys', () => {
    const state = editor();

    expect(state.weeklyFrequency).toBe('4');
    expect(state.sessions[0].key).toBe('s1');
    expect(state.sessions[0].exercises[0]).toMatchObject({
      key: 'x1',
      id: 'x1',
      sets: '4',
      load: '40 kg',
      videoUrl: '',
      libraryVideoUrl: 'https://example.com/supino',
    });
    expect(state.sessions[0].exercises[1].load).toBe('');
  });

  it('UT-111 keeps the library video apart from the educator link', () => {
    const [library, free] = editor().sessions[0].exercises;

    expect(library.videoUrl).toBe('');
    expect(library.libraryVideoUrl).toBe('https://example.com/supino');
    expect(free.videoUrl).toBe('https://example.com/flexao');
    expect(free.libraryVideoUrl).toBeNull();
  });

  it('leaves the frequency empty when none is set', () => {
    const state = treeToEditor({ ...TREE, weeklyFrequency: null });

    expect(state.weeklyFrequency).toBe('');
  });
});

describe('new exercises', () => {
  it('UT-101 takes name and muscle group from the library exercise', () => {
    const added = exerciseFromLibrary(LIBRARY, 'k1', ['KNEE']);

    expect(added).toMatchObject({
      key: 'k1',
      source: 'LIBRARY',
      exerciseId: 'lib2',
      name: 'Remada',
      muscleGroup: 'Costas',
      conflicts: ['KNEE'],
    });
    expect(added.id).toBeUndefined();
  });

  it('adds a free exercise with a trimmed name and no conflicts', () => {
    const added = exerciseFromName(
      { name: ' Barra fixa ', muscleGroup: 'Costas', equipment: null },
      'k2'
    );

    expect(added).toMatchObject({
      source: 'FREE',
      exerciseId: null,
      name: 'Barra fixa',
      conflicts: [],
    });
  });
});

describe('session labels and limits', () => {
  it('UT-091 labels sessions A to G by position and stops at seven', () => {
    expect([0, 1, 2, 6].map(sessionLabel)).toEqual(['A', 'B', 'C', 'G']);

    let state = editor();
    for (let index = 0; index < 5; index += 1) {
      state = reduce(state, { type: 'add-session', key: `n${index}` });
    }
    expect(state.sessions).toHaveLength(7);
    expect(canAddSession(state)).toBe(false);

    const refused = reduce(state, { type: 'add-session', key: 'extra' });
    expect(refused).toBe(state);
  });

  it('UT-093 stops adding at thirty exercises in a session', () => {
    let state = editor();
    for (let index = 0; index < 40; index += 1) {
      state = reduce(state, {
        type: 'add-exercise',
        sessionKey: 's2',
        exercise: exerciseFromLibrary(LIBRARY, `e${index}`),
      });
    }

    expect(state.sessions[1].exercises).toHaveLength(30);
    expect(canAddExercise(state.sessions[1])).toBe(false);
  });
});

describe('editing the working copy', () => {
  it('UT-106 allows the same library exercise twice', () => {
    let state = editor();
    for (const key of ['a', 'b']) {
      state = reduce(state, {
        type: 'add-exercise',
        sessionKey: 's2',
        exercise: exerciseFromLibrary(LIBRARY, key),
      });
    }

    const ids = state.sessions[1].exercises.map(e => e.exerciseId);
    expect(ids).toEqual(['lib2', 'lib2']);
  });

  it('UT-098 moving a session relabels it and keeps the others in order', () => {
    const moved = reduce(editor(), {
      type: 'move-session',
      sessionKey: 's2',
      direction: -1,
    });

    expect(moved.sessions.map(s => s.key)).toEqual(['s2', 's1']);
    expect(moved.sessions.map((_, index) => sessionLabel(index))).toEqual([
      'A',
      'B',
    ]);
  });

  it('does not move the first session up or the last down', () => {
    const state = editor();

    const up = reduce(state, {
      type: 'move-session',
      sessionKey: 's1',
      direction: -1,
    });
    const down = reduce(state, {
      type: 'move-session',
      sessionKey: 's2',
      direction: 1,
    });

    expect(up.sessions.map(s => s.key)).toEqual(['s1', 's2']);
    expect(down.sessions.map(s => s.key)).toEqual(['s1', 's2']);
  });

  it('UT-098 moves and removes exercises, keeping the order of the rest', () => {
    const moved = reduce(editor(), {
      type: 'move-exercise',
      sessionKey: 's1',
      exerciseKey: 'x2',
      direction: -1,
    });
    expect(moved.sessions[0].exercises.map(e => e.key)).toEqual(['x2', 'x1']);

    const removed = reduce(moved, {
      type: 'remove-exercise',
      sessionKey: 's1',
      exerciseKey: 'x2',
    });
    expect(removed.sessions[0].exercises.map(e => e.key)).toEqual(['x1']);
  });

  it('UT-098 removing a session relabels the ones after it', () => {
    const removed = reduce(editor(), {
      type: 'remove-session',
      sessionKey: 's1',
    });

    expect(removed.sessions.map(s => s.key)).toEqual(['s2']);
    expect(sessionLabel(0)).toBe('A');
  });

  it('removing an exercise that is already gone changes nothing', () => {
    const removed = reduce(editor(), {
      type: 'remove-exercise',
      sessionKey: 's1',
      exerciseKey: 'missing',
    });

    expect(removed.sessions[0].exercises).toHaveLength(2);
  });

  it('updates one field of one exercise and leaves the rest alone', () => {
    const updated = reduce(editor(), {
      type: 'update-exercise',
      sessionKey: 's1',
      exerciseKey: 'x1',
      field: 'sets',
      value: '5',
    });

    expect(updated.sessions[0].exercises[0].sets).toBe('5');
    expect(updated.sessions[0].exercises[1].sets).toBe('3');
  });

  it('sets the title and the frequency as typed', () => {
    const titled = reduce(editor(), { type: 'set-title', value: 'Novo' });
    const framed = reduce(titled, { type: 'set-frequency', value: '9' });

    expect(framed).toMatchObject({ title: 'Novo', weeklyFrequency: '9' });
  });
});

describe('the active workout rule', () => {
  it('UT-099 refuses a copy with no session or with an empty session', () => {
    expect(activeRuleViolation({ ...editor(), sessions: [] })).toBe(
      ACTIVE_RULE_MESSAGE
    );
    expect(activeRuleViolation(editor())).toBe(ACTIVE_RULE_MESSAGE);
  });

  it('accepts a copy where every session has an exercise', () => {
    const state = reduce(editor(), {
      type: 'remove-session',
      sessionKey: 's2',
    });

    expect(activeRuleViolation(state)).toBeNull();
  });
});

describe('validating the working copy', () => {
  it('UT-092 reports blank title, blank session name and bad frequency by path', () => {
    const state = reduce(
      reduce(reduce(editor(), { type: 'set-title', value: '  ' }), {
        type: 'set-frequency',
        value: '8',
      }),
      { type: 'rename-session', sessionKey: 's1', name: '' }
    );

    const result = validateEditor(state);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining(['title', 'weeklyFrequency', 'sessions.0.name'])
    );
  });

  it('UT-110 reports series, repetitions, load and link problems at the exercise', () => {
    let state = editor();
    const fields = [
      ['sets', '0'],
      ['reps', ''],
      ['load', 'x'.repeat(31)],
      ['videoUrl', 'javascript:alert(1)'],
    ] as const;
    for (const [field, value] of fields) {
      state = reduce(state, {
        type: 'update-exercise',
        sessionKey: 's1',
        exerciseKey: 'x2',
        field,
        value,
      });
    }

    const result = validateEditor(state);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    for (const field of ['sets', 'reps', 'load', 'videoUrl']) {
      expect(result.errors[`sessions.0.exercises.1.${field}`]).toBeTruthy();
    }
  });

  it('sends the educator link only when typed and the library name never', () => {
    const result = validateEditor(editor());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const [library, free] = result.payload.sessions[0].exercises;
    expect(library).not.toHaveProperty('name');
    expect(library.videoUrl).toBeUndefined();
    expect(free.videoUrl).toBe('https://example.com/flexao');
  });
});

describe('unsaved changes', () => {
  it('UT-096 is clean until something that would be saved changes', () => {
    const state = editor();
    const saved = snapshotOf(state);

    expect(isEditorDirty(saved, state)).toBe(false);
    expect(
      isEditorDirty(saved, reduce(state, { type: 'set-title', value: 'Outro' }))
    ).toBe(true);
  });

  it('UT-108 does not count a refreshed conflict mark as a change', () => {
    const state = editor();
    const saved = snapshotOf(state);
    const refreshed = treeToEditor({
      ...TREE,
      sessions: [
        {
          ...TREE.sessions[0],
          exercises: TREE.sessions[0].exercises.map(exercise => ({
            ...exercise,
            conflicts: [],
          })),
        },
        TREE.sessions[1],
      ],
    });

    expect(isEditorDirty(saved, refreshed)).toBe(false);
    expect(refreshed.sessions[0].exercises[0].conflicts).toEqual([]);
  });
});

describe('edits that would break the active workout', () => {
  it('UT-099 flags removing the last exercise or last session, nothing else', () => {
    const [first, second] = [editor(), editor()];
    const onlyOne = reduce(first, { type: 'remove-session', sessionKey: 's2' });
    const withOne = reduce(onlyOne, {
      type: 'remove-exercise',
      sessionKey: 's1',
      exerciseKey: 'x2',
    });

    expect(
      breaksActiveRule(withOne, {
        type: 'remove-exercise',
        sessionKey: 's1',
        exerciseKey: 'x1',
      })
    ).toBe(true);
    expect(
      breaksActiveRule(withOne, { type: 'remove-session', sessionKey: 's1' })
    ).toBe(true);
    expect(
      breaksActiveRule(onlyOne, {
        type: 'remove-exercise',
        sessionKey: 's1',
        exerciseKey: 'x2',
      })
    ).toBe(false);
    expect(
      breaksActiveRule(onlyOne, { type: 'set-title', value: 'Outro' })
    ).toBe(false);
    expect(second.sessions).toHaveLength(2);
  });
});

describe('opening the editor', () => {
  it('UT-090 starts a workout without sessions with one blank session, not counted as a change', () => {
    const empty = { ...TREE, sessions: [] };

    const state = initialEditorState(empty);

    expect(state.sessions).toEqual([
      { key: BLANK_SESSION_KEY, name: '', exercises: [] },
    ]);
    expect(isEditorDirty(snapshotOf(state), state)).toBe(false);
  });

  it('keeps a workout that already has sessions as it was saved', () => {
    expect(initialEditorState(TREE)).toEqual(treeToEditor(TREE));
  });
});
