import type { NutritionistMirror } from '@/_types/professionalMirror';
import {
  CalendarClock,
  ClipboardList,
  NotebookText,
  Receipt,
  UtensilsCrossed,
} from 'lucide-react';
import { MirrorAnamneseCard } from './mirrorAnamneseCard';
import { MirrorAssessmentCard } from './mirrorAssessmentCard';
import { MirrorIdentityCard } from './mirrorIdentityCard';
import { MirrorMealPlanCard } from './mirrorMealPlanCard';
import { MirrorSectionCard } from './mirrorSectionCard';

interface NutritionistMirrorViewProps {
  mirror: NutritionistMirror;
}

export function NutritionistMirrorView({
  mirror,
}: NutritionistMirrorViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <MirrorIdentityCard
        professional={mirror.professional}
        type="NUTRITIONIST"
      />
      <section aria-label="Registro" className="grid gap-4 sm:grid-cols-2">
        {mirror.anamnese ? (
          <MirrorAnamneseCard anamnese={mirror.anamnese} />
        ) : (
          <MirrorSectionCard
            title="Anamnese"
            icon={NotebookText}
            emptyMessage="Sua nutricionista ainda não preencheu a anamnese."
          />
        )}
        {mirror.assessmentHistory.length > 0 ? (
          <MirrorAssessmentCard
            assessments={mirror.assessmentHistory}
            title="Histórico de avaliações"
          />
        ) : (
          <MirrorSectionCard
            title="Histórico de avaliações"
            icon={ClipboardList}
            emptyMessage="Nenhuma avaliação registrada ainda."
          />
        )}
        {mirror.mealPlan ? (
          <MirrorMealPlanCard mealPlan={mirror.mealPlan} />
        ) : (
          <MirrorSectionCard
            title="Plano alimentar"
            icon={UtensilsCrossed}
            emptyMessage="Sua nutricionista ainda não configurou um plano alimentar."
          />
        )}
        <MirrorSectionCard
          title="Próxima consulta"
          icon={CalendarClock}
          emptyMessage="Nenhuma consulta agendada ainda."
        />
        <MirrorSectionCard
          title="Cobrança"
          icon={Receipt}
          emptyMessage="Nenhuma cobrança configurada ainda."
        />
      </section>
    </div>
  );
}
