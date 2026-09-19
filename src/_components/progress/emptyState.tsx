import { Activity } from 'lucide-react';
import { RecordFormModal } from './recordFormModal';

export function EmptyState() {
  return (
    <section className="flex min-h-[28rem] flex-col items-center justify-center gap-5 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <div className="rounded-full bg-secondary p-4 text-icon-accent">
        <Activity className="size-8" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-semibold">
          Comece a acompanhar sua evolução
        </h2>
        <p className="text-muted-foreground">
          Registre peso e altura para ver seus indicadores, tendências e
          histórico por aqui.
        </p>
      </div>
      <RecordFormModal />
    </section>
  );
}
