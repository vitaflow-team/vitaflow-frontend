'use server';

import { actionGetProductsPlans } from '@/_actions/products/getProdductsPlans';
import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';
import {
  ClipboardList,
  HandCoins,
  HeartHandshakeIcon,
  Wallet,
} from 'lucide-react';

export default async function Functions() {
  const [productsPlans, err] = await actionGetProductsPlans();
  const plans = productsPlans || [];

  const personalPlanGroup = plans.find(
    plan => plan.name === 'Educadores físicos'
  );
  const personalProducts = personalPlanGroup?.products || [];

  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/personal.png')] bg-size-[60%] sm:bg-size-[25%] md:bg-contain bg-no-repeat bg-bottom-right">
          <div className="flex flex-col w-[65%] font-bold text-base md:text-3xl lg:text-5xl 2xl:text-7xl">
            <span>
              Potencialize seus treinos e transforme o acompanhamento dos seus
              alunos
            </span>
          </div>
          <div className="flex flex-col w-48 sm:w-[50%] italic text-xs md:text-xl lg:text-2xl 2xl:text-4xl">
            <span>
              Planeje, acompanhe e motive seus alunos com uma plataforma
              inteligente feita para educadores físicos que buscam eficiência e
              resultados.
            </span>
          </div>
          <div className="flex flex-row md:flex-row w-full mb-2">
            <Button
              size="lg"
              className="w-48 md:w-64 text-lg md:text-xl p-6 md:p-8"
            >
              Experimente agora
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 md:flex-row items-stretch justify-center w-full bg-(--background-secondary) p-4 gap-3 h-full">
        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <ClipboardList className="size-6" />
            Atendimento inteligente
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Organize treinos, acompanhe resultados e entregue planos personalizados com facilidade." />
            <CardUpgradeItem label="Com o VitaFlow, você centraliza o progresso dos alunos e oferece uma experiência moderna e motivadora." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <Wallet className="size-6" />
            Gestão financeira
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Controle seus recebimentos, mensalidades e pacotes de treinos em um só lugar." />
            <CardUpgradeItem label="Visualize relatórios e tenha clareza sobre o fluxo financeiro do seu negócio." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <HeartHandshakeIcon className="size-6" />
            Relacionamento e fidelização
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Acompanhe o desempenho dos alunos, envie mensagens automáticas e mantenha o engajamento alto." />
            <CardUpgradeItem label="Transforme cada treino em uma oportunidade de fidelizar seus clientes." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <HandCoins className="size-6" />
            Tudo em um só lugar
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Agenda, treinos, pagamentos e comunicação — tudo integrado." />
            <CardUpgradeItem label="Menos tempo com planilhas, mais tempo com o que realmente importa: seus alunos." />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <span className="w-full text-center italic md:text-left text-2xl">
            Transforme treinos em resultados e conquiste mais alunos com
            praticidade e performance.
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 bg-primary items-center justify-center content-center">
        <span className="w-full text-xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center text-secondary">
          Planos
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full p-4 md:p-8 gap-4 md:gap-10">
        {personalProducts.map(product => (
          <CardUpgrade
            key={product.id}
            title={product.name}
            value={product.price}
            information={true}
            active={false}
            itens={product.productInfos.map(info => info.description)}
          />
        ))}
      </div>
    </div>
  );
}
