import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';

export const AI_PLAN_KEY = 'ia';
export const EDUCATOR_PLAN_KEY = 'educador';

export type PlanOption =
  | {
      kind: 'educator';
      key: string;
      label: string;
      item: StudentEducatorWorkout;
    }
  | { kind: 'ai'; key: typeof AI_PLAN_KEY; label: string };

/**
 * The plans the student can open on "Treinos": every linked educator's active
 * workout first (the first one answers to `?plano=educador`, the others to
 * `?plano=educador-<id>`), then the AI workout when there is one.
 */
export function buildPlanOptions(
  educatorWorkouts: StudentEducatorWorkout[],
  hasAiWorkout: boolean
): PlanOption[] {
  const educators = educatorWorkouts.map(
    (item, index): PlanOption => ({
      kind: 'educator',
      key: index === 0 ? EDUCATOR_PLAN_KEY : `educador-${item.educator.id}`,
      label: `Treino de ${item.educator.name}`,
      item,
    })
  );

  return hasAiWorkout
    ? [...educators, { kind: 'ai', key: AI_PLAN_KEY, label: 'Treino com IA' }]
    : educators;
}

/** The plan `?plano=` asks for; anything unknown falls back to the first (the educator's). */
export function selectPlan(
  options: PlanOption[],
  requested: string | string[] | undefined
): PlanOption | null {
  const key = Array.isArray(requested) ? requested[0] : requested;

  return options.find(option => option.key === key) ?? options[0] ?? null;
}

export function planHref(key: string): string {
  return `/restrict/workouts?plano=${encodeURIComponent(key)}`;
}
