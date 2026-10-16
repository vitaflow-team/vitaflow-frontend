'use client';

import { activateBackofficeStaff } from '@/_actions/backoffice/activateBackofficeStaff';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { InputPassword } from '@/_components/ui/inputPass';
import { Title } from '@/_components/ui/title';
import { FormError } from '@/_components/students/formError';
import {
  newPasswordSchema,
  type newPasswordFormData,
} from '@/_schema/newPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { ActivationBackofficeStaffSuccess } from './activationBackofficeStaffViews';

interface ActivateBackofficeStaffAccountProps {
  token: string;
}

export function ActivateBackofficeStaffAccount({
  token,
}: ActivateBackofficeStaffAccountProps) {
  const { execute, isPending, isSuccess, error } = useServerAction(
    activateBackofficeStaff
  );
  const methods = useForm<newPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', checkPassword: '' },
  });

  if (isSuccess) return <ActivationBackofficeStaffSuccess />;

  async function submit(values: newPasswordFormData) {
    await execute({ ...values, token });
  }

  return (
    <>
      <Title
        label="Defina sua senha"
        size="h1"
        className="mb-4 text-2xl"
        titlePosition="center"
      />
      <span className="text-lg w-full text-center">
        Escolha uma senha para ativar seu acesso interno da equipe Vita Flow.
      </span>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className="flex w-full flex-col gap-2"
          noValidate
        >
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <InputPassword {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="checkPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua senha:</FormLabel>
                <FormControl>
                  <InputPassword {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormError message={error ? error.message : null} />
          <Button
            type="submit"
            className="w-full py-6 text-lg"
            disabled={isPending}
          >
            {isPending ? 'Ativando...' : 'Ativar meu acesso'}
          </Button>
        </form>
      </Form>
    </>
  );
}
