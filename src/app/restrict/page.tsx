import { HomeProfessional } from '@/_components/home/homeProfessional';
import { HomeUser } from '@/_components/home/homeUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { apiClient } from '@/_lib/apiClient';
import { getFirstName } from '@/_lib/navigation';
import type { DashboardResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.home,
};

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const firstName = getFirstName(session.user.name);
  // O instante vem do servidor para a saudação não divergir na hidratação; o
  // cliente recalcula com o relógio local depois de montar.
  const nowIso = new Date().toISOString();

  // Quem manda é o tipo armazenado: um profissional cadastrado como usuário
  // comum vê o Início de usuário, e é isso mesmo que se espera.
  if (PROFESSIONAL_TYPES.includes(session.user.productType ?? '')) {
    return (
      <DefaultLayout>
        <HomeProfessional nowIso={nowIso} firstName={firstName} />
      </DefaultLayout>
    );
  }

  let dashboard: DashboardResponseDTO | null = null;
  try {
    dashboard = await apiClient<DashboardResponseDTO>(
      '/progress-records/dashboard',
      { method: 'GET' }
    );
  } catch (error) {
    // A falha degrada só os cards: saudação e atalhos continuam úteis.
    console.error('Falha ao carregar o painel do Início:', error);
  }

  return (
    <DefaultLayout>
      <HomeUser nowIso={nowIso} firstName={firstName} dashboard={dashboard} />
    </DefaultLayout>
  );
}
