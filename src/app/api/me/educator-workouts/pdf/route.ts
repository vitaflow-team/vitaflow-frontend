import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

/**
 * Exports the caller's own prescribed `EducatorWorkout` as PDF (US-008),
 * via the existing `findActiveByLinkedUser` resolution — including its
 * "academia-only assignment unsupported" failure, reused as-is.
 */
export async function GET() {
  return proxyPdfDownload('/me/educator-workouts/pdf');
}
