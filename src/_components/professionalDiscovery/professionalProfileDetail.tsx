import { formatPrice, professionalTypeLabel } from '@/_lib/professionalDisplay';
import type { ProfessionalProfile } from '@/_types/professionalDiscovery';

interface ProfessionalProfileDetailProps {
  profile: ProfessionalProfile;
}

// US-003: name, specialty, bio and price — no star rating or review content
// anywhere on this screen (ADR-001, a deliberate deviation from the
// originally validated prototype). An empty bio still renders cleanly
// (US-003.EC-1).
export function ProfessionalProfileDetail({
  profile,
}: ProfessionalProfileDetailProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{profile.name}</h1>
        <p className="text-muted-foreground flex flex-wrap gap-x-3 text-sm">
          <span>{professionalTypeLabel(profile.type)}</span>
          <span>{profile.specialty ?? 'Especialidade não informada'}</span>
          {profile.attendsOnline && <span>Atende online</span>}
        </p>
        <p className="font-semibold">{formatPrice(profile.priceFrom)}</p>
      </div>
      <p className="text-sm whitespace-pre-wrap">
        {profile.bio ?? 'Este profissional ainda não preencheu uma bio.'}
      </p>
    </div>
  );
}
