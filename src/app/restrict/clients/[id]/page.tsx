'use client';

import { actionGetClientById } from '@/_actions/clients/getClientById';
import { actionPostClientByUser } from '@/_actions/clients/postClientsByUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Button } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Title } from '@/_components/ui/title';
import { useAlertHook } from '@/_hooks/alert_hook';
import { useFormRedirect } from '@/_hooks/useFormRedirect';
import { formatPhone } from '@/_lib/stringUtils';
import { zodResolverFixed } from '@/_lib/zodResolverHelper';
import { ClientFormData, clientSchema } from '@/_schema/client';
import { Mail } from 'lucide-react';
import { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export default function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    execute: executeGet,
    data: dataGet,
    isPending: isPendingGet,
  } = useServerAction(actionGetClientById);
  const { execute: executePost, isPending: isPendingPost } = useServerAction(
    actionPostClientByUser
  );

  const methods = useForm<ClientFormData>({
    resolver: zodResolverFixed(clientSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      email: '',
      phone: '',
    },
  });
  const { openError } = useAlertHook();
  const { onSuccess, backUrl } = useFormRedirect('/restrict/clients');

  useEffect(() => {
    async function LoadData() {
      await executeGet({ id });
    }

    LoadData();
  }, []);

  useEffect(() => {
    if (dataGet) {
      methods.reset({
        name: dataGet.name || '',
        birthDate: dataGet.birthDate
          ? new Date(dataGet.birthDate).toISOString().split('T')[0]
          : '',
        email: dataGet.email || '',
        phone: dataGet.phone || '',
      });
    }
  }, [dataGet]);

  async function onSubmit({ name, phone, email, birthDate }: ClientFormData) {
    const [data, error] = await executePost({
      id: id === '0' ? undefined : id,
      name,
      phone,
      email,
      birthDate,
    });
    if (error) {
      openError(
        error.message || 'Erro desconhecido no cadastro.',
        'Atenção!',
        'error'
      );
      return;
    }
    onSuccess();
  }

  return (
    <DefaultLayout>
      <Form {...methods}>
        <form
          className="flex flex-col w-full gap-6"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Title styled="form" label="Cadastro de clientes">
            <div className="flex gap-2 py-2 md:py-0 w-full justify-between md:justify-end">
              <Button
                type="submit"
                className="w-32"
                disabled={isPendingPost || isPendingGet}
              >
                Salvar
              </Button>
              <ButtonLink
                variant="outline"
                url={backUrl}
                label="Cancelar"
                className="w-32"
                disabled={isPendingPost || isPendingGet}
              />
            </div>
          </Title>

          <div className="flex flex-col w-full px-2">
            <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="xl:col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        {...field}
                        disabled={isPendingPost || isPendingGet}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="xl:col-span-1">
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input
                        id="birthDate"
                        {...field}
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        disabled={isPendingPost || isPendingGet}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="xl:col-span-2">
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        {...field}
                        icon={Mail}
                        disabled={isPendingPost || isPendingGet}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="xl:col-span-1">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        {...field}
                        onBlur={e => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        disabled={isPendingPost || isPendingGet}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </DefaultLayout>
  );
}
