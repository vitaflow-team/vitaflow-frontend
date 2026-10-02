import type { UpcomingSlot } from '@/_types/scheduling';
import { UpcomingSlotCard } from './upcomingSlotCard';

interface UpcomingSlotsListProps {
  slots: UpcomingSlot[];
  viewerIsProfessional: boolean;
}

/** US-003.EC-1/US-007.EC-1: an empty state, not a blank screen. */
export function UpcomingSlotsList({
  slots,
  viewerIsProfessional,
}: UpcomingSlotsListProps) {
  if (slots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {viewerIsProfessional
          ? 'Nenhuma sessão agendada no momento.'
          : 'Você ainda não tem sessões agendadas. Agende uma acima.'}
      </p>
    );
  }

  return (
    <ul aria-label="Próximas sessões" className="flex flex-col gap-2">
      {slots.map(slot => (
        <UpcomingSlotCard
          key={slot.id}
          slot={slot}
          viewerIsProfessional={viewerIsProfessional}
        />
      ))}
    </ul>
  );
}
