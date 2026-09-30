import { EQUIPMENT_LABELS } from '@/_constants/exerciseCatalog';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';

export function equipmentLabel(equipment: ExerciseEquipment): string {
  return EQUIPMENT_LABELS[equipment] ?? 'Equipamento não informado';
}

/**
 * The video address, when it is a well-formed web link. Anything else (a
 * stale path, a `javascript:` URL) counts as unavailable, so the screen shows
 * a message instead of a control that leads nowhere (US-004.EC-2).
 */
export function safeVideoUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Whether a stored video reference exists, reachable or not. */
export function hasVideoReference(exercise: Pick<Exercise, 'videoUrl'>) {
  return Boolean(exercise.videoUrl);
}

/**
 * Per-exercise credit for imported entries. In-house entries (educator or
 * backoffice) carry no source and get no credit line (US-005.EC-1).
 */
export function exerciseAttribution(
  exercise: Pick<Exercise, 'sourceAttribution' | 'sourceLicense'>
): string | null {
  if (!exercise.sourceAttribution) return null;
  const license = exercise.sourceLicense
    ? ` · Licença ${exercise.sourceLicense}`
    : '';
  return `Fonte: ${exercise.sourceAttribution}${license}`;
}

/** A short, non-identifying reference to the submitting educator. */
export function submitterReference(submittedById: string | null): string {
  return submittedById
    ? `Educador ${submittedById.slice(0, 8)}`
    : 'Desconhecido';
}
