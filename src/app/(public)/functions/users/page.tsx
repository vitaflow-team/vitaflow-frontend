import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';
import { Activity, Apple, Dumbbell, MessageCircle } from 'lucide-react';

export default function Users() {
  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/users.png')] bg-contain bg-no-repeat bg-left">
          <div className="flex flex-col items-end font-bold w-full text-base md:text-3xl lg:text-5xl 2xl:text-7xl">
            <span>Cuide da sua saúde com mais</span>
            <span>clareza e motivação</span>
          </div>
          <div className="flex flex-col items-end italic text-[0.85rem] md:text-xl lg:text-2xl 2xl:text-4xl">
            <span>Acompanhe treinos, alimentação e evolução</span>
            <span>em um só lugar. Tenha o apoio de</span>
            <span>profissionais e veja seus resultados</span>
            <span>acontecerem de forma simples</span>
            <span>e organizada.</span>
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
      <div className="flex flex-col md:flex-row items-start justify-center w-full bg-(--background-secondary) p-4 md:p-8 gap-4">
        <Card className="flex w-full h-full border-2 border-primary p-0 bg-transparent">
          <div className="w-full rounded-md rounded-b-none bg-primary p-2">
            <CardTitle className="flex gap-2 text-secondary tracking-wider text-base px-1">
              <Dumbbell className="size-6" />
              Treinos personalizados
            </CardTitle>
          </div>
          <CardContent className="flex flex-col pb-4 gap-2 text-base md:h-32">
            <CardUpgradeItem label="Visualize seus treinos, receba atualizações em tempo real e acompanhe seu progresso de forma prática e motivadora." />
          </CardContent>
        </Card>

        <Card className="flex w-full h-full border-2 border-primary p-0 bg-transparent">
          <div className="w-full rounded-md rounded-b-none bg-primary p-2">
            <CardTitle className="flex gap-2 text-secondary tracking-wider text-base px-1">
              <Apple className="size-6" />
              Nutrição sob medida
            </CardTitle>
          </div>
          <CardContent className="flex flex-col pb-4 gap-2 text-base md:h-32">
            <CardUpgradeItem label="Tenha acesso aos planos alimentares criados pelo seu nutricionista e registre suas refeições com facilidade." />
          </CardContent>
        </Card>

        <Card className="flex w-full h-full border-2 border-primary p-0 bg-transparent">
          <div className="w-full rounded-md rounded-b-none bg-primary p-2">
            <CardTitle className="flex gap-2 text-secondary tracking-wider text-base px-1">
              <Activity className="size-6" />
              Evolução em tempo real
            </CardTitle>
          </div>
          <CardContent className="flex flex-col pb-4 gap-2 text-base md:h-32">
            <CardUpgradeItem label="Acompanhe medidas, peso, metas e relatórios de progresso." />
            <CardUpgradeItem label="Veja sua evolução e mantenha o foco nos resultados." />
          </CardContent>
        </Card>

        <Card className="flex w-full h-full border-2 border-primary p-0 bg-transparent">
          <div className="w-full h-10 rounded-md rounded-b-none bg-primary p-2">
            <CardTitle className="flex gap-2 text-secondary tracking-wider text-base px-1">
              <MessageCircle className="size-6" />
              Conexão com profissionais
            </CardTitle>
          </div>
          <CardContent className="flex flex-col pb-4 gap-2 text-base md:h-32">
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
        <CardUpgrade title="Gratuito" information>
          <CardUpgradeItem label="Visualização de treinos e cardápios enviados pelos profissionais" />
          <CardUpgradeItem label="Registro de medidas básicas (peso, altura, IMC)" />
          <CardUpgradeItem label="Gráficos simples de evolução" />
          <CardUpgradeItem label="Notificações sobre treinos e dieta" />
        </CardUpgrade>

        <CardUpgrade title="Premium" value={19.9} information>
          <CardUpgradeItem label="Todas as funcionalidades do plano gratuito" />
          <CardUpgradeItem label="Acesso a gráficos detalhados de evolução (antropometria, performance, nutrição)" />
          <CardUpgradeItem label="Integração com smartwatches e apps de saúde (Google Fit, Apple Health)" />
          <CardUpgradeItem label="Histórico completo de treinos e cardápios" />
          <CardUpgradeItem label="Chat ilimitado com profissionais (dentro da plataforma)" />
          <CardUpgradeItem label="Relatórios PDF para compartilhar com médico/nutricionista" />
        </CardUpgrade>
      </div>
    </div>
  );
}
