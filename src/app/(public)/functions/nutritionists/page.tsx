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
  title: 'Funcionalidades para Nutricionistas',
  description:
    'Prescreva cardápios, acompanhe pacientes e organize sua gestão financeira em um só lugar. Conheça os planos e recursos da Vita Flow para nutricionistas.',
};

export default async function Nutritionists() {
  const [productsPlans] = await actionGetProductsPlans();
  const plans = productsPlans || [];

  const nutritionistPlanGroup = plans.find(
    plan => plan.name === 'Nutricionistas'
  );
  const nutritionistProducts = nutritionistPlanGroup?.products || [];

  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/doctor.png')] bg-contain bg-no-repeat bg-right motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <h1 className="flex flex-col w-56 sm:w-[70%] font-bold text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
            Transforme seu atendimento nutricional em uma experiência completa
          </h1>
          <p className="flex flex-col w-56 sm:w-[60%] italic text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
            Prescreva, acompanhe e cresça com uma plataforma feita sobre medida
            para nutricionistas modernos.
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
            Prescreva cardápios e planos alimentares personalizados em minutos.
            Visualize a evolução nutricional com gráficos automáticos.
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
            Controle recebimentos, pacotes de consultas e histórico de
            pagamentos dos pacientes. Tenha clareza total sobre o fluxo
            financeiro do seu consultório.
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
            Comunicação direta com pacientes. Relatórios de evolução e
            acompanhamento de metas.
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
            Centralize planos, consultas, medidas e relatórios. Acesse de
            qualquer dispositivo.
          </CardContent>
        </Card>
      </div>
      <WaveDivider fill="var(--background)" flip className="-mt-px" />
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <p className="w-full text-center italic md:text-left text-2xl text-muted-foreground">
            Simplifique sua rotina, aumente sua produtividade e ofereça um
            atendimento excepcional.
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
            &quot;Prescrever cardápios ficou muito mais rápido. Consigo focar no
            que importa: o acompanhamento de perto de cada paciente.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-secondary text-xs font-bold">
              MF
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Marina Fontes</p>
              <p className="text-muted-foreground text-xs">
                Nutricionista clínica
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
            &quot;A gestão financeira sozinha já pagou a assinatura. Nunca mais
            perdi o controle de pagamentos em atraso.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-accent text-xs font-bold">
              RN
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Rafael Nogueira</p>
              <p className="text-muted-foreground text-xs">
                Nutricionista esportivo
              </p>
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
        {nutritionistProducts
          .sort((a, b) => a.price - b.price)
          .map((product, index, sorted) => (
            <UpgradeCard
              key={product.id}
              title={product.name}
              value={product.price}
              information={true}
              active={false}
              featured={sorted.length > 1 && index === sorted.length - 1}
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
            name: 'Vita Flow para Nutricionistas',
            description:
              'Prescreva cardápios, acompanhe pacientes e gerencie sua gestão financeira em um só lugar.',
            offers: nutritionistProducts.map(product => ({
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
