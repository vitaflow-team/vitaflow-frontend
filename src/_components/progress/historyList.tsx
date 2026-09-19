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
import { useAlertHook } from '@/_hooks/alertHook';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { BmiBadge } from './bmiBadge';
import { RecordFormModal } from './recordFormModal';

interface HistoryListProps {
  records: MeasurementRecordResponseDTO[];
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
    <li className="flex flex-col gap-3 border-b py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid flex-1 gap-2 sm:grid-cols-3 sm:items-center">
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            IMC {record.bmi.toLocaleString('pt-BR')}
          </span>
          <BmiBadge classification={record.bmiClassification} />
        </div>
      </div>
      <div className="flex gap-2 sm:justify-end">
        <RecordFormModal
          existingRecord={record}
          trigger={
            <Button variant="outline" size="sm" aria-label="Editar registro">
              <Pencil aria-hidden="true" />
              Editar
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              aria-label="Excluir registro"
            >
              <Trash2 aria-hidden="true" />
              Excluir
            </Button>
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
