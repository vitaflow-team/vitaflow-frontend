import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { professionalTypeLabel } from '@/_lib/professionalDisplay';
import type { MirrorProfessional } from '@/_types/professionalMirror';
import { UserRound } from 'lucide-react';

interface MirrorIdentityCardProps {
  professional: MirrorProfessional;
  type: 'NUTRITIONIST' | 'PHYSICAL_EDUCATOR';
}

// US-001: the one fully real section at this PRD's launch — the linked
// professional's actual name and specialty, read fresh on every open.
export function MirrorIdentityCard({
  professional,
  type,
}: MirrorIdentityCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>{professionalTypeLabel(type)}</CardTitle>
        <UserRound className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{professional.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {professional.specialty ?? 'Especialidade não informada'}
        </p>
      </CardContent>
    </Card>
  );
}
