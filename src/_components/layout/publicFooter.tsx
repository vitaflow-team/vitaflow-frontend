import { Logo } from '@/_components/layout/logo';
import { cn } from '@/_lib/utils';
import { Great_Vibes } from 'next/font/google';
import { Rights } from './rights';

const fontGreat = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
});

export function PublicFooter() {
  return (
    <footer className="relative flex flex-col w-full border-t-[1px] border-secondary">
      <div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-4 py-3 w-full">
        <div className="flex flex-col gap-4 p-4 justify-center items-center text-primary">
          <Logo className="w-80" />
          <span
            className={cn('text-xl lg:text-2xl font-bold', fontGreat.className)}
          >
            Cuide da sua saúde de forma fácil e eficiente.
          </span>
        </div>
        <p className="hidden xl:block">Footer</p>
        <p className="hidden xl:block">Footer</p>
        <p className="hidden sm:block">Footer</p>
      </div>
      <Rights />
    </footer>
  );
}
