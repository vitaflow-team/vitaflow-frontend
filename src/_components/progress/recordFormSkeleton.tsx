import { Button } from '@/_components/ui/button';
import { Skeleton } from '@/_components/ui/skeleton';
import { cn } from '@/_lib/utils';
import type { RecordFormLayout } from './recordForm';

interface RecordFormSkeletonProps {
  layout: RecordFormLayout;
}

/**
 * Ocupa o lugar do formulário enquanto o último registro não chegou (ADR-005).
 * Salvar fica desabilitado para que nenhum valor vazio seja gravado por engano.
 */
export function RecordFormSkeleton({ layout }: RecordFormSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn('flex flex-col gap-4 pt-4', layout === 'sheet' && 'px-4')}
    >
      <span className="sr-only">Carregando último registro</span>

      <div className="flex flex-col gap-2">
        <span aria-hidden="true" className="text-sm font-medium">
          Peso (kg)
        </span>
        <Skeleton
          aria-hidden="true"
          className={cn('w-full', layout === 'sheet' ? 'h-16' : 'h-9')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span aria-hidden="true" className="text-sm font-medium">
          Altura (cm)
        </span>
        <Skeleton aria-hidden="true" className="h-9 w-full" />
      </div>

      <Skeleton aria-hidden="true" className="h-20 w-full rounded-xl" />

      <div
        className={cn(
          'mt-2 flex gap-2 pt-3',
          layout === 'sheet' ? 'px-0 pb-4' : 'justify-end border-t'
        )}
      >
        <Button
          type="button"
          className={cn(layout === 'sheet' && 'h-11 w-full')}
          disabled
        >
          Salvar registro
        </Button>
      </div>
    </div>
  );
}
