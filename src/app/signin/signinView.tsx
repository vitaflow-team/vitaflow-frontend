'use client';

import { Logo } from '@/_components/layout/logo';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { LoginByAccount } from './loginByAccount';
import { LoginByGoogle } from './loginByGoogle';
import { NewPasswordWrapper } from './newPasswordWrapper';
import ResetPassword from './resetPassword';

export function SigninView() {
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
            Continue acompanhando treinos, nutrição e sono — tudo em um só
            lugar.
          </p>
        </div>
        <div className="flex flex-col w-full gap-5 p-6 md:p-10 py-12 justify-center items-center bg-[url('/backgroundLogo.svg')] bg-cover bg-no-repeat bg-right">
          <Logo className="w-56 md:w-72" />

          <Title
            label="Acesse sua conta"
            size="h1"
            className="mb-2"
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
          <div className="flex flex-col gap-2 items-center">
            <ButtonLink url="/signup" label="Não tem conta?" variant="link" />
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
      <NewPasswordWrapper />
    </main>
  );
}
