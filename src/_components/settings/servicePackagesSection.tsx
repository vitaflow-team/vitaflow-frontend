'use client';

import { createServicePackage } from '@/_actions/service-packages/createServicePackage';
import { deactivateServicePackage } from '@/_actions/service-packages/deactivateServicePackage';
import { updateServicePackage } from '@/_actions/service-packages/updateServicePackage';
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
  servicePackageSchema,
  type ServicePackageFormData,
  type ServicePackageFormInput,
} from '@/_schema/servicePackages';
import type { ServicePackage } from '@/_types/servicePackages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

function formatPrice(value: string | number): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const EMPTY_FORM: ServicePackageFormInput = {
  name: '',
  sessionCount: 1,
  referencePrice: 0,
};

function PackageFields({
  methods,
  disabled,
}: {
  methods: UseFormReturn<
    ServicePackageFormInput,
    unknown,
    ServicePackageFormData
  >;
  disabled: boolean;
}) {
  return (
    <>
      <FormField
        control={methods.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do pacote</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                placeholder="Pacote de 10"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="sessionCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade de sessões</FormLabel>
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

function CreatePackageForm() {
  const router = useRouter();
  const action = useServerAction(createServicePackage);
  const methods = useForm<
    ServicePackageFormInput,
    unknown,
    ServicePackageFormData
  >({
    resolver: zodResolver(servicePackageSchema),
    defaultValues: EMPTY_FORM,
  });

  async function submit(values: ServicePackageFormData) {
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
        <PackageFields methods={methods} disabled={action.isPending} />
        <FormError message={action.isError ? action.error.message : null} />
        <Button
          type="submit"
          disabled={action.isPending}
          className="self-start"
        >
          {action.isPending ? 'Criando...' : 'Criar pacote'}
        </Button>
      </form>
    </Form>
  );
}

function EditPackageDialog({
  servicePackage,
}: {
  servicePackage: ServicePackage;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useServerAction(updateServicePackage);
  const methods = useForm<
    ServicePackageFormInput,
    unknown,
    ServicePackageFormData
  >({
    resolver: zodResolver(servicePackageSchema),
    defaultValues: {
      name: servicePackage.name,
      sessionCount: servicePackage.sessionCount,
      referencePrice: Number(servicePackage.referencePrice),
    },
  });

  async function submit(values: ServicePackageFormData) {
    const [, error] = await action.execute({
      ...values,
      id: servicePackage.id,
    });
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
          <DialogTitle>Editar {servicePackage.name}</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
            noValidate
          >
            <PackageFields methods={methods} disabled={action.isPending} />
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

function DeactivateButton({
  servicePackage,
}: {
  servicePackage: ServicePackage;
}) {
  const router = useRouter();
  const action = useServerAction(deactivateServicePackage);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={action.isPending}
      onClick={async () => {
        await action.execute({ id: servicePackage.id });
        router.refresh();
      }}
    >
      Desativar
    </Button>
  );
}

interface ServicePackagesSectionProps {
  packages: ServicePackage[];
}

export function ServicePackagesSection({
  packages,
}: ServicePackagesSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        O valor de referência é só para o seu controle — o VitaFlow nunca cobra
        esse valor de ninguém, e este catálogo é visível só para você.
      </p>
      <CreatePackageForm />
      {packages.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum pacote cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {packages.map(servicePackage => (
            <li
              key={servicePackage.id}
              className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {servicePackage.name}
                  {!servicePackage.active && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (desativado)
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">
                  {servicePackage.sessionCount} sessões ·{' '}
                  {formatPrice(servicePackage.referencePrice)}
                </p>
              </div>
              <div className="flex gap-2">
                <EditPackageDialog servicePackage={servicePackage} />
                {servicePackage.active && (
                  <DeactivateButton servicePackage={servicePackage} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
