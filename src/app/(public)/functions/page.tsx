import { actionGetProductsPlans } from '@/_actions/products/getProdductsPlans';
import { WaveDivider } from '@/_components/layout/waveDivider';
import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { UpgradeCard } from '@/_components/upgrade/upgradeCard';
import {
  ClipboardList,
  HandCoins,
  HeartHandshakeIcon,
  StarIcon,
  Wallet,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Funcionalidades para Educadores Físicos',
  description:
    'Planeje treinos, acompanhe alunos e organize sua gestão financeira em um só lugar. Conheça os planos e recursos da Vita Flow para educadores físicos.',
};

export default async function Functions() {
  const [productsPlans] = await actionGetProductsPlans();
  const plans = productsPlans || [];

  const personalPlanGroup = plans.find(
    plan => plan.name === 'Educadores físicos'
  );
  const personalProducts = personalPlanGroup?.products || [];

  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/personal.png')] bg-size-[60%] sm:bg-size-[25%] md:bg-contain bg-no-repeat bg-bottom-right motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <h1 className="flex flex-col w-[65%] font-bold text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
            Potencialize seus treinos e transforme o acompanhamento dos seus
            alunos
          </h1>
          <p className="flex flex-col w-48 sm:w-[50%] italic text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
            Planeje, acompanhe e motive seus alunos com uma plataforma
            inteligente feita para educadores físicos que buscam eficiência e
            resultados.
          </p>
          <div className="flex flex-row md:flex-row w-full mb-2">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-48 md:w-64 text-lg md:text-xl p-6 md:p-8"
              >
                Experimente agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <WaveDivider fill="var(--background-secondary)" className="-mt-px" />
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 md:flex-row items-stretch justify-center w-full bg-(--background-secondary) p-4 gap-3 h-full">
        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <ClipboardList className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Atendimento inteligente</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Organize treinos, acompanhe resultados e entregue planos
            personalizados com facilidade. Centralize o progresso dos alunos em
            uma experiência moderna e motivadora.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <Wallet className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Gestão financeira</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Controle seus recebimentos, mensalidades e pacotes de treinos em um
            só lugar. Visualize relatórios e tenha clareza sobre o fluxo
            financeiro do seu negócio.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <HeartHandshakeIcon className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Relacionamento e fidelização</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Acompanhe o desempenho dos alunos, envie mensagens automáticas e
            mantenha o engajamento alto. Transforme cada treino em uma
            oportunidade de fidelizar seus clientes.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <HandCoins className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Tudo em um só lugar</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Agenda, treinos, pagamentos e comunicação — tudo integrado. Menos
            tempo com planilhas, mais tempo com o que realmente importa: seus
            alunos.
          </CardContent>
        </Card>
      </div>
      <WaveDivider fill="var(--background)" flip className="-mt-px" />
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <p className="w-full text-center italic md:text-left text-2xl text-muted-foreground">
            Transforme treinos em resultados e conquiste mais alunos com
            praticidade e performance.
          </p>
        </div>
      </div>
      <WaveDivider fill="var(--background-secondary)" className="-mt-px" />
      <div className="grid grid-cols-1 md:grid-cols-2 w-full p-4 md:p-8 gap-4 bg-(--background-secondary)">
        <Card className="p-5 gap-3">
          <div className="flex gap-0.5 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="size-4 fill-current" />
            ))}
          </div>
          <p className="text-sm">
            &quot;Reduzi o tempo que gastava com planilhas pela metade. Hoje
            consigo acompanhar 40 alunos com a mesma atenção que dava a
            15.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-secondary text-xs font-bold">
              PR
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Paulo Ramos</p>
              <p className="text-muted-foreground text-xs">
                Educador físico · Studio Performance
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5 gap-3">
          <div className="flex gap-0.5 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="size-4 fill-current" />
            ))}
          </div>
          <p className="text-sm">
            &quot;Meus alunos adoram ver a própria evolução no app. O
            engajamento aumentou muito depois que comecei a usar a Vita
            Flow.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-accent text-xs font-bold">
              CD
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Camila Dutra</p>
              <p className="text-muted-foreground text-xs">Personal trainer</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="w-full bg-(--background-secondary) p-4 md:p-8">
        <div className="flex flex-col md:flex-row w-full p-4 md:p-8 rounded-3xl bg-primary items-center justify-center content-center">
          <h2 className="w-full text-lg md:text-2xl lg:text-3xl 2xl:text-4xl text-center text-secondary">
            Planos
          </h2>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full p-4 md:p-8 gap-4 md:gap-10">
        {personalProducts
          .sort((a, b) => a.price - b.price)
          .map(product => (
            <UpgradeCard
              key={product.id}
              title={product.name}
              value={product.price}
              information={true}
              active={false}
              itens={product.productInfos.map(info => info.description)}
            />
          ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Vita Flow para Educadores Físicos',
            description:
              'Planeje treinos, acompanhe alunos e gerencie sua gestão financeira em um só lugar.',
            offers: personalProducts.map(product => ({
              '@type': 'Offer',
              name: product.name,
              price: product.price,
              priceCurrency: 'BRL',
            })),
          }),
        }}
      />
    </div>
  );
}
