import { FinancialPanelSkeleton } from '@/_components/financial-health/financialPanelSkeleton';
import DefaultLayout from '@/_components/layout/defaultLayout';

export default function FinanceiroLoading() {
  return (
    <DefaultLayout>
      <FinancialPanelSkeleton />
    </DefaultLayout>
  );
}
