import { UserPlan } from '@/_components/layout/plans/users';
import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { CardUpgradeItem } from '@/_components/ui/cardUpgrade';
import { Activity, Apple, Dumbbell, MessageCircle } from 'lucide-react';

export default function Users() {
  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/users.png')] bg-contain bg-no-repeat bg-left">
          <div className="flex flex-col items-end font-bold w-full text-base md:text-3xl lg:text-5xl 2xl:text-7xl">
            <span className="w-56 sm:w-[70%] text-right">
              Cuide da sua saúde com mais clareza e motivação
            </span>
          </div>
          <div className="flex flex-col items-end italic text-[0.85rem] md:text-xl lg:text-2xl 2xl:text-4xl">
            <span className="w-48 sm:w-[70%] text-right">
              Acompanhe treinos, alimentação e evolução em um só lugar. Tenha o
              apoio de profissionais e veja seus resultados acontecerem de forma
              simples e organizada.
            </span>
          </div>
          <div className="flex flex-row justify-end md:flex-row w-full mb-2">
            <Button
              size="lg"
              className="w-52 md:w-64 text-lg md:text-xl p-6 md:p-8"
            >
              Crie sua conta gratuita
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 md:flex-row items-stretch justify-center w-full bg-(--background-secondary) p-4 gap-3 h-full">
        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <Dumbbell className="size-6" />
            Treinos personalizados
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Visualize seus treinos, receba atualizações em tempo real e acompanhe seu progresso de forma prática e motivadora." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <Apple className="size-6" />
            Nutrição sob medida
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Tenha acesso aos planos alimentares criados pelo seu nutricionista e registre suas refeições com facilidade." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <Activity className="size-6" />
            Evolução em tempo real
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Acompanhe medidas, peso, metas e relatórios de progresso." />
            <CardUpgradeItem label="Veja sua evolução e mantenha o foco nos resultados." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <MessageCircle className="size-6" />
            Conexão com profissionais
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Converse com seu treinador e nutricionista em um único lugar." />
            <CardUpgradeItem label="Receba lembretes, notificações e mensagens de incentivo." />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <span className="w-full text-center italic md:text-left text-2xl">
            Cuide do seu corpo e da sua mente com praticidade e motivação.
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 bg-primary items-center justify-center content-center">
        <span className="w-full text-xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center text-secondary">
          Planos
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full p-4 md:p-8 gap-4 md:gap-10">
        <UserPlan information />
      </div>
    </div>
  );
}
