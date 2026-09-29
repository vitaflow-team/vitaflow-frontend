import { z } from 'zod';

const serverEnvSchema = z
  .object({
    BACKEND_URL: z.url(),
    APP_SECRET_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.url().optional(),
    AUTH_URL: z.url().optional(),
    AUTH_SECRET: z.string().optional(),
    NEXTAUTH_SECRET: z.string().optional(),
    // Google sign-in is optional, but only as a pair.
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (!env.NEXTAUTH_URL && !env.AUTH_URL) {
      ctx.addIssue({ code: 'custom', message: 'NEXTAUTH_URL or AUTH_URL' });
    }
    if (!env.AUTH_SECRET && !env.NEXTAUTH_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message: 'AUTH_SECRET or NEXTAUTH_SECRET',
      });
    }
    if (!env.GOOGLE_CLIENT_ID !== !env.GOOGLE_CLIENT_SECRET) {
      const missing = env.GOOGLE_CLIENT_ID
        ? 'GOOGLE_CLIENT_SECRET'
        : 'GOOGLE_CLIENT_ID';
      ctx.addIssue({ code: 'custom', message: missing, path: [missing] });
    }
  });

// A blank variable is an unset one: a `.env` line like `GOOGLE_CLIENT_ID=`
// disables the feature instead of failing as a malformed value.
function withoutBlankValues(
  source: Record<string, string | undefined>
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value?.trim())
  );
}

// Names the variable, never its value: the value may be a secret.
function describeIssue(issue: z.core.$ZodIssue): string {
  if (issue.code === 'custom') return issue.message;
  return `${issue.path.join('.')} (${issue.message})`;
}

/**
 * Validates every server-side variable the app needs and returns only the
 * declared ones. Fails with one error listing every problem, so a bad deploy
 * stops at startup instead of on the first request that reads the variable.
 */
export function parseServerEnv(source: Record<string, string | undefined>) {
  const result = serverEnvSchema.safeParse(withoutBlankValues(source));
  if (result.success) return result.data;

  const problems = result.error.issues.map(describeIssue).join('; ');
  throw new Error(`Missing or invalid environment variables: ${problems}`);
}
