import {
  SESSION_EXERCISES_MAX,
  SESSION_LABELS,
  WORKOUT_SESSIONS_MAX,
} from '@/_constants/educatorWorkoutLimits';
import { workoutSchema, type WorkoutPayload } from '@/_schema/educatorWorkouts';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';
import type {
  EditorExercise,
  EditorSession,
  WorkoutEditorState,
} from '@/_types/workoutEditor';

/** A, B, C… from the position; never stored, it follows the order. */
export function sessionLabel(position: number): string {
  return SESSION_LABELS[position] ?? String(position + 1);
}

export function canAddSession(state: WorkoutEditorState): boolean {
  return state.sessions.length < WORKOUT_SESSIONS_MAX;
}

export function canAddExercise(session: EditorSession): boolean {
  return session.exercises.length < SESSION_EXERCISES_MAX;
}

/** The working copy of a saved workout, with a stable key for every row. */
export function treeToEditor(tree: WorkoutTree): WorkoutEditorState {
  return {
    title: tree.title,
    weeklyFrequency:
      tree.weeklyFrequency === null ? '' : String(tree.weeklyFrequency),
    sessions: tree.sessions.map(session => ({
      key: session.id,
      id: session.id,
      name: session.name,
      exercises: session.exercises.map(exercise => ({
        key: exercise.id,
        id: exercise.id,
        source: exercise.source,
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        sets: String(exercise.sets),
        reps: exercise.reps,
        load: exercise.load ?? '',
        videoUrl: exercise.videoUrl ?? '',
        libraryVideoUrl: exercise.libraryVideoUrl,
        conflicts: exercise.conflicts,
      })),
    })),
  };
}

/** Key of the blank session a workout without sessions starts the editor with. */
export const BLANK_SESSION_KEY = 'new-session';

/**
 * What the editor opens with: the saved workout, or - when it has no session yet,
 * as a freshly created draft - one blank session ready to be named. It counts as
 * the saved state, so opening a new draft is not an unsaved change.
 */
export function initialEditorState(tree: WorkoutTree): WorkoutEditorState {
  const state = treeToEditor(tree);
  if (state.sessions.length > 0) return state;

  return {
    ...state,
    sessions: [{ key: BLANK_SESSION_KEY, name: '', exercises: [] }],
  };
}

const DEFAULT_SETS = '3';
const DEFAULT_REPS = '10';

/** A library exercise added to a session, with the usual starting values. */
export function exerciseFromLibrary(
  library: Exercise,
  key: string,
  conflicts: ExerciseContraindication[] = []
): EditorExercise {
  return {
    key,
    source: 'LIBRARY',
    exerciseId: library.id,
    name: library.name,
    muscleGroup: library.muscleGroup,
    equipment: library.equipment,
    sets: DEFAULT_SETS,
    reps: DEFAULT_REPS,
    load: '',
    videoUrl: '',
    libraryVideoUrl: library.videoUrl,
    conflicts,
  };
}

/** An exercise added by name: muscle group required, equipment optional. */
export function exerciseFromName(
  input: {
    name: string;
    muscleGroup: string;
    equipment: ExerciseEquipment | null;
  },
  key: string
): EditorExercise {
  return {
    key,
    source: 'FREE',
    exerciseId: null,
    name: input.name.trim(),
    muscleGroup: input.muscleGroup,
    equipment: input.equipment,
    sets: DEFAULT_SETS,
    reps: DEFAULT_REPS,
    load: '',
    videoUrl: '',
    libraryVideoUrl: null,
    conflicts: [],
  };
}

export type EditableExerciseField = 'sets' | 'reps' | 'load' | 'videoUrl';

export type EditorAction =
  | { type: 'set-title'; value: string }
  | { type: 'set-frequency'; value: string }
  | { type: 'add-session'; key: string }
  | { type: 'rename-session'; sessionKey: string; name: string }
  | { type: 'move-session'; sessionKey: string; direction: -1 | 1 }
  | { type: 'remove-session'; sessionKey: string }
  | { type: 'add-exercise'; sessionKey: string; exercise: EditorExercise }
  | {
      type: 'update-exercise';
      sessionKey: string;
      exerciseKey: string;
      field: EditableExerciseField;
      value: string;
    }
  | {
      type: 'move-exercise';
      sessionKey: string;
      exerciseKey: string;
      direction: -1 | 1;
    }
  | { type: 'remove-exercise'; sessionKey: string; exerciseKey: string }
  | { type: 'replace'; state: WorkoutEditorState };

