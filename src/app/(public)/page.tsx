import { WaveDivider } from '@/_components/layout/waveDivider';
import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import {
  ClipboardList,
  ShieldCheck,
  TrophyIcon,
  UserRound,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';
import CelPhone from '../../../public/celphone.png';
import LineChart from '../../../public/line-chart.svg';

export const metadata: Metadata = {
  title: 'Vita Flow — Treinos, Nutrição e Evolução em Um Só Lugar',
  description:
    'A Vita Flow reúne treinos, planos alimentares e evolução em um só app. Feita para educadores físicos, nutricionistas e quem quer cuidar da própria saúde com acompanhamento real.',
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right gap-20">
        <div className="flex flex-col gap-6 p-4 md:p-10 md:py-16 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <h1 className="w-full font-bold text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
            Saúde personalizada,
            <br />
            <em className="not-italic text-primary">vida equilibrada</em>
          </h1>
          <p className="w-full italic text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
            Gestão integrada para treinos,
            <br />
            nutrição e evolução.
          </p>
          <div className="flex flex-row-reverse md:flex-row w-full">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full md:w-64 text-lg md:text-xl p-6 md:p-8"
              >
                Comece agora
              </Button>
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm text-muted-foreground pt-2">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              Dados protegidos, conforme a LGPD
            </li>
            <li className="flex items-center gap-1.5">
              <Users className="size-4 text-primary shrink-0" />
              Acompanhamento por profissionais reais
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col pr-16 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700 motion-safe:delay-150">
          <Image
            src={CelPhone}
            height={450}
            alt="Painel da Vita Flow mostrando treinos e evolução no celular"
            className="drop-shadow-2xl"
          />
        </div>
      </div>
      <WaveDivider fill="var(--background-secondary)" className="-mt-px" />
      <h2 className="sr-only">Funcionalidades para cada perfil</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch justify-center w-full bg-(--background-secondary) p-4 lg:p-8 gap-2 lg:gap-10">
        <Link
          href="/functions"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="w-full gap-3 p-5 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all h-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
                <TrophyIcon className="size-5 text-icon-accent" />
              </div>
              <CardTitle className="text-base">
                <h3 className="contents">Educadores físicos</h3>
              </CardTitle>
            </div>
            <CardContent className="p-0 text-sm text-muted-foreground">
              Planeje, acompanhe e motive seus alunos com uma plataforma
              inteligente feita para educadores físicos que buscam eficiência e
              resultados.
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/functions/nutritionists"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="w-full gap-3 p-5 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all h-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
                <ClipboardList className="size-5 text-icon-accent" />
              </div>
              <CardTitle className="text-base">
                <h3 className="contents">Nutricionistas</h3>
              </CardTitle>
            </div>
            <CardContent className="p-0 text-sm text-muted-foreground">
              Prescreva, acompanhe e cresça com uma plataforma feita sobre
              medida para nutricionistas modernos.
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/functions/users"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="w-full gap-3 p-5 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all h-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
                <UserRound className="size-5 text-icon-accent" />
              </div>
              <CardTitle className="text-base">
                <h3 className="contents">Usuários</h3>
              </CardTitle>
            </div>
            <CardContent className="p-0 text-sm text-muted-foreground">
              Acompanhe treinos, alimentação e evolução em um só lugar. Tenha o
              apoio de profissionais e veja seus resultados acontecerem de forma
              simples e organizada.
            </CardContent>
          </Card>
        </Link>
      </div>
      <WaveDivider fill="var(--background)" flip className="-mt-px" />
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center content-center w-full md:w-2/6 pt-2 md:pt-0">
          <Image
            src={LineChart}
            height={450}
            alt="Gráfico de evolução de treino, nutrição e sono ao longo das semanas"
          />
        </div>
        <div className="flex w-full md:w-4/6 flex-col gap-4 p-4 md:p-10 md:py-16">
          <h2 className="w-full text-center md:text-left font-bold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
            Acompanhe sua evolução
            <br />
            de forma clara e motivadora
          </h2>
          <p className="w-full italic text-center md:text-left text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
            Relatórios personalizados para
            <br />
            profissionais e usuários.
          </p>
        </div>
      </div>
      <WaveDivider fill="var(--background-secondary)" className="-mt-px" />
      {/* Autoridade + SEO: conteúdo próprio respondendo dúvidas reais (E-E-A-T) e a
          marcação FAQPage abaixo — o site não tinha nenhum dado estruturado (Schema.org). */}
      <div className="flex flex-col w-full gap-4 p-4 md:p-10 bg-(--background-secondary)">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Antes de começar, tire suas dúvidas
        </h2>
        <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
          {faqItems.map(item => (
            <details
              key={item.question}
              className="group rounded-md border-2 border-primary bg-background px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {item.question}
                <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="pt-2 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
      <div className="w-full bg-(--background-secondary) p-4 md:p-10">
        <div
          className="relative flex flex-col gap-4 w-full overflow-hidden rounded-3xl p-8 md:p-14 items-center justify-center content-center bg-primary shadow-lg"
          style={{
            backgroundImage:
              'radial-gradient(560px 300px at 15% 0%, color-mix(in oklch, var(--secondary) 35%, transparent), transparent 60%), radial-gradient(480px 260px at 90% 100%, color-mix(in oklch, var(--secondary) 20%, transparent), transparent 60%)',
          }}
        >
          <h2 className="relative w-full text-lg md:text-2xl lg:text-3xl 2xl:text-4xl text-center text-secondary">
            Pronto para transformar sua saúde?
          </h2>
          <p className="relative text-center text-secondary/80 max-w-md">
            Crie sua conta gratuita e comece a acompanhar sua evolução com o
            apoio de quem entende.
          </p>
          <Link href="/signup" className="relative">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg md:text-xl p-6 md:p-8"
            >
              Criar minha conta
            </Button>
          </Link>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}

const faqItems = [
  {
    question: 'A Vita Flow substitui meu nutricionista ou educador físico?',
    answer:
      'Não. A Vita Flow é a ferramenta que conecta você ao seu profissional — ela organiza treinos, planos alimentares e evolução, mas o acompanhamento continua sendo feito por um educador físico ou nutricionista de verdade.',
  },
  {
    question: 'Preciso ser profissional para usar a plataforma?',
    answer:
      'Não. Educadores físicos e nutricionistas usam a Vita Flow para gerenciar alunos e pacientes, mas qualquer pessoa pode criar uma conta gratuita como usuária e acompanhar a própria evolução.',
  },
  {
    question: 'Meus dados de saúde ficam seguros?',
    answer:
      'Sim. Os dados são armazenados de forma criptografada e tratados conforme a LGPD (Lei Geral de Proteção de Dados) — você pode solicitar a exclusão das suas informações a qualquer momento.',
  },
  {
    question: 'Posso cancelar um plano pago quando quiser?',
    answer:
      'Sim. Os planos Profissional e Premium podem ser cancelados a qualquer momento, sem multa e sem fidelidade.',
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer:
      'Não. A Vita Flow funciona direto pelo navegador, no computador ou no celular, sem necessidade de instalar nada.',
  },
];
