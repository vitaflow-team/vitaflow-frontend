import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const MODULES = [
  'apiClient.ts',
  'stripe.ts',
  'env.ts',
  'accessTokenCookie.ts',
  'fetchPlanClaims.ts',
];

function firstImport(file: string): string | undefined {
  const source = readFileSync(join(__dirname, file), 'utf8');
  return source.split(/\r?\n/).find(line => line.startsWith('import '));
}

describe('auth input hardening — server-only markers', () => {
  it.each(MODULES)("UT-012 %s imports 'server-only' first", file => {
    expect(firstImport(file)).toBe("import 'server-only';");
  });
});
