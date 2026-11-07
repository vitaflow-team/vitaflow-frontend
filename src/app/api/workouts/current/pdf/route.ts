import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

/**
 * Exports the caller's own AI-generated `Workout` as PDF (US-003). Always
 * the authenticated caller's own current workout — no cross-user id ever
 * travels through this route.
 */
export async function GET() {
  return proxyPdfDownload('/workouts/current/pdf');
}
