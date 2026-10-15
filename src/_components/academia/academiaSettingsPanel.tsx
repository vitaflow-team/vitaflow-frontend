import { Title } from '@/_components/ui/title';
import type { AcademiaSettingsData } from '@/_lib/academiaSettingsData';
import { AccessPlansSection } from './accessPlansSection';
import { TeamSection } from './teamSection';

interface AcademiaSettingsPanelProps {
  data: AcademiaSettingsData;
}

export function AcademiaSettingsPanel({ data }: AcademiaSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Title label="Equipe" size="h2" className="text-left" />
        <TeamSection
          invitations={data.invitations}
          employments={data.employments}
          staff={data.staff}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Title label="Planos de acesso" size="h2" className="text-left" />
        <AccessPlansSection plans={data.accessPlans} />
      </section>
    </div>
  );
}
