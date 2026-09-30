import Image from 'next/image';
import { VideoLink } from './videoLink';

interface ExerciseMediaProps {
  name: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

/**
 * Image and video are both optional: with neither, nothing renders and the
 * rest of the detail still shows (US-004.AC-2, EC-1). Images come from any
 * host the backoffice types in, so they skip the optimizer instead of turning
 * it into an open proxy.
 */
export function ExerciseMedia({
  name,
  imageUrl,
  videoUrl,
}: ExerciseMediaProps) {
  if (!imageUrl && !videoUrl) return null;

  return (
    <div className="flex flex-col gap-3">
      {imageUrl && (
        <div className="bg-muted relative aspect-video w-full max-w-xl overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={`Demonstração de ${name}`}
            fill
            unoptimized
            sizes="(min-width: 768px) 36rem, 100vw"
            className="object-contain"
          />
        </div>
      )}
      <VideoLink videoUrl={videoUrl} exerciseName={name} />
    </div>
  );
}