function moveItem<T>(list: T[], from: number, direction: -1 | 1): T[] {
  const to = from + direction;
  if (from < 0 || to < 0 || to >= list.length) return list;

  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

function mapSession(
  state: WorkoutEditorState,
  sessionKey: string,
  change: (session: EditorSession) => EditorSession
): WorkoutEditorState {
  return {
    ...state,
    sessions: state.sessions.map(session =>
      session.key === sessionKey ? change(session) : session
    ),
  };
}

type SessionAction = Extract<
  EditorAction,
  {
    type: 'add-session' | 'rename-session' | 'move-session' | 'remove-session';
  }
>;

type ExerciseAction = Extract<
  EditorAction,
  {
    type:
      | 'add-exercise'
      | 'update-exercise'
      | 'move-exercise'
      | 'remove-exercise';
  }
>;

function reduceSessions(
  state: WorkoutEditorState,
  action: SessionAction
): WorkoutEditorState {
  switch (action.type) {
    case 'add-session':
      return canAddSession(state)
        ? {
            ...state,
            sessions: [
              ...state.sessions,
              { key: action.key, name: '', exercises: [] },
            ],
          }
        : state;
    case 'rename-session':
      return mapSession(state, action.sessionKey, session => ({
        ...session,
        name: action.name,
      }));
    case 'move-session': {
      const from = state.sessions.findIndex(s => s.key === action.sessionKey);
      return {
        ...state,
        sessions: moveItem(state.sessions, from, action.direction),
      };
    }
    case 'remove-session':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.key !== action.sessionKey),
      };
  }
}

function reduceExercises(
  state: WorkoutEditorState,
  action: ExerciseAction
): WorkoutEditorState {
  return mapSession(state, action.sessionKey, session => {
    switch (action.type) {
      case 'add-exercise':
        return canAddExercise(session)
          ? { ...session, exercises: [...session.exercises, action.exercise] }
          : session;
      case 'update-exercise':
        return {
          ...session,
          exercises: session.exercises.map(exercise =>
            exercise.key === action.exerciseKey
              ? { ...exercise, [action.field]: action.value }
              : exercise
          ),
        };
      case 'move-exercise':
        return {
          ...session,
          exercises: moveItem(
            session.exercises,
            session.exercises.findIndex(e => e.key === action.exerciseKey),
            action.direction
          ),
        };
      case 'remove-exercise':
        return {
          ...session,
          exercises: session.exercises.filter(
            e => e.key !== action.exerciseKey
          ),
        };
    }
  });
}

/** Every edit to the working copy; pure, so the rules are tested directly. */
export function workoutEditorReducer(
  state: WorkoutEditorState,
  action: EditorAction
): WorkoutEditorState {
  switch (action.type) {
    case 'set-title':
      return { ...state, title: action.value };
    case 'set-frequency':
      return { ...state, weeklyFrequency: action.value };
    case 'replace':
      return action.state;
    case 'add-session':
    case 'rename-session':
    case 'move-session':
    case 'remove-session':
      return reduceSessions(state, action);
    case 'add-exercise':
    case 'update-exercise':
    case 'move-exercise':
    case 'remove-exercise':
      return reduceExercises(state, action);
  }
}

/** What would be sent, as plain values the schema reads. */
export function toPayloadInput(state: WorkoutEditorState): unknown {
  return {
    title: state.title,
    weeklyFrequency: state.weeklyFrequency,
    sessions: state.sessions.map(session => ({
      id: session.id,
      name: session.name,
      exercises: session.exercises.map(exercise =>
        exercise.source === 'LIBRARY'
          ? {
              id: exercise.id,
              source: 'LIBRARY',
              exerciseId: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              load: exercise.load,
              videoUrl: exercise.videoUrl,
            }
          : {
              id: exercise.id,
              source: 'FREE',
              name: exercise.name,
              muscleGroup: exercise.muscleGroup,
              equipment: exercise.equipment,
              sets: exercise.sets,
              reps: exercise.reps,
              load: exercise.load,
              videoUrl: exercise.videoUrl,
            }
      ),
    })),
  };
}

export type EditorValidation =
  | { ok: true; payload: WorkoutPayload }
  | { ok: false; errors: Record<string, string> };

/** Validates the working copy; errors are keyed by path, e.g. `sessions.0.name`. */
export function validateEditor(state: WorkoutEditorState): EditorValidation {
  const result = workoutSchema.safeParse(toPayloadInput(state));
  if (result.success) return { ok: true, payload: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!(path in errors)) errors[path] = issue.message;
  }
  return { ok: false, errors };
}

export const ACTIVE_RULE_MESSAGE =
  'Um treino ativo precisa ter ao menos uma sessão e um exercício em cada sessão. Desative o treino para esvaziá-lo.';

/**
 * The active workout must always stay valid: at least one session, an exercise
 * in every session. Returns the explanation when the copy breaks that, else null.
 */
export function activeRuleViolation(state: WorkoutEditorState): string | null {
  if (state.sessions.length === 0) return ACTIVE_RULE_MESSAGE;

  return state.sessions.some(session => session.exercises.length === 0)
    ? ACTIVE_RULE_MESSAGE
    : null;
}

/** Whether applying this edit would leave the active workout invalid (only removals can). */
export function breaksActiveRule(
  state: WorkoutEditorState,
  action: EditorAction
): boolean {
  const removes =
    action.type === 'remove-exercise' || action.type === 'remove-session';
  if (!removes) return false;

  return activeRuleViolation(workoutEditorReducer(state, action)) !== null;
}

/** A comparable snapshot of what would be saved (conflict marks excluded). */
export function snapshotOf(state: WorkoutEditorState): string {
  return JSON.stringify(toPayloadInput(state));
}

export function isEditorDirty(
  initialSnapshot: string,
  state: WorkoutEditorState
): boolean {
  return snapshotOf(state) !== initialSnapshot;
}
