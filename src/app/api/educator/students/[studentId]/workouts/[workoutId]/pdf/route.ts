import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

interface RouteParams {
  params: Promise<{ studentId: string; workoutId: string }>;
}

/**
 * Exports a client's prescribed `EducatorWorkout` as PDF, for the
 * prescribing physical educator (US-004).
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { studentId, workoutId } = await params;

  return proxyPdfDownload(
    `/educator/students/${studentId}/workouts/${workoutId}/pdf`
  );
}
