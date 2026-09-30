import { exerciseAttribution } from '@/_lib/exerciseDisplay';
import type { Exercise } from '@/_types/exercise';
import { ContraindicationList } from './contraindicationList';
import { ExerciseFacts } from './exerciseFacts';
import { ExerciseMedia } from './exerciseMedia';

interface ExerciseDetailProps {
  exercise: Exercise;
}

/**
 * Everything about one exercise. Name and description show whatever is
 * stored, translated or not (US-004.AC-3).
 */
export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  const attribution = exerciseAttribution(exercise);

  return (
    <article className="flex flex-col gap-5">
      <header className="border-primary border-b pb-3">
        <h1 className="text-2xl font-semibold break-words">{exercise.name}</h1>
      </header>
      <ExerciseMedia
        name={exercise.name}
        imageUrl={exercise.imageUrl}
        videoUrl={exercise.videoUrl}
      />
      <ExerciseFacts exercise={exercise} />
      <section aria-labelledby="exercise-description">
        <h2 id="exercise-description" className="mb-2 font-semibold">
          Como fazer
        </h2>
        <p className="leading-relaxed whitespace-pre-line">
          {exercise.description}
        </p>
      </section>
      <ContraindicationList contraindications={exercise.contraindications} />
      {attribution && (
        <p className="text-muted-foreground text-sm">{attribution}</p>
      )}
    </article>
  );
}
