import { Logo } from '@/_components/layout/logo';
import { cn } from '@/_lib/utils';
import { Great_Vibes } from 'next/font/google';
import Link from 'next/link';
import { Rights } from './rights';

const fontGreat = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
});

const footerColumns = [
  {
    title: 'Produto',
    links: [
      { label: 'Home', url: '/' },
      { label: 'Funcionalidades', url: '/functions' },
      { label: 'Contato', url: '/contact' },
    ],
  },
  {
    title: 'Perfis',
    links: [
      { label: 'Educadores físicos', url: '/functions' },
      { label: 'Nutricionistas', url: '/functions/nutritionists' },
      { label: 'Usuários', url: '/functions/users' },
    ],
  },
  {
    title: 'Empresa',
    // TODO: estas duas ainda não existem como páginas — criar antes de publicar
    // (praticamente obrigatório para um produto que lida com dados de saúde).
    links: [
      { label: 'Política de Privacidade', url: '/privacy' },
      { label: 'Termos de Uso', url: '/terms' },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="relative flex flex-col w-full border-t-[1px] border-secondary">
      <div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-4 py-3 w-full gap-6 sm:gap-2">
        <div className="flex flex-col gap-4 p-4 justify-center items-center text-primary xl:col-span-1">
          <Logo className="w-80" />
          <span
            className={cn('text-xl lg:text-2xl font-bold', fontGreat.className)}
          >
            Cuide da sua saúde de forma fácil e eficiente.
          </span>
        </div>
        {footerColumns.map(column => (
          <div key={column.title} className="flex flex-col gap-2 px-4">
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
              {column.title}
            </span>
            {column.links.map(link => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm hover:text-primary hover:underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <Rights />
    </footer>
  );
}
