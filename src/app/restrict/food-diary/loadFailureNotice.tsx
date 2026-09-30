import { AlertCircle } from 'lucide-react';

export function LoadFailureNotice() {
  return (
    <section className="flex min-h-[28rem] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-line bg-card px-6 py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="size-8" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-semibold">Não foi possível carregar</h1>
        <p className="text-muted-foreground">
          Não conseguimos carregar seu diário agora. Tente novamente mais tarde.
        </p>
      </div>
    </section>
  );
}
