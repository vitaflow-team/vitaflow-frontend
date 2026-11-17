import type { BackofficeTier } from '@/_types/backofficeStaff';

/** What `POST /backoffice/staff/invitation/preview` tells the invited person. */
export interface StaffInvitationPreview {
  tier: BackofficeTier;
  googleLinked: boolean;
}
