import DefaultLayout from '@/_components/layout/defaultLayout';
import { ReceptionistCheckinView } from '@/_components/academia-checkin/receptionistCheckinView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessReceptionist } from '@/_lib/academiaAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaCheckin,
};

export default async function AcademiaCheckinPage() {
  await redirectUnlessReceptionist();

  return (
    <DefaultLayout>
      <ReceptionistCheckinView />
    </DefaultLayout>
  );
}
