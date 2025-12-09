export function formatDate(dateString: string, locale: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
}

export function formatCep(cep: string) {
  const digits = cep.replace(/\D/g, '');
  return digits.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  } else {
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
  }
}
