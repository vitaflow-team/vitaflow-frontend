'use client';

import { Logo } from '@/_components/layout/logo';
import { Button } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { InputPassword } from '@/_components/ui/inputPass';
import { Title } from '@/_components/ui/title';
import { singInFormDate, singInSchema } from '@/_schema/singin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

export default function Home() {
  const methods = useForm<singInFormDate>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isPending, startTransaction] = useTransition();

  function submitSingIn({ email, password }: singInFormDate) {
    startTransaction(async () => {});
  }

  return (
    <div className="flex flex-col w-full items-center justify-center content-center p-4">
      <div className="flex flex-row md:h-5/7 w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right border-[1px]">
        <div className="w-full h-full relative hidden lg:block border-none border-l-8">
          <Image src="/singin.png" alt="singin" fill />
        </div>
        <div className="flex flex-col w-full gap-6 p-4 md:p-10 py-16 justify-center items-center">
          <Logo className="w-64 md:w-80" />

          <Title size="h1" className="mb-4">
            Acesse sua conta
          </Title>

          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(submitSingIn)}
              className="flex flex-col w-full"
            >
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Informe seu e-mail"
                        {...field}
                        icon={Mail}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputPassword
                        id="password"
                        placeholder="Informe sua senha"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                Entrar
              </Button>
            </form>
          </Form>
          <div className="flex flex-col gap-3">
            <ButtonLink url="/singup" label="Não tem conta?" variant="link" />
            <ButtonLink
              variant="link"
              url="/"
              label="Voltar para a página inicial"
              icon={ArrowLeft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
