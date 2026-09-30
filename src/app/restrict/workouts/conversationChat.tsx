'use client';

import { actionPostConversation } from '@/_actions/workouts/postConversation';
import { Button } from '@/_components/ui/button';
import { Card, CardContent } from '@/_components/ui/card';
import { Input } from '@/_components/ui/input';
import { Title } from '@/_components/ui/title';
import { isGeneratedWorkout } from '@/_types/workout';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface Turn {
  question: string;
  answer?: string;
}

interface ConversationChatProps {
  hasExistingWorkout: boolean;
}

/** The conversational intake (US-001/US-002): one question at a time,
 * matching the validated `TreinoIA.dc.html` chat-style prototype. A
 * Premium-gate error surfaces on the turn that completes the intake for a
 * user who already has a workout (the backend enforces the gate there —
 * see WorkoutsService.regenerate). */
export function ConversationChat({
  hasExistingWorkout,
}: ConversationChatProps) {
  const [history, setHistory] = useState<Turn[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [currentQuestion, setCurrentQuestion] = useState<string>();
  const [reprompt, setReprompt] = useState(false);
  const [answer, setAnswer] = useState('');
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const { isPending, execute } = useServerAction(actionPostConversation);
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void advance({});
  }, []);

  async function advance(input: { conversationId?: string; answer?: string }) {
    setLoadError(undefined);
    const [result, error] = await execute(input);
    if (error) {
      if (error.message.includes('Premium')) {
        setPremiumRequired(true);
        return;
      }
      setLoadError(error.message);
      return;
    }
    if (!result) return;

    if (isGeneratedWorkout(result)) {
      router.push('/restrict/workouts');
      router.refresh();
      return;
    }

    setConversationId(result.conversationId);
    setReprompt(result.reprompt);
    if (!result.reprompt && currentQuestion) {
      setHistory(prev => [
        ...prev,
        { question: currentQuestion, answer: input.answer },
      ]);
    }
    setCurrentQuestion(result.question);
    setAnswer('');
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!answer.trim()) return;
    await advance({ conversationId, answer });
  }

  if (premiumRequired) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <Title label="Regeneração requer o plano Premium" />
          <p className="text-muted-foreground max-w-md">
            Você já gerou um treino com IA. Para gerar um novo, assine o plano
            Premium.
          </p>
          <Button onClick={() => router.push('/restrict/settings?tab=plano')}>
            Ver planos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Title
        label={
          hasExistingWorkout
            ? 'Gerar um novo treino'
            : 'Vamos montar seu treino'
        }
      />

      <div className="flex flex-col gap-2">
        {history.map((turn, index) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="rounded-lg bg-secondary px-4 py-2 w-fit max-w-[80%]">
              {turn.question}
            </p>
            {turn.answer && (
              <p className="rounded-lg bg-primary text-primary-foreground px-4 py-2 w-fit max-w-[80%] self-end">
                {turn.answer}
              </p>
            )}
          </div>
        ))}
        {currentQuestion && (
          <p className="rounded-lg bg-secondary px-4 py-2 w-fit max-w-[80%]">
            {currentQuestion}
          </p>
        )}
        {reprompt && (
          <p className="text-sm text-destructive">
            Não entendi, pode responder de outra forma?
          </p>
        )}
        {loadError && <p className="text-sm text-destructive">{loadError}</p>}
      </div>

      {currentQuestion && (
        <form onSubmit={submit} className="flex gap-2">
          <Input
            aria-label="Sua resposta"
            value={answer}
            onChange={event => setAnswer(event.target.value)}
            disabled={isPending}
            autoFocus
          />
          <Button type="submit" disabled={isPending || !answer.trim()}>
            Enviar
          </Button>
        </form>
      )}
    </div>
  );
}
