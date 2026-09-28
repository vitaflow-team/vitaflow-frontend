import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessProfessional } from '@/_lib/clientsAuthorization';
import type { Metadata } from 'next';
import ClientView from './clientView';

export const metadata: Metadata = {
  title: PAGE_TITLES.client,
};

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await redirectUnlessProfessional();
  const { id } = await params;
  return <ClientView id={id} />;
}
