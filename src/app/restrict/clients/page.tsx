import { actionGetClientsByUser } from '@/_actions/clients/getClientsByUser';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessProfessional } from '@/_lib/clientsAuthorization';
import type { Metadata } from 'next';
import TableClients from './tableClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.clients,
};

export default async function ClientsPage() {
  await redirectUnlessProfessional();
  const [data] = await actionGetClientsByUser();
  return <TableClients data={data || []} />;
}
