'use client';

import { actionSignUp } from '@/_actions/users/postSignup';
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
import { useAlertHook } from '@/_hooks/alertHook';
import { signUpFormData, signUpSchema } from '@/_schema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

export function SignupForm() {
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
    <main
      id="main-content"
      className="flex flex-col w-full min-h-dvh items-center justify-center content-center p-4"
    >
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 rounded-2xl overflow-hidden shadow-lg border border-secondary">
        <div className="relative w-full h-full hidden lg:block">
          <Image
            src="/signin.png"
            alt="Itens de treino e acompanhamento nutricional: kettlebell, tênis, fita métrica, caderno, estetoscópio e calculadora"
            fill
            className="object-cover grayscale contrast-125"
          />
          {/* Duotone nas cores da marca — a foto original é em tons de roxo, fora da
              paleta; mix-blend-color troca o matiz pelo gradiente mantendo a luminosidade
              da foto (por isso a imagem acima também vai em grayscale). */}
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              backgroundImage:
                'linear-gradient(160deg, hsl(49 14% 20%) 0%, hsl(43 30% 45%) 55%, hsl(48 45% 68%) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 text-secondary text-lg font-semibold italic">
            Comece hoje a acompanhar sua evolução com o apoio de quem entende.
          </p>
        </div>
        <div className="flex flex-col w-full gap-6 p-6 md:p-10 py-6 md:py-16 justify-center items-center bg-[url('/backgroundLogo.svg')] bg-cover bg-no-repeat bg-right">
          <Logo className="w-56 md:w-72" />

          <Title
            label="Crie sua conta gratuita"
            size="h1"
            className="mb-2"
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
                      <Input {...field} disabled={isPending} />
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
                      <Input {...field} icon={Mail} disabled={isPending} />
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

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                Criar conta
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
    </main>
  );
}
