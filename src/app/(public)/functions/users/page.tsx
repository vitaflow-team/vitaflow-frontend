import { actionGetProductsPlans } from '@/_actions/products/getProdductsPlans';
import { WaveDivider } from '@/_components/layout/waveDivider';
import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { UpgradeCard } from '@/_components/upgrade/upgradeCard';
import {
  Activity,
  Apple,
  Dumbbell,
  MessageCircle,
  StarIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Funcionalidades para Usuários',
  description:
    'Acompanhe treinos, alimentação e evolução em um só lugar, com o apoio de educadores físicos e nutricionistas reais. Conheça os planos da Vita Flow.',
};

export default async function Users() {
  const [productsPlans] = await actionGetProductsPlans();
  const plans = productsPlans || [];

  const userPlanGroup = plans.find(plan => plan.name === 'Usuário');
  const userProducts = userPlanGroup?.products || [];

  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/users.png')] bg-contain bg-no-repeat bg-left motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <h1 className="flex flex-col items-end font-bold w-full text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
            <span className="w-56 sm:w-[70%] text-right">
              Cuide da sua saúde com mais clareza e motivação
            </span>
          </h1>
          <p className="flex flex-col items-end italic text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
            <span className="w-48 sm:w-[70%] text-right">
              Acompanhe treinos, alimentação e evolução em um só lugar. Tenha o
              apoio de profissionais e veja seus resultados acontecerem de forma
              simples e organizada.
            </span>
          </p>
          <div className="flex flex-row justify-end md:flex-row w-full mb-2">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-52 md:w-64 text-lg md:text-xl p-6 md:p-8"
              >
                Crie sua conta gratuita
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
              <Dumbbell className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Treinos personalizados</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Visualize seus treinos, receba atualizações em tempo real e
            acompanhe seu progresso de forma prática e motivadora.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <Apple className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Nutrição sob medida</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Tenha acesso aos planos alimentares criados pelo seu nutricionista e
            registre suas refeições com facilidade.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <Activity className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Evolução em tempo real</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Acompanhe medidas, peso, metas e relatórios de progresso. Veja sua
            evolução e mantenha o foco nos resultados.
          </CardContent>
        </Card>

        <Card className="w-full gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
              <MessageCircle className="size-5 text-icon-accent" />
            </div>
            <CardTitle className="text-base">
              <h3 className="contents">Conexão com profissionais</h3>
            </CardTitle>
          </div>
          <CardContent className="p-0 text-sm text-muted-foreground">
            Converse com seu treinador e nutricionista em um único lugar. Receba
            lembretes, notificações e mensagens de incentivo.
          </CardContent>
        </Card>
      </div>
      <WaveDivider fill="var(--background)" flip className="-mt-px" />
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <p className="w-full text-center italic md:text-left text-2xl text-muted-foreground">
            Cuide do seu corpo e da sua mente com praticidade e motivação.
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
            &quot;Finalmente entendo minha evolução sem precisar perguntar pro
            personal toda hora. Os gráficos são claros e me mantêm
            motivada.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-secondary text-xs font-bold">
              AS
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Ana Souza</p>
              <p className="text-muted-foreground text-xs">Usuária Premium</p>
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
            &quot;Ter treino, dieta e mensagens do meu nutricionista no mesmo
            lugar mudou como eu encaro minha rotina.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center justify-center size-9 rounded-full bg-accent text-xs font-bold">
              DA
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-tight">Diego Alves</p>
              <p className="text-muted-foreground text-xs">Usuário</p>
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
        {userProducts
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
            name: 'Vita Flow para Usuários',
            description:
              'Acompanhe treinos, alimentação e evolução em um só lugar, com o apoio de profissionais reais.',
            offers: userProducts.map(product => ({
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
