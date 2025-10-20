import { Card, CardContent } from '@/_components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import ErroPage from '../../public/error.png';

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-dvh items-center justify-center content-center">
      <Card className="flex md:flex-row p-8 gap-10 bg-white items-center justify-center content-center">
        <Image
          src={ErroPage}
          height={230}
          alt="Page not found."
          className="hidden md:block"
        />
        <div className="flex flex-col h-full items-center gap-4 w-full justify-between">
          <Image
            src="/vitaflow.svg"
            alt="Vitaflow"
            width={300}
            height={150}
            priority
          />

          <CardContent className="flex flex-col items-center gap-4 w-full justify-center">
            <p className="text-lg italic w-full h-full text-center content-center text-black">
              <h2>Page not found.</h2>
              <p>Could not find requested resource.</p>
            </p>
          </CardContent>
          <div className="p-4 hover:border-b-2 h-10">
            <Link href="/" className="text-black">
              Return
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
