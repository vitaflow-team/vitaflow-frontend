import DefaultLayout from '@/_components/layout/defaultLayout';
import { EngajamentoView } from '@/_components/academia-engajamento/engajamentoView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { isLoadFailure, loadEngajamento } from '@/_lib/engajamentoData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaEngajamento,
};

export default async function AcademiaEngajamentoPage() {
  await redirectUnlessAcademiaOwner();
  const summary = await loadEngajamento();

  return (
    <DefaultLayout>
      {isLoadFailure(summary) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o engajamento. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <EngajamentoView summary={summary} />
      )}
    </DefaultLayout>
  );
}
