import type { ChurnByRole } from '@/_types/churnByRole';
import type { RegisteredByRole } from '@/_types/registeredByRole';

/** `GET /backoffice/metrics` response (TechSpec Core Interfaces, ADR-005). */
export interface PlatformMetrics {
  mrr: {
    current: number;
    /** `null` means Asaas was unreachable — never a real zero-percent change (ADR-005, ADR-006). */
    previousMonth: number | null;
    /** ISO timestamp of the cached/live Asaas read backing `previousMonth`. */
    asOf: string;
  };
  registeredByRole: RegisteredByRole[];
  churnByRole: ChurnByRole[];
}
