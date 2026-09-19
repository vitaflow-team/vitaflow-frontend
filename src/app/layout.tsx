import { AlertError } from '@/_components/ui/alert-error';
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
});

const siteUrl = 'https://vitaflow-frontend.vercel.app';

// Metadata base: cada rota pública (Home, Funcionalidades, Contato, Login, Cadastro)
// define seu próprio title/description em export const metadata, que o Next.js mescla
// com este por cima — antes disso, todas as páginas compartilhavam o mesmo título e a
// mesma description, o que o Google tratava como conteúdo duplicado entre as páginas.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vita Flow — Treinos, Nutrição e Evolução em Um Só Lugar',
    template: '%s | Vita Flow',
  },
  description:
    'A Vita Flow reúne treinos, planos alimentares e evolução em um só app. Feita para educadores físicos, nutricionistas e quem quer cuidar da própria saúde com acompanhamento real.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vita Flow',
    url: siteUrl,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vita Flow',
  url: siteUrl,
  logo: `${siteUrl}/vitaflow.svg`,
  description:
    'Plataforma que conecta educadores físicos, nutricionistas e usuários para gestão de treinos, nutrição e evolução.',
  sameAs: ['https://www.instagram.com/vitaflowapp/'],
};

import { AuthProvider } from '@/_components/providers/auth-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${fraunces.variable} font-sans antialiased max-w-full`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Pular para o conteúdo
        </a>
        <AuthProvider>
          <div className="flex w-full max-w-full h-full min-h-dvh">
            <AlertError>{children}</AlertError>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
