import { CONTRAINDICATION_LABELS } from '@/_constants/exerciseCatalog';
import type { ExerciseContraindication } from '@/_types/exerciseContraindication';

interface ContraindicationListProps {
  contraindications: ExerciseContraindication[];
}

/**
 * Curated restrictions. Most exercises have none curated yet, which is a
 * normal state: the section is left out rather than shown empty
 * (US-004.AC-5, ADR-003).
 */
export function ContraindicationList({
  contraindications,
}: ContraindicationListProps) {
  if (contraindications.length === 0) return null;

  return (
    <section aria-labelledby="exercise-contraindications">
      <h2 id="exercise-contraindications" className="mb-2 font-semibold">
        Contraindicações
      </h2>
      <ul className="flex flex-wrap gap-2">
        {contraindications.map(item => (
          <li
            key={item}
            className="bg-secondary rounded-full px-3 py-1 text-sm"
          >
            {CONTRAINDICATION_LABELS[item] ?? item}
          </li>
        ))}
      </ul>
    </section>
  );
}
