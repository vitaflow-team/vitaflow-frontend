import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { Metadata } from 'next';
import WorkoutsView from './workoutsView';

export const metadata: Metadata = {
  title: PAGE_TITLES.workouts,
};

interface WorkoutsPageProps {
  searchParams: Promise<{ gerar?: string }>;
}

export default function WorkoutsPage({ searchParams }: WorkoutsPageProps) {
  return <WorkoutsView searchParams={searchParams} />;
}
