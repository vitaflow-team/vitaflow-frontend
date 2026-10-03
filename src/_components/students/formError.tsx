interface FormErrorProps {
  message: string | null;
}

/** A failure message that keeps the form (and everything typed) in place. */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive"
    >
      {message}
    </p>
  );
}
