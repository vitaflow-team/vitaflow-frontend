import { AsyncLocalStorage } from 'node:async_hooks';
import { vi } from 'vitest';

Object.assign(globalThis, { AsyncLocalStorage });

// `server-only` throws outside a React Server Components build, and every test
// here runs in plain Node; the build itself still enforces the boundary.
vi.mock('server-only', () => ({}));
