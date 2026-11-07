import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

interface RouteParams {
  params: Promise<{ version: string }>;
}

/**
 * Exports the caller's own meal plan as PDF (US-002), via the existing
 * professional-mirror's linked-nutritionist resolution — published
 * versions only, matching that mirror route's own scope.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { version } = await params;

  return proxyPdfDownload(`/me/nutritionist/meal-plan/versions/${version}/pdf`);
}
