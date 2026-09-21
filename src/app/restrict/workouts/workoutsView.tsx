import DefaultLayout from '@/_components/layout/defaultLayout';
import { Dumbbell } from 'lucide-react';

/**
 * Estado honesto: não existe criação nem persistência de treino no produto, e
 * um botão que leva a um formulário que não salva é um controle morto
 * (ADR-001). O texto fica genérico de propósito, sem data nem promessa.
 */
export default function WorkoutsView() {
  return (
    <DefaultLayout>
      <section className="flex min-h-[28rem] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-line bg-card px-6 py-12 text-center">
        <div className="rounded-full bg-secondary p-4 text-icon-accent">
          <Dumbbell className="size-8" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-semibold">Treinos em breve</h1>
          <p className="text-muted-foreground">
            Estamos construindo esta área. Quando ela estiver pronta, seus
            treinos aparecem aqui.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
