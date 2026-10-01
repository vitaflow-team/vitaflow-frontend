import type { NutritionistMirror } from '@/_types/professionalMirror';
import { CalendarClock, Receipt, UtensilsCrossed } from 'lucide-react';
import { MirrorIdentityCard } from './mirrorIdentityCard';
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
      <section
        aria-label="Seções ainda não configuradas"
        className="grid gap-4 sm:grid-cols-2"
      >
        <MirrorSectionCard
          title="Plano alimentar"
          icon={UtensilsCrossed}
          emptyMessage="Sua nutricionista ainda não configurou um plano alimentar."
        />
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
