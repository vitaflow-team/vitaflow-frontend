import { backofficeTierLabel } from '@/_lib/backofficeTier';
import type { StaffListItem } from '@/_types/backofficeStaff';
import { InviteStaffDialog } from './inviteStaffDialog';
import { RemoveStaffButton } from './removeStaffButton';
import { ResendStaffInvitationButton } from './resendStaffInvitationButton';
import { StaffTierSelect } from './staffTierSelect';

interface StaffMemberRowProps {
  member: StaffListItem;
}

/**
 * A pending invitation shows the tier it offers as text and can be re-sent;
 * the tier control belongs to members whose access is already in place.
 */
function StaffMemberRow({ member }: StaffMemberRowProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{member.name}</span>
        <span className="text-muted-foreground truncate text-sm">
          {member.email}
        </span>
        {member.pending && (
          <span className="text-muted-foreground text-xs">
            Convite pendente · {backofficeTierLabel(member.tier)}
          </span>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {member.pending ? (
          <ResendStaffInvitationButton
            staffId={member.id}
            staffName={member.name}
          />
        ) : (
          <StaffTierSelect
            staffId={member.id}
            staffName={member.name}
            tier={member.tier ?? 'EQUIPE'}
          />
        )}
        <RemoveStaffButton staffId={member.id} staffName={member.name} />
      </div>
    </li>
  );
}

interface StaffManagementViewProps {
  staff: StaffListItem[];
}

/** Staff list, invite, tier-change and removal (US-007 through US-009). */
export function StaffManagementView({ staff }: StaffManagementViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <InviteStaffDialog />
      </div>

      {staff.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Nenhum membro da equipe ainda.
        </p>
      ) : (
        <ul className="flex flex-col divide-y rounded-md border">
          {staff.map(member => (
            <StaffMemberRow key={member.id} member={member} />
          ))}
        </ul>
      )}
    </div>
  );
}
