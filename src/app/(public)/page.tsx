import { Button } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { ClipboardList, TrophyIcon, UserRound } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import CelPhone from '../../../public/celphone.png';
import LineChart from '../../../public/line-chart.svg';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right gap-20">
        <div className="flex flex-col gap-6 p-4 md:p-10 md:py-16">
          <span className="w-full font-bold text-4xl md:text-3xl lg:text-5xl 2xl:text-7xl">
            Saúde personalizada,
            <br />
            vida equilibrada
          </span>
          <span className="w-full italic text-md md:text-xl lg:text-2xl 2xl:text-4xl">
            Gestão integrada para treinos,
            <br />
            nutrição e evolução.
          </span>
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
        </div>
        <div className="hidden md:flex flex-col pr-16">
          <Image src={CelPhone} height={450} alt="VitaFlow" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch justify-center w-full bg-(--background-secondary) p-4 lg:p-8 gap-2 lg:gap-10">
        <Link href="/functions">
          <Card className="flex flex-col w-full hover:shadow-md active:scale-[0.98] transition-all h-full">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <TrophyIcon className="size-10" />
              </div>
              <CardTitle className="text-xl">Educadores físicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic">
                Planeje, acompanhe e motive seus alunos com uma plataforma
                inteligente feita para educadores físicos que buscam eficiência
                e resultados.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/functions/nutritionists">
          <Card className="flex flex-col w-full hover:shadow-md active:scale-[0.98] transition-all h-full">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <ClipboardList className="size-10" />
              </div>
              <CardTitle className="text-xl">Nutricionistas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic">
                Prescreva, acompanhe e cresça com uma plataforma feita sobre
                medida para nutricionistas modernos.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/functions/users">
          <Card className="flex flex-col w-full hover:shadow-md active:scale-[0.98] transition-all h-full">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <UserRound className="size-10" />
              </div>
              <CardTitle className="text-xl">Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic">
                Acompanhe treinos, alimentação e evolução em um só lugar. Tenha
                o apoio de profissionais e veja seus resultados acontecerem de
                forma simples e organizada.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center content-center w-full md:w-2/6 pt-2 md:pt-0">
          <Image src={LineChart} height={450} alt="VitaFlow" />
        </div>
        <div className="flex w-full md:w-4/6 flex-col gap-4 p-4 md:p-10 md:py-16">
          <span className="w-full text-center md:text-left font-bold text-2xl md:text-3xl lg:text-5xl 2xl:text-6xl">
            Acompanhe sua evolução
            <br />
            de forma clara e motivadora
          </span>
          <span className="w-full italic text-center md:text-left text-md text-lg md:text-xl lg:text-2xl 2xl:text-4xl">
            Relatórios personalizados para
            <br />
            profissionais e usuários.
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 bg-primary items-center justify-center content-center">
        <span className="w-full text-xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center text-secondary">
          Pronto para transformar sua saúde?
        </span>
      </div>
    </div>
  );
}
