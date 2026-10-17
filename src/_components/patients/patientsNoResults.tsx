import { buttonVariants } from '@/_components/ui/button';
import { PATIENTS_PATH } from '@/_lib/patientsList';
import Link from 'next/link';

/** A search that matched nothing; the search term is plain text, never markup. */
export function PatientsNoResults({ search }: { search: string }) {
  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <p className="font-medium">Nenhum paciente encontrado</p>
      <p className="text-sm text-muted-foreground">
        Nenhum paciente corresponde a “{search}”. Confira a grafia ou limpe a
        busca.
      </p>
      <Link
        href={PATIENTS_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Limpar busca
      </Link>
    </section>
  );
}
