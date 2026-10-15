'use client';

import { createAccessPlan } from '@/_actions/academia/createAccessPlan';
import { deactivateAccessPlan } from '@/_actions/academia/deactivateAccessPlan';
import { updateAccessPlan } from '@/_actions/academia/updateAccessPlan';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import {
  accessPlanSchema,
  type AccessPlanFormData,
  type AccessPlanFormInput,
} from '@/_schema/academia';
import type { AcademiaAccessPlan } from '@/_types/academia';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

const VALIDITY_LABEL: Record<AccessPlanFormData['validityType'], string> = {
  DAYS: 'dias',
  VISITS: 'acessos',
};

function formatPrice(value: string | number): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const EMPTY_FORM: AccessPlanFormInput = {
  name: '',
  validityType: 'DAYS',
  validityValue: 30,
  referencePrice: 0,
};

function PlanFields({
  methods,
  disabled,
}: {
  methods: UseFormReturn<AccessPlanFormInput, unknown, AccessPlanFormData>;
  disabled: boolean;
}) {
  return (
    <>
      <FormField
        control={methods.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do plano</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} placeholder="Mensal" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="validityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Validade por</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="DAYS">Dias</option>
                <option value="VISITS">Acessos</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="validityValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Quantidade de {VALIDITY_LABEL[methods.watch('validityType')]}
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="referencePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor de referência (informativo)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={0}
                step="0.01"
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}

function CreatePlanForm() {
  const router = useRouter();
  const action = useServerAction(createAccessPlan);
  const methods = useForm<AccessPlanFormInput, unknown, AccessPlanFormData>({
    resolver: zodResolver(accessPlanSchema),
    defaultValues: EMPTY_FORM,
  });

  async function submit(values: AccessPlanFormData) {
    const [, error] = await action.execute(values);
    if (!error) {
      methods.reset(EMPTY_FORM);
      router.refresh();
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="bg-card flex flex-col gap-3 rounded-xl border p-4"
        noValidate
      >
        <PlanFields methods={methods} disabled={action.isPending} />
        <FormError message={action.isError ? action.error.message : null} />
        <Button
          type="submit"
          disabled={action.isPending}
          className="self-start"
        >
          {action.isPending ? 'Criando...' : 'Criar plano'}
        </Button>
      </form>
    </Form>
  );
}

function EditPlanDialog({ plan }: { plan: AcademiaAccessPlan }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useServerAction(updateAccessPlan);
  const methods = useForm<AccessPlanFormInput, unknown, AccessPlanFormData>({
    resolver: zodResolver(accessPlanSchema),
    defaultValues: {
      name: plan.name,
      validityType: plan.validityType,
      validityValue: plan.validityValue,
      referencePrice: Number(plan.referencePrice),
    },
  });

  async function submit(values: AccessPlanFormData) {
    const [, error] = await action.execute({ ...values, id: plan.id });
    if (!error) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil aria-hidden="true" />
        Editar
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {plan.name}</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
            noValidate
          >
            <PlanFields methods={methods} disabled={action.isPending} />
            <FormError message={action.isError ? action.error.message : null} />
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={action.isPending}>
                {action.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeactivateButton({ plan }: { plan: AcademiaAccessPlan }) {
  const router = useRouter();
  const action = useServerAction(deactivateAccessPlan);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={action.isPending}
      onClick={async () => {
        await action.execute({ id: plan.id });
        router.refresh();
      }}
    >
      Desativar
    </Button>
  );
}

interface AccessPlansSectionProps {
  plans: AcademiaAccessPlan[];
}

export function AccessPlansSection({ plans }: AccessPlansSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        O valor de referência é só para o seu controle — o VitaFlow nunca cobra
        esse valor de ninguém.
      </p>
      <CreatePlanForm />
      {plans.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum plano de acesso cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {plans.map(plan => (
            <li
              key={plan.id}
              className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {plan.name}
                  {!plan.active && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (desativado)
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">
                  {plan.validityValue} {VALIDITY_LABEL[plan.validityType]} ·{' '}
                  {formatPrice(plan.referencePrice)}
                </p>
              </div>
              <div className="flex gap-2">
                <EditPlanDialog plan={plan} />
                {plan.active && <DeactivateButton plan={plan} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
