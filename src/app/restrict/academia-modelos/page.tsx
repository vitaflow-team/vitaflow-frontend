import { TemplatesPanel } from '@/_components/clinicalRecords/templatesPanel';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import {
  isLoadFailure,
  loadAcademiaTemplates,
} from '@/_lib/academiaClinicalRecordsData';
import { ACADEMIA_CLINICAL_RECORDS_ACTIONS } from '@/_lib/academiaClinicalRecordsActions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaModelos,
};

/** The academia's shared template catalog, owner/manager only (ADR-004/US-024). */
export default async function AcademiaModelosPage() {
  await redirectUnlessAcademiaOwner();

  const [anamnese, assessment] = await Promise.all([
    loadAcademiaTemplates('ANAMNESE'),
    loadAcademiaTemplates('ASSESSMENT'),
  ]);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Modelos</h1>
        <p className="text-sm text-muted-foreground">
          Estes modelos são usados por você e por todos os educadores vinculados
          à academia para os alunos da academia — nunca pelos alunos
          particulares de cada educador.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {isLoadFailure(anamnese) ? (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os modelos de anamnese.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Anamnese</span>
              <TemplatesPanel
                purpose="ANAMNESE"
                templates={anamnese}
                actions={ACADEMIA_CLINICAL_RECORDS_ACTIONS.template}
              />
            </div>
          )}
          {isLoadFailure(assessment) ? (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os modelos de avaliação.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Avaliação</span>
              <TemplatesPanel
                purpose="ASSESSMENT"
                templates={assessment}
                actions={ACADEMIA_CLINICAL_RECORDS_ACTIONS.template}
              />
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
