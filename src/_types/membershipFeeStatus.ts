/** A gym fee as the student sees it: an unpaid fee past its due date reads `OVERDUE`. */
export type MembershipFeeStatus = 'PENDING' | 'OVERDUE' | 'PAID';
