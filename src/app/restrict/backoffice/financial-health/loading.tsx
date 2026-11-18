import { FinancialPanelSkeleton } from '@/_components/financial-health/financialPanelSkeleton';

export default function BackofficeFinancialHealthLoading() {
  return (
    <div className="py-4">
      <FinancialPanelSkeleton />
    </div>
  );
}
