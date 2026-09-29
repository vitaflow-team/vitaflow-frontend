import 'server-only';

import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { parseServerEnv } from './serverEnv';

// `next build` loads route modules to collect page data, but runtime secrets
// are not part of the build (the Docker image builds without them). The check
// runs when the server loads this module, and `instrumentation.ts` runs it at
// startup.
const isBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

export const env = isBuild
  ? (process.env as unknown as ReturnType<typeof parseServerEnv>)
  : parseServerEnv(process.env);
