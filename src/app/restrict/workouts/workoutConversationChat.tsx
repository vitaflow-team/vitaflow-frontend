'use client';

import { actionPostConversation } from '@/_actions/workouts/postConversation';
import { ConversationChat } from '@/_components/conversation/conversationChat';
import { isGeneratedWorkout } from '@/_types/workout';
import { useRouter } from 'next/navigation';

interface WorkoutConversationChatProps {
  hasExistingWorkout: boolean;
}

/** The workout generator's own thin configuration of the shared, generalized
 * `ConversationChat` (ADR-009) — owns the navigation `ConversationChat`
 * itself no longer hardcodes: once the intake completes, go back to the
 * workouts screen and refresh its server data. */
export function WorkoutConversationChat({
  hasExistingWorkout,
}: WorkoutConversationChatProps) {
  const router = useRouter();

  return (
    <ConversationChat
      action={actionPostConversation}
      isReady={isGeneratedWorkout}
      onReady={() => {
        router.push('/restrict/workouts');
        router.refresh();
      }}
      title={
        hasExistingWorkout ? 'Gerar um novo treino' : 'Vamos montar seu treino'
      }
      premiumTitle="Regeneração requer o plano Premium"
      premiumMessage="Você já gerou um treino com IA. Para gerar um novo, assine o plano Premium."
      premiumCtaLabel="Ver planos"
      premiumCtaHref="/restrict/settings?tab=plano"
    />
  );
}
