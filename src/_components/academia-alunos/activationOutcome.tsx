import { skipReasonLabel } from '@/_lib/bulkActivation';
import type { BatchedActivation } from '@/_types/batchedActivation';
import type { EligibleStudent } from '@/_types/eligibleStudent';

interface ActivationOutcomeProps {
  outcome: BatchedActivation;
  /** The students the run was about, to name the skipped ones. */
  students: EligibleStudent[];
}

function nameOf(students: EligibleStudent[], clientId: string): string {
  return (
    students.find(student => student.clientId === clientId)?.name ?? 'Aluno'
  );
}

/** What an activation did: how many were activated, who was skipped and why, and any interruption. */
export function ActivationOutcome({
  outcome,
  students,
}: ActivationOutcomeProps) {
  const { result, failure, notSent } = outcome;

  return (
    <div role="status" className="flex flex-col gap-2 text-sm">
      <p className="font-medium">
        {result.activated.length} aluno(s) ativado(s)
        {result.skipped.length > 0 && `, ${result.skipped.length} ignorado(s)`}.
      </p>
      {result.skipped.length > 0 && (
        <ul className="text-muted-foreground list-disc pl-5">
          {result.skipped.map(skip => (
            <li key={skip.clientId}>
              {nameOf(students, skip.clientId)}: {skipReasonLabel(skip.reason)}
            </li>
          ))}
        </ul>
      )}
      {failure && (
        <p role="alert" className="text-destructive font-medium">
          {failure} {notSent} aluno(s) não foram enviados; ative novamente para
          concluir.
        </p>
      )}
    </div>
  );
}
