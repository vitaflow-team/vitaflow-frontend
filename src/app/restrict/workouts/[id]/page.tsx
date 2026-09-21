import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { Metadata } from 'next';
import FormWorkout from './formWorkout';

export const metadata: Metadata = {
  title: PAGE_TITLES.workoutForm,
};

export default async function WorkoutsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id !== '0') {
    console.log('buscar usuário');
  }

  return (
    <DefaultLayout>
      <FormWorkout />
    </DefaultLayout>
  );
}
