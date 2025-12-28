'use client';

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
import { formatPhone } from '@/_lib/stringUtils';
import { zodResolverFixed } from '@/_lib/zodResolverHelper';
import { ClientFormData, clientSchema } from '@/_schema/client';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ClientPage({ params }: { params: { id: string } }) {
  const methods = useForm<ClientFormData>({
    resolver: zodResolverFixed(clientSchema),
    defaultValues: {
      id: undefined,
      name: '',
      birthDate: '',
      email: '',
      phone: '',
    },
  });

  const { id } = params;

  if (id !== '0') {
    console.log('buscar usuário');
  }

  return (
    <DefaultLayout>
      <Form {...methods}>
        <form className="flex flex-col w-full gap-6">
          <Title styled="form" label="Cadastro de clientes">
            <div className="flex gap-2 py-2 md:py-0 w-full justify-between md:justify-end">
              <Button type="submit" className="w-32">
                Salvar
              </Button>
              <ButtonLink
                variant="outline"
                url="/restrict/clients"
                label="Cancelar"
                className="w-32"
              />
            </div>
          </Title>

          <div className="flex flex-col w-full">
            <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="xl:col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
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
                      <Input id="email" {...field} icon={Mail} />
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
