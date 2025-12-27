'use client';

import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { InputPassword } from '@/_components/ui/inputPass';
import { APP_ROUTES } from '@/_constants/routes';
import { useAlertHook } from '@/_hooks/alert_hook';
import { AppError } from '@/_lib/AppError';
import { signInFormDate, signInSchema } from '@/_schema/signin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

export function LoginByAccount() {
  const { openError } = useAlertHook();
  const methods = useForm<signInFormDate>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isPending] = useTransition();

  async function submitSignIn({ email, password }: signInFormDate) {
    try {
      const resp = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: APP_ROUTES.ROUTE_PRIVATE,
      });

      if (!resp.ok || resp.error) {
        const errorMessage =
          resp.error === 'CredentialsSignin'
            ? 'Credenciais inválidas. Verifique seu email e senha.'
            : resp.error || 'Falha ao autenticar com email e senha';

        openError(errorMessage, 'Atenção!', 'error');
        return;
      }
      if (resp.url) {
        window.location.href = resp.url;
      }
    } catch (error) {
      const mensagem =
        error instanceof AppError
          ? error.message
          : 'Falha ao autenticar o usuário.';

      openError(mensagem, 'Atenção!', 'error');
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitSignIn)}
        className="flex flex-col w-full"
      >
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail:</FormLabel>
              <FormControl>
                <Input id="email" {...field} icon={Mail} disabled={isPending} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha:</FormLabel>
              <FormControl>
                <InputPassword id="password" {...field} disabled={isPending} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 w-full" disabled={isPending}>
          Entrar
        </Button>
      </form>
    </Form>
  );
}
