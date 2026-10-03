import { buttonVariants } from '@/_components/ui/button';
import { STUDENTS_PATH } from '@/_lib/studentsList';
import Link from 'next/link';

/** A search that matched nothing; the search term is plain text, never markup. */
export function StudentsNoResults({ search }: { search: string }) {
  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <p className="font-medium">Nenhum aluno encontrado</p>
      <p className="text-sm text-muted-foreground">
        Nenhum aluno corresponde a “{search}”. Confira a grafia ou limpe a
        busca.
      </p>
      <Link
        href={STUDENTS_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Limpar busca
      </Link>
    </section>
  );
}
