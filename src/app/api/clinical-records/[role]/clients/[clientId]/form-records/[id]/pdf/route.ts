import { NextResponse } from 'next/server';
import { proxyPdfDownload } from '@/_lib/pdfDownloadProxy';

interface RouteParams {
  params: Promise<{ role: string; clientId: string; id: string }>;
}

/**
 * Exports a client's clinical record (`FormRecord`) as PDF (US-005), for
 * a nutritionist, a physical educator, or an academia — whichever role
 * already has read access to it. Collapses the backend's two
 * professional/academia PDF routes into one handler via this `[role]`
 * segment: the calling screen already knows which backend namespace it
 * belongs to (nutritionist and educator screens both use the shared
 * `/professionals/...` guard; academia screens use `/academia/...`), so
 * this is a pure pass-through, not a new permission decision — the
 * backend's own guard stack still decides whether the request is
 * actually allowed.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { role, clientId, id } = await params;

  if (role !== 'professionals' && role !== 'academia') {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }

  return proxyPdfDownload(
    `/${role}/clients/${clientId}/form-records/${id}/pdf`
  );
}
