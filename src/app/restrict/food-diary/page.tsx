import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { Metadata } from 'next';
import FoodDiaryView from './foodDiaryView';

export const metadata: Metadata = {
  title: PAGE_TITLES.foodDiary,
};

export default function FoodDiaryPage() {
  return <FoodDiaryView />;
}
