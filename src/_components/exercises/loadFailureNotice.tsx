interface LoadFailureNoticeProps {
  message: string;
}

/** Shown when the backend could not answer; it never shows partial data. */
export function LoadFailureNotice({ message }: LoadFailureNoticeProps) {
  return (
    <div
      role="alert"
      className="text-muted-foreground rounded-lg border p-6 text-center"
    >
      {message}
    </div>
  );
}
