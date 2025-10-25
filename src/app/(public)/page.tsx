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
            <Button
              size="lg"
              className="w-full md:w-64 text-lg md:text-xl p-6 md:p-8"
            >
              Comece agora
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex flex-col pr-16">
          <Image src={CelPhone} height={450} alt="VitaFlow" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full bg-(--background-secondary) p-4 md:p-8 gap-4 md:gap-10">
        <Link href="/functions" className="w-full md:w-1/4 h-full">
          <Card className="hover:shadow-md active:scale-[0.98] transition-all">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <TrophyIcon className="size-10" />
              </div>
              <CardTitle className="text-xl">Educadores físicos</CardTitle>
            </CardHeader>
            <CardContent className="sm:h-36">
              <p className="text-lg italic text-justify">
                Planeje, acompanhe e motive seus alunos com uma plataforma
                inteligente feita para educadores físicos que buscam eficiência
                e resultados.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/functions/nutritionists"
          className="w-full md:w-1/4 h-full"
        >
          <Card className="hover:shadow-md active:scale-[0.98] transition-all">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <ClipboardList className="size-10" />
              </div>
              <CardTitle className="text-xl">Nutricionistas</CardTitle>
            </CardHeader>
            <CardContent className="sm:h-36">
              <p className="text-lg italic text-justify">
                Prescreva, acompanhe e cresça com uma plataforma feita sobre
                medida para nutricionistas modernos.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/functions/users" className="w-full md:w-1/4 h-full">
          <Card className="hover:shadow-md active:scale-[0.98] transition-all">
            <CardHeader className="flex items-center gap-4">
              <div className="flex items-center justify-center content-center bg-secondary p-4 rounded-2xl">
                <UserRound className="size-10" />
              </div>
              <CardTitle className="text-xl">Usuários</CardTitle>
            </CardHeader>
            <CardContent className="sm:h-36">
              <p className="text-lg italic text-justify">
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
