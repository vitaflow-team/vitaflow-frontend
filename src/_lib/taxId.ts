/** Digits only, for either document; the backend stores and compares the same way. */
export function taxIdDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

function allSameDigit(digits: string): boolean {
  return /^(\d)\1*$/.test(digits);
}

function cpfCheckDigit(digits: string, length: 9 | 10): number {
  let sum = 0;
  let weight = length + 1;
  for (let i = 0; i < length; i += 1) {
    sum += Number(digits[i]) * weight;
    weight -= 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || allSameDigit(digits)) return false;
  const firstCheck = cpfCheckDigit(digits, 9);
  const secondCheck = cpfCheckDigit(digits.slice(0, 10), 10);
  return firstCheck === Number(digits[9]) && secondCheck === Number(digits[10]);
}

function cnpjCheckDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function isValidCnpj(digits: string): boolean {
  if (digits.length !== 14 || allSameDigit(digits)) return false;
  const firstCheck = cnpjCheckDigit(digits, CNPJ_FIRST_WEIGHTS);
  const secondCheck = cnpjCheckDigit(digits, CNPJ_SECOND_WEIGHTS);
  return (
    firstCheck === Number(digits[12]) && secondCheck === Number(digits[13])
  );
}

/** Accepts CPF (11 digits) or CNPJ (14 digits), with or without punctuation. */
export function isValidTaxId(raw: string): boolean {
  const digits = taxIdDigits(raw);
  return isValidCpf(digits) || isValidCnpj(digits);
}

function maskCpf(digits: string): string {
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function maskCnpj(digits: string): string {
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/** Formats digits-only input for display; returns the input unchanged if it isn't 11 or 14 digits. */
export function formatTaxId(raw: string): string {
  const digits = taxIdDigits(raw);
  if (digits.length === 11) return maskCpf(digits);
  if (digits.length === 14) return maskCnpj(digits);
  return raw;
}
