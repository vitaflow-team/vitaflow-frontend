import type { ActivationProblem } from '@/_types/educatorWorkouts';

/** "Sessão B — Costas" for each session that has no exercise, or the no-sessions case. */
export function describeProblem(problem: ActivationProblem): string {
  if (problem.code === 'no_sessions') return 'O treino não tem nenhuma sessão.';

  const name = problem.sessionName ? ` — ${problem.sessionName}` : '';
  return `Sessão ${problem.sessionLabel ?? ''}${name} está sem exercícios.`;
}

interface ActivationProblemsProps {
  problems: ActivationProblem[];
}

/** Why the workout could not be activated, session by session. */
export function ActivationProblems({ problems }: ActivationProblemsProps) {
  if (problems.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 p-3 text-sm"
    >
      <p className="font-medium text-destructive">
        Não foi possível ativar o treino.
      </p>
      <ul className="list-disc pl-5">
        {problems.map((problem, index) => (
          <li key={`${problem.code}-${problem.sessionLabel ?? index}`}>
            {describeProblem(problem)}
          </li>
        ))}
      </ul>
    </div>
  );
}
