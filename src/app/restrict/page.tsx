import DefaultLayout from '@/_components/layout/defaultLayout';
import { Button } from '@/_components/ui/button';

export default function Home() {
  return (
    <DefaultLayout>
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
          Comece agoradd
        </Button>
      </div>
    </DefaultLayout>
  );
}
