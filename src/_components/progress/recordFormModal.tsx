'use client';

import { createMeasurementRecord } from '@/_actions/progress/createMeasurementRecord';
import { updateMeasurementRecord } from '@/_actions/progress/updateMeasurementRecord';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import { getBmiPreview } from '@/_lib/bmi';
import {
  measurementRecordSchema,
  type measurementRecordFormData,
} from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactNode, useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { BmiBadge } from './bmiBadge';

interface RecordFormModalProps {
  defaultHeightCm?: number;
  existingRecord?: MeasurementRecordResponseDTO;
  trigger?: ReactNode;
}

export function RecordFormModal({
  defaultHeightCm,
  existingRecord,
  trigger,
}: RecordFormModalProps) {
  const [open, setOpen] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const formId = useId();
  const router = useRouter();
  const { openError } = useAlertHook();
  const createAction = useServerAction(createMeasurementRecord);
  const updateAction = useServerAction(updateMeasurementRecord);

  const methods = useForm<measurementRecordFormData>({
    resolver: zodResolver(measurementRecordSchema),
    defaultValues: {
      weightKg: existingRecord?.weightKg,
      heightCm: existingRecord?.heightCm ?? defaultHeightCm,
      waistCm: existingRecord?.waistCm ?? undefined,
      hipCm: existingRecord?.hipCm ?? undefined,
    },
  });

  const [weightKg, heightCm] = useWatch({
    control: methods.control,
    name: ['weightKg', 'heightCm'],
  });
  const preview = getBmiPreview(weightKg, heightCm);
  const isPending = createAction.isPending || updateAction.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      methods.reset({
        weightKg: existingRecord?.weightKg,
        heightCm: existingRecord?.heightCm ?? defaultHeightCm,
        waistCm: existingRecord?.waistCm ?? undefined,
        hipCm: existingRecord?.hipCm ?? undefined,
      });
      setShowOptional(false);
    }
    setOpen(nextOpen);
  }

  async function submitRecord(data: measurementRecordFormData) {
    const [, error] = existingRecord
      ? await updateAction.execute({ id: existingRecord.id, ...data })
      : await createAction.execute(data);

    if (error) {
      openError(
        error.message || 'Não foi possível salvar o registro.',
        'Atenção!',
        'error'
      );
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus aria-hidden="true" />
            Registrar novo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-2 border-primary shadow-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {existingRecord ? 'Editar registro' : 'Registrar novo'}
          </DialogTitle>
          <DialogDescription>
            Informe peso e altura. O IMC é calculado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...methods}>
          <form
            id={formId}
            onSubmit={methods.handleSubmit(submitRecord)}
            className="flex flex-col gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={event =>
                          field.onChange(
                            event.target.value === ''
                              ? undefined
                              : event.target.valueAsNumber
                          )
                        }
                        type="number"
                        inputMode="decimal"
                        min={20}
                        max={300}
                        step={0.1}
                        required
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={event =>
                          field.onChange(
                            event.target.value === ''
                              ? undefined
                              : event.target.valueAsNumber
                          )
                        }
                        type="number"
                        inputMode="decimal"
                        min={50}
                        max={250}
                        step={0.1}
                        required
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div
              aria-live="polite"
              className="flex min-h-20 items-center justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">Prévia do IMC</p>
                {preview ? (
                  <p className="text-2xl font-semibold">
                    {preview.bmi.toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Preencha peso e altura para calcular.
                  </p>
                )}
              </div>
              {preview && <BmiBadge classification={preview.classification} />}
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-fit px-0"
              aria-expanded={showOptional}
              onClick={() => setShowOptional(current => !current)}
            >
              {showOptional ? (
                <ChevronUp aria-hidden="true" />
              ) : (
                <ChevronDown aria-hidden="true" />
              )}
              Adicionar outras medidas (opcional)
            </Button>

            {showOptional && (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={methods.control}
                  name="waistCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cintura (cm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={event =>
                            field.onChange(
                              event.target.value === ''
                                ? undefined
                                : event.target.valueAsNumber
                            )
                          }
                          type="number"
                          inputMode="decimal"
                          min={30}
                          max={200}
                          step={0.1}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="hipCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quadril (cm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={event =>
                            field.onChange(
                              event.target.value === ''
                                ? undefined
                                : event.target.valueAsNumber
                            )
                          }
                          type="number"
                          inputMode="decimal"
                          min={30}
                          max={200}
                          step={0.1}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
