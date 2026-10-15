import DefaultLayout from '@/_components/layout/defaultLayout';
import { PendingInvitationsList } from '@/_components/employmentInvitations/pendingInvitationsList';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadEmploymentInvitations } from '@/_lib/employmentInvitationsData';
import { redirectUnlessEducator } from '@/_lib/studentsAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.employmentInvitations,
};

export default async function EmploymentInvitationsPage() {
  await redirectUnlessEducator();
  const invitations = await loadEmploymentInvitations();

  return (
    <DefaultLayout>
      <Title label={PAGE_TITLES.employmentInvitations} className="text-left" />
      <PendingInvitationsList invitations={invitations} />
    </DefaultLayout>
  );
}
