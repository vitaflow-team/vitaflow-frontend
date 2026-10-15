import { buttonVariants } from '@/_components/ui/button';
import { PROFESSORES_PATH } from '@/_lib/professoresList';
import Link from 'next/link';

export function ProfessoresNoResults({ search }: { search: string }) {
  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <p className="font-medium">Nenhum professor encontrado</p>
      <p className="text-sm text-muted-foreground">
        Nenhum professor corresponde a “{search}”. Confira a grafia ou limpe a
        busca.
      </p>
      <Link
        href={PROFESSORES_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Limpar busca
      </Link>
    </section>
  );
}
