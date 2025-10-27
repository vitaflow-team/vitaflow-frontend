import { Button } from '@/_components/ui/button';

import Image from 'next/image';
import CelPhone from '../../../public/celphone.png';

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
        <div className="hidden md:flex flex-col pr-16">
          <Image src={CelPhone} height={450} alt="VitaFlow" />
        </div>
      </div>
    </div>
  );
}
