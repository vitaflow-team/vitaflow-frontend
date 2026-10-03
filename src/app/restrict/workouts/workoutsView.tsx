import DefaultLayout from '@/_components/layout/defaultLayout';
import { EducatorWorkoutView } from '@/_components/studentWorkouts/educatorWorkoutView';
import { PlanSwitch } from '@/_components/studentWorkouts/planSwitch';
import {
  isLoadFailure as isEducatorLoadFailure,
  loadMyEducatorWorkouts,
} from '@/_lib/educatorWorkoutsData';
import {
  buildPlanOptions,
  selectPlan,
  type PlanOption,
} from '@/_lib/studentPlans';
import { isLoadFailure, loadCurrentWorkout } from '@/_lib/workoutData';
import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';
import { auth } from '@/auth';
import type { ReactNode } from 'react';
import { ConversationChat } from './conversationChat';
import { GeneratedWorkoutView } from './generatedWorkoutView';
import { LoadFailureNotice } from './loadFailureNotice';

interface WorkoutsViewProps {
  searchParams: Promise<{ gerar?: string; plano?: string }>;
}

/** The educator's workouts, or none when they cannot be read: a failure here
 * must never take the AI workout screen down with it. */
async function educatorWorkoutsOrNone(): Promise<StudentEducatorWorkout[]> {
  const result = await loadMyEducatorWorkouts();
  return isEducatorLoadFailure(result) ? [] : result;
}

interface WithPlanSwitchProps {
  options: PlanOption[];
  selectedKey: string;
  children: ReactNode;
}

/** The switch appears only when there is a choice; with one plan the screen is the plan itself. */
function WithPlanSwitch({
  options,
  selectedKey,
  children,
}: WithPlanSwitchProps) {
  if (options.length < 2) return <>{children}</>;

  return (
    <div className="flex flex-col gap-4">
      <PlanSwitch options={options} selectedKey={selectedKey} />
      {children}
    </div>
  );
}

/** Entry point for the student's workouts: the educator's active workout(s)
 * and the AI Workout Generator plan. With both, a switch driven by
 * `?plano=` (educator first); with one, that one directly; with neither,
 * the conversational intake — exactly as it was before educator workouts.
 * `?gerar=1` re-enters the conversation to regenerate (US-005/US-009) —
 * the Premium gate, if it applies, surfaces from the conversation's own
 * completion, not before it starts (see `ConversationChat`). */
export default async function WorkoutsView({
  searchParams,
}: WorkoutsViewProps) {
  const session = await auth();
  if (!session?.user) return null;

  const { gerar, plano } = await searchParams;
  const [workout, educatorWorkouts] = await Promise.all([
    loadCurrentWorkout(),
    educatorWorkoutsOrNone(),
  ]);
  const aiWorkout = isLoadFailure(workout) ? null : workout;
  const options = buildPlanOptions(educatorWorkouts, aiWorkout !== null);
  const selected = gerar === '1' ? null : selectPlan(options, plano);

  return (
    <DefaultLayout>
      {selected ? (
        <WithPlanSwitch options={options} selectedKey={selected.key}>
          {selected.kind === 'educator' ? (
            <EducatorWorkoutView item={selected.item} />
          ) : (
            aiWorkout && <GeneratedWorkoutView workout={aiWorkout} />
          )}
        </WithPlanSwitch>
      ) : isLoadFailure(workout) ? (
        <LoadFailureNotice />
      ) : (
        <ConversationChat hasExistingWorkout={Boolean(workout)} />
      )}
    </DefaultLayout>
  );
}
