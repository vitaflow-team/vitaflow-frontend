import type { EducatorMirror } from '@/_types/professionalMirror';
import { CalendarClock, ClipboardList, Dumbbell, Receipt } from 'lucide-react';
import { MirrorAssessmentCard } from './mirrorAssessmentCard';
import { MirrorIdentityCard } from './mirrorIdentityCard';
import { MirrorSectionCard } from './mirrorSectionCard';

interface EducatorMirrorViewProps {
  mirror: EducatorMirror;
}

export function EducatorMirrorView({ mirror }: EducatorMirrorViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <MirrorIdentityCard
        professional={mirror.professional}
        type="PHYSICAL_EDUCATOR"
      />
      <section
        aria-label="Seções ainda não configuradas"
        className="grid gap-4 sm:grid-cols-2"
      >
        <MirrorSectionCard
          title="Treino de hoje"
          icon={Dumbbell}
          emptyMessage="Seu educador físico ainda não configurou o treino de hoje."
        />
        <MirrorSectionCard
          title="Próximo horário"
          icon={CalendarClock}
          emptyMessage="Nenhum horário agendado ainda."
        />
        {mirror.physicalAssessment ? (
          <MirrorAssessmentCard assessments={mirror.physicalAssessment} />
        ) : (
          <MirrorSectionCard
            title="Avaliação física"
            icon={ClipboardList}
            emptyMessage="Nenhuma avaliação física registrada ainda."
          />
        )}
        <MirrorSectionCard
          title="Cobrança"
          icon={Receipt}
          emptyMessage="Nenhuma cobrança configurada ainda."
        />
      </section>
    </div>
  );
}
