import { formatBRL } from '@/_lib/financialHealthDisplay';
import type { EligibleStudent } from '@/_types/eligibleStudent';

interface EligibleStudentRowProps {
  student: EligibleStudent;
  checked: boolean;
  disabled: boolean;
  onToggle: (clientId: string) => void;
}

/** One student that can be activated; a missing tax ID is said in words, not only by color. */
export function EligibleStudentRow({
  student,
  checked,
  disabled,
  onToggle,
}: EligibleStudentRowProps) {
  const inputId = `eligible-${student.clientId}`;

  return (
    <li className="flex items-start gap-3 rounded-lg border p-3">
      <input
        id={inputId}
        type="checkbox"
        className="mt-1"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(student.clientId)}
      />
      <label htmlFor={inputId} className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="font-medium break-words">{student.name}</span>
        <span className="text-muted-foreground">
          {student.planName} · {formatBRL(student.amountCents)} por mês
        </span>
        {!student.hasTaxId && (
          <span className="text-amber-700 dark:text-amber-300">
            Sem CPF ou CNPJ cadastrado: este aluno será ignorado na ativação.
          </span>
        )}
      </label>
    </li>
  );
}
