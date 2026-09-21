'use client';

import { deleteMeasurementRecord } from '@/_actions/progress/deleteMeasurementRecord';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/_components/ui/tooltip';
import { useAlertHook } from '@/_hooks/alertHook';
import { formatBmi } from '@/_lib/progressDisplay';
import { cn } from '@/_lib/utils';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useServerAction } from 'zsa-react';
import { BmiBadge } from './bmiBadge';
import { RecordFormModal } from './recordFormModal';

interface HistoryListProps {
  records: MeasurementRecordResponseDTO[];
}

interface IconActionProps extends ComponentProps<'button'> {
  /** Nome acessível do botão — é ele, não o tooltip, que o leitor de tela anuncia. */
  label: string;
  tooltip: string;
}

/**
 * Ação compacta do histórico: só o ícone, com nome acessível próprio e um
 * tooltip no hover ou no foco. O toque não depende do tooltip — o clique é o do
 * próprio botão — e o alvo tem 44 px no celular.
 */
function IconAction({
  label,
  tooltip,
  className,
  children,
  ...props
}: IconActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={label}
          className={cn('size-11 md:size-9', className)}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function HistoryRow({ record }: { record: MeasurementRecordResponseDTO }) {
  const deleteAction = useServerAction(deleteMeasurementRecord);
  const router = useRouter();
  const { openError } = useAlertHook();

  async function handleDelete() {
    const [, error] = await deleteAction.execute({ id: record.id });
    if (error) {
      openError(
        error.message || 'Não foi possível excluir o registro.',
        'Atenção!',
        'error'
      );
      return;
    }
    router.refresh();
  }

  return (
    <li className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0 sm:py-4">
      <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-3 sm:items-center sm:gap-2">
        <time
          className="text-sm text-muted-foreground"
          dateTime={record.recordedAt}
        >
          {new Date(record.recordedAt).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </time>
        <p className="font-semibold">
          {record.weightKg.toLocaleString('pt-BR')} kg
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            IMC {formatBmi(record.bmi)}
          </span>
          <BmiBadge classification={record.bmiClassification} />
        </div>
      </div>
      <div className="flex shrink-0 gap-1 sm:justify-end sm:gap-2">
        <RecordFormModal
          existingRecord={record}
          trigger={
            <IconAction label="Editar registro" tooltip="Editar">
              <Pencil aria-hidden="true" />
            </IconAction>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <IconAction
              label="Excluir registro"
              tooltip="Excluir"
              className="text-destructive"
            >
              <Trash2 aria-hidden="true" />
            </IconAction>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir este registro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação remove a medida dos cartões, gráficos e histórico e
                não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteAction.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteAction.isPending ? 'Excluindo…' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}

export function HistoryList({ records }: HistoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos registros</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {records.map(record => (
            <HistoryRow key={record.id} record={record} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
