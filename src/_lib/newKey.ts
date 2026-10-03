/** A key for a row of the editor's working copy; never leaves the browser. */
export function newKey(): string {
  return globalThis.crypto.randomUUID();
}
