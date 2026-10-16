import { getViewAsState } from '@/_lib/viewAsCookie';
import { EndViewAsButton } from './endViewAsButton';
import { ViewAsBannerView } from './viewAsBannerView';

/**
 * Persistent, unmissable indicator for the whole duration of a "ver como"
 * session (US-004, ADR-001) — rendered from the shared restricted-area
 * layout, so it is visible on every page while the session is active.
 */
export async function ViewAsBanner() {
  const viewAs = await getViewAsState();
  if (!viewAs) return null;

  return (
    <ViewAsBannerView
      targetLabel={viewAs.targetLabel}
      exitControl={<EndViewAsButton sessionId={viewAs.sessionId} />}
    />
  );
}
