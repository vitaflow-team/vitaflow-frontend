import { buttonVariants } from '@/_components/ui/button';
import { PATIENTS_PATH } from '@/_lib/patientsList';
import type { LoadFailure } from '@/_types/loadFailure';
import Link from 'next/link';

interface PatientNotFoundProps {
  reason: LoadFailure;
}

/**
 * An unknown, foreign, malformed or removed id all read the same, so the
 * page never confirms that an id belongs to someone else.
 */
export function PatientNotFound({ reason }: PatientNotFoundProps) {
  const failed = reason === 'failed';

  return (
    <section
      aria-labelledby="patient-not-found-title"
      className="flex flex-col items-center gap-3 px-4 py-12 text-center"
    >
      <h1 id="patient-not-found-title" className="text-xl font-semibold">
        {failed
          ? 'Não foi possível carregar o paciente'
          : 'Paciente não encontrado'}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {failed
          ? 'Tente novamente em alguns instantes.'
          : 'Este paciente não existe ou foi removido da sua lista.'}
      </p>
      <Link
        href={PATIENTS_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Voltar para Pacientes
      </Link>
    </section>
  );
}
