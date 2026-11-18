import type { ReceptionistStudent } from '@/_actions/checkin/searchStudents';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import type { CheckinConfirmation } from '@/_types/checkinConfirmation';
import { CheckinConfirmed } from './checkinConfirmed';

interface SelectedStudentCheckinProps {
  student: ReceptionistStudent;
  confirmation: CheckinConfirmation | null;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
  onReset: () => void;
}

/** The chosen student: confirm the check-in, or read its result once registered. */
export function SelectedStudentCheckin({
  student,
  confirmation,
  isPending,
  error,
  onConfirm,
  onBack,
  onReset,
}: SelectedStudentCheckinProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Confirmar check-in</h1>
      <p className="text-lg">{student.name}</p>
      {confirmation ? (
        <CheckinConfirmed confirmation={confirmation} onReset={onReset} />
      ) : (
        <div className="flex gap-2">
          <Button type="button" disabled={isPending} onClick={onConfirm}>
            {isPending ? 'Registrando...' : 'Confirmar check-in'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      )}
      <FormError message={error} />
    </div>
  );
}
