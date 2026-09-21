import { BmiCard } from '@/_components/home/bmiCard';
import { Greeting } from '@/_components/home/greeting';
import {
  ShortcutButton,
  ShortcutLink,
  ShortcutsCard,
} from '@/_components/home/shortcutsCard';
import { WeightCard } from '@/_components/home/weightCard';
import { RecordFormModal } from '@/_components/progress/recordFormModal';
import { Button } from '@/_components/ui/button';
import type { DashboardResponseDTO } from '@/_types/progress';
import { ChartNoAxesCombined, Plus, Scale } from 'lucide-react';

interface HomeUserProps {
  nowIso: string;
  firstName: string;
  /** `null` quando a carga do painel falhou. */
  dashboard: DashboardResponseDTO | null;
}

export function HomeUser({ nowIso, firstName, dashboard }: HomeUserProps) {
  const latest = dashboard?.latest ?? null;
  const status = !dashboard ? 'error' : latest ? 'ready' : 'empty';
  const defaultHeightCm = latest?.heightCm;
  const weightSeries =
    dashboard?.weightSeries.map(point => point.weightKg) ?? [];

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Greeting nowIso={nowIso} firstName={firstName} />
        <RecordFormModal
          defaultHeightCm={defaultHeightCm}
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus aria-hidden="true" />
              Registrar peso
            </Button>
          }
        />
      </div>

      <section aria-label="Resumo atual" className="grid gap-4 sm:grid-cols-2">
        <WeightCard
          status={status}
          weightKg={latest?.weightKg}
          weightVariationKg={dashboard?.weightVariationKg}
          series={weightSeries}
        />
        <BmiCard
          status={status}
          bmi={latest?.bmi}
          classification={latest?.bmiClassification}
        />
      </section>

      <ShortcutsCard>
        <RecordFormModal
          defaultHeightCm={defaultHeightCm}
          trigger={
            <ShortcutButton icon={Scale} label="Registrar peso e medidas" />
          }
        />
        <ShortcutLink
          href="/restrict/progress"
          icon={ChartNoAxesCombined}
          label="Ver minha evolução"
        />
      </ShortcutsCard>
    </div>
  );
}
