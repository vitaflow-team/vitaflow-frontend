import { safeVideoUrl } from '@/_lib/exerciseDisplay';
import { PlayCircle } from 'lucide-react';

interface VideoLinkProps {
  videoUrl: string | null;
  exerciseName: string;
}

/**
 * "Ver vídeo" only when the exercise has a video; it opens in a new tab, so a
 * video that no longer loads never leaves a broken player on the page. A
 * reference that is not a web link says so instead (US-004.EC-2).
 */
export function VideoLink({ videoUrl, exerciseName }: VideoLinkProps) {
  if (!videoUrl) return null;

  const url = safeVideoUrl(videoUrl);
  if (!url) {
    return (
      <p className="text-muted-foreground text-sm">
        Vídeo indisponível no momento.
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver vídeo de ${exerciseName} (abre em nova aba)`}
      className="text-primary inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
    >
      <PlayCircle className="size-4" aria-hidden="true" />
      Ver vídeo
    </a>
  );
}
