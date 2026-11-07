import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

interface RouteParams {
  params: Promise<{ clientId: string; version: string }>;
}

/**
 * Exports a client's meal plan as PDF, for the owning nutritionist
 * (US-001). Collapses the backend's two professional-side PDF routes —
 * the current draft and a specific published version — into one handler
 * via this `[version]` segment, per TechSpec System Architecture: `draft`
 * is the literal draft route, any other value is a published version
 * number.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { clientId, version } = await params;

  const backendPath =
    version === 'draft'
      ? `/professionals/clients/${clientId}/meal-plan/draft/pdf`
      : `/professionals/clients/${clientId}/meal-plan/versions/${version}/pdf`;

  return proxyPdfDownload(backendPath);
}
