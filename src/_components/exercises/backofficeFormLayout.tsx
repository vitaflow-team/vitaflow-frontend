import DefaultLayout from '@/_components/layout/defaultLayout';
import { EXERCISE_ROUTES } from '@/_constants/exerciseCatalog';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface BackofficeFormLayoutProps {
  title: string;
  children: ReactNode;
}

/** Frame of the backoffice create and edit screens. */
export function BackofficeFormLayout({
  title,
  children,
}: BackofficeFormLayoutProps) {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Link
          href={EXERCISE_ROUTES.BACKOFFICE}
          className="text-primary w-fit text-sm underline-offset-4 hover:underline"
        >
          ← Voltar para o catálogo
        </Link>
        <header className="border-primary border-b pb-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">
            Alterações da equipe entram no catálogo na hora, sem revisão.
          </p>
        </header>
        {children}
      </div>
    </DefaultLayout>
  );
}
