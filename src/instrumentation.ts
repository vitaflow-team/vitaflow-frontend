import { parseServerEnv } from '@/_lib/serverEnv';

export function register(): void {
  parseServerEnv(process.env);
}
