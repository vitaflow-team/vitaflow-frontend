import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { ClipboardList, TrophyIcon, UserRound } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full p-4 md:p-10 md:py-16 bg-[url('/backgroundLogo.svg')] bg-cover bg-no-repeat bg-right gap-4">
        <div className="flex flex-col w-full gap-6">
          <span className="w-full font-bold text-4xl md:text-6xl lg:text-7xl">Saúde personalizada,<br />vida equilibrada</span>
          <span className="w-full italic text-md md:text-3xl">Gestão integrada para treinos,<br />nutrição e evolução.</span>
          <div className="flex flex-row-reverse md:flex-row w-full ">
            <Button size="lg" className="text-lg md:text-xl">Comece agora</Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col w-full">
          imagem
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full bg-[var(--background-secondary)] p-4 md:p-8 gap-4 md:gap-10">
        <Card className="w-full md:w-1/4 h-full">
          <CardHeader className="flex items-center gap-4">
            <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-full">
              <TrophyIcon className="size-10" />
            </div>
            <CardTitle className="text-xl">Educadores físicos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic">Crie treinos, defina metas e acompanhe medidas.</p>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/4 h-full">
          <CardHeader className="flex items-center gap-4">
            <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-full">
              <ClipboardList className="size-10" />
            </div>
            <CardTitle className="text-xl">Nutricionistas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic">Prescrição de cardápios, evolução nutricional e registro de medidas.</p>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/4 h-full">
          <CardHeader className="flex items-center gap-4">
            <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-full">
              <UserRound className="size-10" />
            </div>
            <CardTitle className="text-xl">Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic">Visualize seu plano alimentar, receba notificação, acompanhe sua evolução.</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-10 gap-4">
        <div className="flex flex-col w-2/3 text-primary font-bold text-4xl gap-4">
          <span className="w-full text-4xl md:text-6xl lg:text-7xl">Acompanhe sua evolução de forma clara e motivadora</span>
          <span className="w-full italic text-md md:text-3xl">Relatórios personalizados para profissionais e usuários.</span>
        </div>
        <span className="w-1/3 text-primary font-bold text-4xl">Gráfico</span>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 gap-4 bg-primary">
        <span className="w-full text-xl md:text-6xl text-center text-secondary">Pronto para transformar sua saúde?</span>
      </div>
    </div>
  );
}
