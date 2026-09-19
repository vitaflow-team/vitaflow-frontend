import { Card, CardContent } from '@/_components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import ErroPage from '../../public/error.png';

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-dvh items-center justify-center content-center p-4">
      <Card className="flex md:flex-row p-8 gap-10 items-center justify-center content-center">
        <Image src={ErroPage} height={230} alt="" className="hidden md:block" />
        <div className="flex flex-col h-full items-center gap-4 w-full justify-between">
          <Image
            src="/vitaflow.svg"
            alt="Vita Flow"
            width={300}
            height={150}
            priority
          />

          <CardContent className="flex flex-col items-center gap-4 w-full justify-center">
            <div className="text-lg italic w-full h-full text-center content-center">
              <h2>Página não encontrada</h2>
              <p>Não encontramos o recurso que você está procurando.</p>
            </div>
          </CardContent>
          <div className="p-4 hover:border-b-2 h-10">
            <Link href="/" className="text-primary font-semibold">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
