import { Button } from '@/_components/ui/button';
import { Card, CardContent, CardTitle } from '@/_components/ui/card';
import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';
import {
  ClipboardList,
  HandCoins,
  HeartHandshakeIcon,
  Wallet,
} from 'lucide-react';

export default function Nutritionists() {
  return (
    <div>
      <div className="flex flex-col w-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
        <div className="flex flex-col gap-6 w-full py-3 md:py-5 bg-[url('/doctor.png')] bg-contain bg-no-repeat bg-right">
          <div className="flex flex-col w-56 sm:w-[70%] font-bold text-base md:text-3xl lg:text-5xl 2xl:text-7xl">
            <span>
              Transforme seu atendimento nutricional em uma experiência completa
            </span>
          </div>
          <div className="flex flex-col w-56 sm:w-[60%] italic text-[0.85rem] md:text-xl lg:text-2xl 2xl:text-4xl">
            <span>
              Prescreva, acompanhe e cresça com uma plataforma feita sobre
              medida para nutricionistas modernos.
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
            <CardUpgradeItem label="Prescreva cardápios e planos alimentares personalizados em minutos." />
            <CardUpgradeItem label="Visualize a evolução nutricional com gráficos automáticos." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <Wallet className="size-6" />
            Gestão financeira
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Prescreva cardápios e planos alimentares personalizados em minutos." />
            <CardUpgradeItem label="Visualize a evolução nutricional com gráficos automáticos." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <HeartHandshakeIcon className="size-6" />
            Relacionamento e fidelização
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Comunicação direta com pacientes." />
            <CardUpgradeItem label="Relatórios de evolução e acompanhamento de metas." />
          </CardContent>
        </Card>

        <Card className="flex flex-col w-full p-0 gap-0 bg-transparent">
          <CardTitle className="w-full rounded-t-md bg-primary p-2 px-3 flex gap-2 text-secondary tracking-wider text-base">
            <HandCoins className="size-6" />
            Tudo em um só lugar
          </CardTitle>
          <CardContent className="flex flex-col rounded-b-md p-4 gap-2 text-base h-full border-2 border-primary">
            <CardUpgradeItem label="Centralize planos, consultas, medidas e relatórios." />
            <CardUpgradeItem label="Acesse de qualquer dispositivo." />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex w-full md:w-5/6 flex-col gap-4 p-4 md:p-10">
          <span className="w-full text-center italic md:text-left text-2xl">
            Simplifique sua rotina, aumente sua produtividade e ofereça um
            atendimento excepcional.
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 bg-primary items-center justify-center content-center">
        <span className="w-full text-xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center text-secondary">
          Planos
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full p-4 md:p-8 gap-4 md:gap-10">
        <CardUpgrade title="Profissional" value={79.9} information>
          <CardUpgradeItem label="Cadastro ilimitado de pacientes" />
          <CardUpgradeItem label="Prescrição de cardápios e planos alimentares personalizados" />
          <CardUpgradeItem label="Registro e acompanhamento de medidas nutricionais (peso, circunferências, dobras cutâneas)" />
          <CardUpgradeItem label="Agenda para consultas presenciais ou online" />
          <CardUpgradeItem label="Relatórios de evolução nutricional para pacientes" />
        </CardUpgrade>

        <CardUpgrade title="Premium" value={129.9} information>
          <CardUpgradeItem label="Todas as funcionalidades do plano anterior" />
          <CardUpgradeItem label="Gestão financeira: contas a receber, histórico de pagamentos dos alunos" />
          <CardUpgradeItem label="Integração com PIX e emissão de recibos" />
          <CardUpgradeItem label="Lembretes automáticos de consulta e pagamento para pacientes" />
          <CardUpgradeItem label="Criação de grupos de acompanhamento (ex: desafio de emagrecimento)" />
          <CardUpgradeItem label="Gráficos comparativos de evolução de grupos" />
        </CardUpgrade>
      </div>
    </div>
  );
}
