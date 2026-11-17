import { previewStaffInvitation } from '@/_actions/backoffice/previewStaffInvitation';
import { RemoveParams } from '@/_components/layout/removeParams';
import type { StaffInvitationPreview } from '@/_types/staffInvitationPreview';
import { ActivationFrame } from '../activate/activationViews';
import { AcceptBackofficeStaff } from './acceptBackofficeStaff';
import { AcceptInvitationInvalid } from './acceptBackofficeStaffViews';

interface AcceptBackofficeStaffPageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

async function loadPreview(
  token: string | string[] | undefined
): Promise<StaffInvitationPreview | null> {
  if (typeof token !== 'string' || !token) return null;

  const [preview] = await previewStaffInvitation({ token });
  return preview ?? null;
}

/** Acceptance of a staff invitation sent to an existing account (US-008). */
export default async function AcceptBackofficeStaffPage({
  searchParams,
}: AcceptBackofficeStaffPageProps) {
  const { token } = await searchParams;
  const preview = await loadPreview(token);

  return (
    <RemoveParams>
      <ActivationFrame>
        {preview && typeof token === 'string' ? (
          <AcceptBackofficeStaff
            token={token}
            tier={preview.tier}
            googleLinked={preview.googleLinked}
          />
        ) : (
          <AcceptInvitationInvalid />
        )}
      </ActivationFrame>
    </RemoveParams>
  );
}
