interface DelinquentFigureProps {
  label: string;
  value: string;
}

/** One labelled figure of a delinquent row, read as a term and its value. */
export function DelinquentFigure({ label, value }: DelinquentFigureProps) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-semibold tabular-nums break-words">{value}</dd>
    </div>
  );
}
