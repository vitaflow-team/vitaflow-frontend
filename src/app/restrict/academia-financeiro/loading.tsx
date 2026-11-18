import { FinancialPanelSkeleton } from '@/_components/financial-health/financialPanelSkeleton';
import DefaultLayout from '@/_components/layout/defaultLayout';

export default function AcademiaFinanceiroLoading() {
  return (
    <DefaultLayout>
      <FinancialPanelSkeleton />
    </DefaultLayout>
  );
}
