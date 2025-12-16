'use client';

import { actionSignUp } from '@/_actions/signup';
import { Logo } from '@/_components/layout/logo';
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
import { InputPassword } from '@/_components/ui/inputPass';
import { Title } from '@/_components/ui/title';
import { APP_ROUTES } from '@/_constants/routes';
import { useAlertHook } from '@/_hooks/alert_hook';
import { signUpFormData, signUpSchema } from '@/_schema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export default function Home() {
  const { isPending, execute } = useServerAction(actionSignUp);
  const router = useRouter();
  const { openError } = useAlertHook();

  const methods = useForm<signUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      checkPassword: '',
    },
  });

  async function submitSignUp(values: signUpFormData) {
    const [data, error] = await execute(values);
    if (error) {
      openError(
        error.message || 'Erro desconhecido no cadastro.',
        'Atenção!',
        'error'
      );
      return;
    }

    if (data) {
      openError(
        'As instruções de ativação foram enviadas para o seu e-mail.',
        'Cadastro realizado com sucesso!',
        'success'
      );
      router.push(APP_ROUTES.SIGN_IN);
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center content-center p-4">
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right border-[1px]">
        <div className="w-full h-full relative hidden lg:block border-none border-l-8">
          <Image src="/signin.png" alt="signin" fill />
        </div>
        <div className="flex flex-col w-full gap-6 p-4 md:p-10 py-6 md:py-16 justify-center items-center">
          <Logo className="w-64 md:w-80" />

          <Title
            label="Crie sua conta"
            size="h1"
            className="mb-4"
            titlePosition="center"
          />

          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(submitSignUp)}
              className="flex flex-col w-full"
            >
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome:</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} disabled={isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail:</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        {...field}
                        icon={Mail}
                        disabled={isPending}
                      />
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
                      <InputPassword
                        id="password"
                        {...field}
                        disabled={isPending}
                      />
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
                      <InputPassword
                        id="checkPassword"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                Entrar
              </Button>
            </form>
          </Form>
          <ButtonLink
            variant="link"
            url="/signin"
            label="Voltar para o login"
            icon={ArrowLeft}
          />
        </div>
      </div>
    </div>
  );
}
