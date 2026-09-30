import {
  isLoadFailure,
  loadCompare,
  loadConsentStatus,
  loadIsPremium,
  loadPhotosByAngle,
} from '@/_lib/progressPhotosData';
import type { PhotoAngle } from '@/_types/progressPhotos';
import { AngleSelector } from './angleSelector';
import { ComparisonView } from './comparisonView';
import { ConsentGate } from './consentGate';
import { PhotoHistoryStrip } from './photoHistoryStrip';
import { PremiumGate } from './premiumGate';

const VALID_ANGLES: PhotoAngle[] = ['FRONT', 'SIDE', 'BACK'];

function parseAngle(value: string | string[] | undefined): PhotoAngle {
  const candidate = typeof value === 'string' ? value.toUpperCase() : '';
  return VALID_ANGLES.includes(candidate as PhotoAngle)
    ? (candidate as PhotoAngle)
    : 'FRONT';
}

function parseId(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

interface FotosTabProps {
  searchParams: {
    angle?: string | string[];
    compareA?: string | string[];
    compareB?: string | string[];
  };
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-lg border p-6 text-center text-muted-foreground">
      {message}
    </div>
  );
}

// Orchestrates the whole "Fotos" tab: Premium gate (US-006) applies before
// everything else — including the consent step — per the PRD's own rule
// that the gate is checked up front, not reactively on a failed request.
export async function FotosTab({ searchParams }: FotosTabProps) {
  const isPremium = await loadIsPremium();
  if (isLoadFailure(isPremium)) {
    return (
      <ErrorNotice message="Não foi possível verificar seu plano. Tente novamente mais tarde." />
    );
  }
  if (!isPremium) {
    return <PremiumGate />;
  }

  const consented = await loadConsentStatus();
  if (isLoadFailure(consented)) {
    return (
      <ErrorNotice message="Não foi possível carregar suas fotos. Tente novamente mais tarde." />
    );
  }
  if (!consented) {
    return <ConsentGate />;
  }

  const angle = parseAngle(searchParams.angle);
  const compareA = parseId(searchParams.compareA);
  const compareB = parseId(searchParams.compareB);

  if (compareA && compareB) {
    const result = await loadCompare(compareA, compareB);
    if (isLoadFailure(result)) {
      return (
        <ErrorNotice message="Não foi possível comparar estas fotos. Elas podem não ser do mesmo ângulo ou não existirem mais." />
      );
    }
    return <ComparisonView result={result} angle={angle} />;
  }

  const photos = await loadPhotosByAngle(angle);
  if (isLoadFailure(photos)) {
    return (
      <ErrorNotice message="Não foi possível carregar suas fotos. Tente novamente mais tarde." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AngleSelector value={angle} />
      <PhotoHistoryStrip angle={angle} photos={photos} />
    </div>
  );
}
