import type { StudentWorkoutExercise } from '@/_types/educatorWorkouts';
import { ExternalLink } from 'lucide-react';

interface EducatorExerciseItemProps {
  exercise: StudentWorkoutExercise;
}

/** Only http(s) links become a control; anything else is dropped, never rendered. */
function safeVideoUrl(url: string | null): string | null {
  return url !== null && /^https?:\/\//i.test(url) ? url : null;
}

/** One exercise as the student reads it: series × repetitions, the load if any, a video link if any. */
export function EducatorExerciseItem({ exercise }: EducatorExerciseItemProps) {
  const videoUrl = safeVideoUrl(exercise.videoUrl);

  return (
    <li className="flex flex-col gap-1 border-b border-line py-3 last:border-b-0">
      <p className="font-medium">{exercise.name}</p>
      <p className="text-sm text-muted-foreground">
        {exercise.sets} × {exercise.reps}
        {exercise.load ? ` · Carga: ${exercise.load}` : ''}
        {` · ${exercise.muscleGroup}`}
      </p>
      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          Ver vídeo
          <span className="sr-only">
            {' '}
            de {exercise.name} (abre em outra aba)
          </span>
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}
