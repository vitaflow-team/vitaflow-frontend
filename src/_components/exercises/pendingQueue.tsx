import { equipmentLabel, submitterReference } from '@/_lib/exerciseDisplay';
import type { Exercise } from '@/_types/exercise';
import { ContraindicationList } from './contraindicationList';
import { ReviewActions } from './reviewActions';
import { VideoLink } from './videoLink';

interface PendingQueueProps {
  submissions: Exercise[];
}

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

/**
 * The moderation queue: each submission's full content and who sent it
 * (US-008.AC-1), or an explicit "nothing to review" (US-008.EC-1).
 */
export function PendingQueue({ submissions }: PendingQueueProps) {
  if (submissions.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center">
        Nenhuma sugestão para revisar.
      </p>
    );
  }

  return (
    <ul aria-label="Sugestões pendentes" className="flex flex-col gap-3">
      {submissions.map(item => (
        <li
          key={item.id}
          className="bg-card flex flex-col gap-3 rounded-lg border p-4"
        >
          <div>
            <h3 className="font-semibold break-words">{item.name}</h3>
            <p className="text-muted-foreground text-sm">
              {item.muscleGroup} · {equipmentLabel(item.equipment)}
              {item.difficulty ? ` · ${item.difficulty}` : ''}
            </p>
            <p className="text-muted-foreground text-xs">
              {submitterReference(item.submittedById)} · enviado em{' '}
              {DATE_FORMAT.format(new Date(item.createdAt))}
            </p>
          </div>
          <p className="text-sm whitespace-pre-line">{item.description}</p>
          <ContraindicationList contraindications={item.contraindications} />
          <VideoLink videoUrl={item.videoUrl} exerciseName={item.name} />
          <ReviewActions exerciseId={item.id} exerciseName={item.name} />
        </li>
      ))}
    </ul>
  );
}
