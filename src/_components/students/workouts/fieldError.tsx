interface FieldErrorProps {
  id: string;
  message: string | undefined;
}

/** The message next to a field; the field points at it with `aria-describedby`. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}
