'use client';

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
import { singInFormDate, singInSchema } from '@/_schema/singin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();

  async function submitSingIn({ email, password }: singInFormDate) {
    const resp = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (resp?.ok) {
      router.push('/restrict');
    } else {
      console.log(resp);
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center content-center p-4">
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right border-[1px]">
        <div className="w-full h-full relative hidden lg:block border-none border-l-8">
          <Image src="/singin.png" alt="singin" fill />
        </div>
        <div className="flex flex-col w-full gap-5 p-4 md:p-10 py-12 justify-center items-center">
          <Logo className="w-64 md:w-80" />

          <Title label="Acesse sua conta" size="h1" className="mb-4" />

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

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                Entrar
              </Button>
            </form>
          </Form>
          <div className="flex flex-col items-center w-full gap-3">
            <Title label="Ou acesse com" size="h2" />
            <div className="flex gap-4">
              <Image
                src="/google.svg"
                className="bg-white p-2 border-2"
                width={50}
                height={50}
                alt="Google"
              />
              <Image
                src="/instagram.svg"
                className="bg-white p-1 border-2"
                width={50}
                height={50}
                alt="Instagram"
              />
            </div>
          </div>
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
