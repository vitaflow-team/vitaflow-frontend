import { z } from 'zod';
import { ZSAError } from 'zsa';

const backendIdSchema = z.uuid();

// Validates a client-supplied id before it is interpolated into a backend
// path, so a crafted value (`../profile`, `x?y=1`) cannot address a different
// endpoint. A valid UUID is URL-safe, so the encoded result equals the input.
export function parseBackendId(id: string): string {
  const result = backendIdSchema.safeParse(id);
  if (!result.success) {
    throw new ZSAError('ERROR', 'Identificador inválido.');
  }
  return encodeURIComponent(result.data);
}
