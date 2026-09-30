import DefaultLayout from '@/_components/layout/defaultLayout';
import { isLoadFailure, loadCurrentWorkout } from '@/_lib/workoutData';
import { auth } from '@/auth';
import { ConversationChat } from './conversationChat';
import { GeneratedWorkoutView } from './generatedWorkoutView';
import { LoadFailureNotice } from './loadFailureNotice';

interface WorkoutsViewProps {
  searchParams: Promise<{ gerar?: string }>;
}

/** Entry point for the AI Workout Generator: the conversational intake
 * when the user has no current workout, otherwise the generated plan.
 * `?gerar=1` re-enters the conversation to regenerate (US-005/US-009) —
 * the Premium gate, if it applies, surfaces from the conversation's own
 * completion, not before it starts (see `ConversationChat`). */
export default async function WorkoutsView({
  searchParams,
}: WorkoutsViewProps) {
  const session = await auth();
  if (!session?.user) return null;

  const { gerar } = await searchParams;
  const workout = await loadCurrentWorkout();

  return (
    <DefaultLayout>
      {isLoadFailure(workout) ? (
        <LoadFailureNotice />
      ) : workout && gerar !== '1' ? (
        <GeneratedWorkoutView workout={workout} />
      ) : (
        <ConversationChat hasExistingWorkout={Boolean(workout)} />
      )}
    </DefaultLayout>
  );
}
