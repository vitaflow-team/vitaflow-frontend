export function formatDate(dateString: string, locale: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
}
