interface SubscriptionWithPeriodEnd {
  items?: {
    data?: { current_period_end?: number }[];
  };
}

export function getSubscriptionPeriodEnd(
  subscription: SubscriptionWithPeriodEnd
): string | undefined {
  const periodEnd = subscription.items?.data?.[0]?.current_period_end;

  // Absent item, absent field or a null from the API all mean "leave the
  // stored value alone" — only a real timestamp produces a date.
  return typeof periodEnd === 'number'
    ? new Date(periodEnd * 1000).toISOString()
    : undefined;
}
