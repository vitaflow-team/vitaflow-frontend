'use client';
import { Logo } from '@/_components/layout/logo';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { LoginByAccount } from './loginByAccount';
import { LoginByGoogle } from './loginByGoogle';
import { NewPassword } from './newPassword';
import ResetPassword from './resetPassword';

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-center content-center p-4">
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right border-[1px]">
        <div className="w-full h-full relative hidden lg:block border-none border-l-8">
          <Image src="/singin.png" alt="singin" fill />
        </div>
        <div className="flex flex-col w-full gap-5 p-4 md:p-10 py-12 justify-center items-center">
          <Logo className="w-64 md:w-80" />

          <Title
            label="Acesse sua conta"
            size="h1"
            className="mb-4"
            titlePosition="center"
          />

          <LoginByAccount />
          <div className="flex flex-col items-center w-full gap-3">
            <Title
              label="Ou acesse com"
              size="h2"
              className=""
              titlePosition="center"
            />
            <div className="flex gap-4">
              <LoginByGoogle />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ButtonLink url="/singup" label="Não tem conta?" variant="link" />
            <ResetPassword />
            <ButtonLink
              variant="link"
              url="/"
              label="Voltar para a página inicial"
              icon={ArrowLeft}
            />
          </div>
        </div>
      </div>
      <NewPassword />
    </div>
  );
}
