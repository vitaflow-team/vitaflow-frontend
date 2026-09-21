import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { Metadata } from 'next';
import WorkoutsView from './workoutsView';

export const metadata: Metadata = {
  title: PAGE_TITLES.workouts,
};

export default function WorkoutsPage() {
  return <WorkoutsView />;
}
