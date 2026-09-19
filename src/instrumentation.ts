import { getEnv } from '@/_lib/getenv';

function isPresent(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireOneOf(names: readonly string[]): void {
  if (!names.some(name => isPresent(process.env[name]))) {
    throw new Error(`Missing environment variable: ${names.join(' or ')}`);
  }
}

function requireVariable(name: string): void {
  if (!isPresent(getEnv(name))) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

export function validateEnv(): void {
  requireOneOf(['NEXTAUTH_URL', 'AUTH_URL']);
  requireOneOf(['AUTH_SECRET', 'NEXTAUTH_SECRET']);
  requireVariable('BACKEND_URL');
  requireVariable('APP_SECRET_KEY');

  const hasGoogleClientId = isPresent(process.env.GOOGLE_CLIENT_ID);
  const hasGoogleClientSecret = isPresent(process.env.GOOGLE_CLIENT_SECRET);

  if (hasGoogleClientId !== hasGoogleClientSecret) {
    const missingVariable = hasGoogleClientId
      ? 'GOOGLE_CLIENT_SECRET'
      : 'GOOGLE_CLIENT_ID';
    throw new Error(`Missing environment variable: ${missingVariable}`);
  }
}

export function register(): void {
  validateEnv();
}
