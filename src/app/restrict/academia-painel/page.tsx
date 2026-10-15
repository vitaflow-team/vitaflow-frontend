import { PainelView } from '@/_components/academia/painelView';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { isLoadFailure, loadPainel } from '@/_lib/academiaPainel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaPainel,
};

export default async function AcademiaPainelPage() {
  await redirectUnlessAcademiaOwner();
  const painel = await loadPainel();

  return (
    <DefaultLayout>
      <Title label={PAGE_TITLES.academiaPainel} className="text-left" />
      {isLoadFailure(painel) ? (
        <p className="text-muted-foreground text-sm">
          Não foi possível carregar o Painel. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <PainelView painel={painel} />
      )}
    </DefaultLayout>
  );
}
