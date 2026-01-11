import { actionGetClientsByUser } from '@/_actions/clients/getClientsByUser';
import TableClients from './tableClient';

export default async function ClientsPage() {
  const [data] = await actionGetClientsByUser();
  return <TableClients data={data || []} />;
}
