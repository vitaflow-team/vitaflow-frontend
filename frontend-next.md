# Frontend Next.js Standards

Rules specific to `vitaflow-frontend` (Next.js 16 App Router, React, TypeScript, Auth.js, ZSA, Zod, Tailwind + shadcn/ui, Vitest). They build on the language-agnostic rules in [`../code-standards.md`](../code-standards.md) (English-only code, function length, nesting, parameter count, one type per file), which still apply. For starting work on a new PRD (worktree, branch, registration), see [`../git-workflow.md`](../git-workflow.md).

The rules describe the project's real conventions, refined where the codebase is inconsistent (marked **Refinement**). New code follows this document; existing code is brought in line opportunistically, not through mass rewrites.

---

## 1. Server Components by default; `'use client'` only for interactivity

Every component is a React Server Component unless it needs interactivity. Add `'use client'` only when the file uses state or effect hooks (`useState`, `useEffect`, `useReducer`, `useRef` for timers), browser APIs, or event handlers (`onClick`, `onChange`, pointer events). Server Components fetch data, read secrets, and render markup; they ship no JavaScript to the browser.

Push the `'use client'` boundary **down** to the smallest interactive leaf. A page or section stays on the server and imports a small client component for the one interactive part, instead of marking the whole tree as client.

**Bad** — the whole card becomes client code because of one button

```tsx
'use client';

export function PlanCard({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <button onClick={() => setOpen(true)}>Choose</button>
    </section>
  );
}
```

**Good** — the card stays on the server, only the button is client

```tsx
// planCard.tsx (Server Component, no directive)
export function PlanCard({ plan }: PlanCardProps) {
  return (
    <section>
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <ChoosePlanButton planId={plan.id} />
    </section>
  );
}
```

```tsx
// choosePlanButton.tsx
'use client';

export function ChoosePlanButton({ planId }: ChoosePlanButtonProps) {
  const [open, setOpen] = useState(false);
  // ...
}
```

**Refinement**: a component is client only because a **child** is interactive is a smell — split it so the parent stays a Server Component. Context providers (`auth-provider`, `unsavedChangesProvider`) are the legitimate exception, since they must wrap their children.

---

## 2. Use the App Router, organized by feature

All routes live under `src/app/`, grouped by feature (`app/restrict/settings`, `app/restrict/progress`, `app/signin`). A route folder holds its `page.tsx`, `layout.tsx` when needed, and the components used **only** by that route. Route groups such as `(public)` separate areas without changing the URL.

Code shared across routes lives in underscore-prefixed folders under `src/`, which Next.js treats as private (never routable):

| Folder                       | Holds                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `src/_components/<feature>/` | reusable components, grouped by feature (`progress`, `settings`, `upgrade`, `layout`) |
| `src/_components/ui/`        | shadcn/ui primitives                                                                  |
| `src/_actions/<domain>/`     | Server Actions                                                                        |
| `src/_lib/`                  | pure logic and server-only helpers (`apiClient`, formatters, reducers)                |
| `src/_hooks/`                | client hooks                                                                          |
| `src/_types/`                | one type per file (see `code-standards.md` rule 6)                                    |
| `src/_schema/`               | Zod schemas                                                                           |
| `src/_constants/`            | constants and route tables                                                            |

```
src/app/restrict/settings/
  page.tsx            # orchestrates data, renders sections
  form.tsx            # client form used only by this route
src/_components/settings/
  planPanel.tsx       # reusable section, imported by the page
  deleteAccountDialog.tsx
```

---

## 3. `page.tsx` orchestrates data; it does not implement UI

A page file reads `searchParams`/`params`, checks the session, fetches data on the server, handles the failure state, and composes components. It contains no business logic, formatting, or large JSX blocks — those move into `_lib` helpers and `_components`. Keep a page short enough to read at a glance.

```tsx
// app/restrict/progress/page.tsx
export const metadata: Metadata = { title: PAGE_TITLES.progress };

export default async function ProgressPage({
  searchParams,
}: ProgressPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { semanas } = await searchParams;
  const weeks = parsePeriod(semanas); // logic lives in _lib

  const dashboard = await loadDashboard(weeks); // data access lives in a helper
  if (!dashboard) return <LoadFailure />;

  return <ProgressView dashboard={dashboard} />; // UI lives in a component
}
```

`searchParams` and `params` are promises in Next 16: always `await` them, and validate any value taken from the URL before using it.

---

## 4. Fetch on the server, keep secrets on the server

Read data directly in Server Components and Server Actions through `apiClient` (`src/_lib/apiClient.ts`), which runs only on the server, attaches the user's bearer token from the httpOnly cookie, and adds the `x-application-secret` header. Never call the backend from the browser and never pass tokens, secrets, or Stripe identifiers to a Client Component as props.

Mark server-only modules so they cannot be imported into client code by mistake, and pass only the data a client component needs (a serializable subset, not the raw backend response).

**Bad**

```tsx
'use client';
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API}/profile`).then(/* ... */);
}, []);
```

**Good**

```tsx
// Server Component
const profile = await apiClient<Profile>('/profile', { method: 'GET' });
return <ProfileForm initialName={profile.name} />;
```

---

## 5. Configure caching per request

Next extends `fetch`. Choose the cache behavior for each request deliberately:

- **`no-store`** — user-specific or real-time data (profile, dashboard, subscription). This is the `apiClient` default.
- **`force-cache` / `next: { revalidate: N }`** — data shared by all users that changes rarely (the plan catalog). Pass it through `apiClient`'s `init`.
- **`next: { tags: [...] }`** plus `revalidateTag(...)` — data that must refresh after a mutation, as `postClientsByUser` does with `list-clientsByUser`.

```ts
// Shared, rarely changing catalog: cache for an hour.
const plans = await apiClient<Plan[]>('/plans', {
  method: 'GET',
  cache: 'force-cache',
  next: { revalidate: 3600, tags: ['plans'] },
});

// Per-user data: never cached (the apiClient default, stated explicitly when it matters).
const profile = await apiClient<Profile>('/profile', {
  method: 'GET',
  cache: 'no-store',
});
```

Never cache a response that contains user data across users.

---

## 6. Server Actions for forms and mutations, not separate API endpoints

Submit forms and perform mutations with Server Actions in `src/_actions/<domain>/`, defined with ZSA (`createServerAction().input(schema).handler(...)`) and marked `'use server'`. Do not create a `route.ts` API endpoint just to receive a form post.

Every action: checks the session first, validates input with a Zod schema, calls the backend through `apiClient`, and converts every failure into a `ZSAError` with a safe message — never leaking internal detail.

```ts
'use server';

export const deleteMeasurementRecord = createServerAction()
  .input(deleteRecordSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'User is not authenticated.');
    }
    try {
      await apiClient(`/progress-records/${input.id}`, { method: 'DELETE' });
    } catch (error) {
      throw new ZSAError('ERROR', GENERIC_FAILURE);
    }
  });
```

**Exception**: Route Handlers stay only where an external system must call the app — the Stripe webhook (`app/api/stripe/webhook/route.ts`) and the Auth.js handlers.

---

## 7. Images and fonts

**Images**: always use `next/image` (`<Image />`) for automatic resizing, modern formats, and lazy loading; never a raw `<img>`. Give every image explicit `width`/`height` (or `fill` with a sized parent), a meaningful `alt` (empty `alt=""` only for decorative images), `sizes` for responsive images, and `priority` only for the above-the-fold image. Allow remote hosts (for example Google avatars) in `images.remotePatterns` in `next.config.ts`.

```tsx
<Image src="/logo.png" alt="Vitaflow" width={160} height={48} priority />
```

**Fonts**: load fonts with `next/font/google`, which downloads them at build time and serves them from the app's own origin, so there is no runtime request to Google. Declare fonts once in the root layout and expose them as CSS variables.

```tsx
// app/layout.tsx
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});
```

**Refinement**: `publicFooter.tsx` loads `Great_Vibes` inside a component. Move new decorative fonts to the root layout (or the route layout that needs them) so font loading stays in one place.

---

## 8. TypeScript everywhere, and validated environment variables

All code is TypeScript in strict mode; no `any` without a `// code-standards:` justification. Type props, action inputs (Zod-inferred), and API responses (`src/_types`).

Environment variables are read in one place and validated. Read them through a central helper (`src/_lib/getenv.ts`) that throws a clear error when a required variable is missing, and validate the full set with a Zod schema at startup.

- Secrets (`STRIPE_API_KEY`, `APP_SECRET_KEY`, `AUTH_SECRET`, `BACKEND_URL`) have **no** `NEXT_PUBLIC_` prefix and are read only in server code.
- A variable prefixed `NEXT_PUBLIC_` is inlined into the browser bundle: use it only for values that are safe to be public, never for a key, secret, or token.

```ts
// src/_lib/env.ts (server-only)
const serverEnvSchema = z.object({
  BACKEND_URL: z.url(),
  APP_SECRET_KEY: z.string().min(1),
  STRIPE_API_KEY: z.string().startsWith('sk_'),
});
export const env = serverEnvSchema.parse(process.env);
```

**Refinement**: `apiClient` currently reads `process.env.APP_SECRET_KEY` directly. New code goes through the validated helper instead of touching `process.env`.

---

## 9. Components: functional, at most 50 lines, explicit props

- **Functional components only** — function declarations with hooks; no class components.
- **At most 50 lines per component** (the function body, JSX included). When a component grows past that, extract sub-components and pure helpers. This is the `code-standards.md` function-length rule applied to components.
- **Explicit props**: declare a props interface and pass each prop by name. Do not spread `{...props}` into a component or element you own.

**Bad**

```tsx
function PlanList(props: any) {
  return <PlanCard {...props} />;
}
```

**Good**

```tsx
interface PlanCardProps {
  name: string;
  price: number;
  isCurrent: boolean;
}

function PlanList({ plans, currentId }: PlanListProps) {
  return plans.map(plan => (
    <PlanCard
      key={plan.id}
      name={plan.name}
      price={plan.price}
      isCurrent={plan.id === currentId}
    />
  ));
}
```

**Refinement**: the shadcn/ui primitives in `src/_components/ui/` intentionally forward `...props` to the underlying Radix element and may exceed 50 lines (`sidebar.tsx` is the largest). They are vendored library code: leave their shape alone, and do not copy the spread pattern into feature components.

---

## 10. Memoize heavy values with `useMemo`; do not memoize everything

Use `useMemo` to pre-compute a value that is expensive to derive from props or state (large list filtering, sorting, or aggregation) so it is not recomputed on every render, and to keep a context value referentially stable.

```tsx
const visibleRows = useMemo(
  () => rows.filter(matchesFilter).sort(byDate),
  [rows, matchesFilter]
);

const value = useMemo(() => ({ setDirty }), []); // stable context value
```

**Refinement**: `useMemo` is for costly work, not a default. A cheap expression (string concatenation, a single comparison) is clearer without it. Prefer moving pure computation into a `_lib` function that can be unit tested, and memoize its call only when profiling or the list size justifies it.

---

## 11. Unit tests for components and logic

Every component has a unit test, and every piece of logic behind it is a pure function with its own test. The suite uses **Vitest in a `node` environment** (no jsdom), so:

- Test components with `renderToStaticMarkup` and assert on the markup (text, roles, `aria-*` attributes, classes). Mock server actions, `next/navigation`, and the alert hook with `vi.mock`.
- Put logic in `_lib` (formatters, reducers, schedules, mappers) and test it directly; keep hooks thin so what they decide is covered by those pure tests.
- Test Server Actions with `@/auth` and `@/_lib/apiClient` mocked, covering: no session, success, and backend failure (with a generic error message).
- Behavior that needs a real DOM (focus, pointer events, timers, resizing) is verified in the browser, and the pure part of it is still unit tested.

```tsx
// planPanel.test.tsx
it('shows "Seu plano atual" only on the current plan card', () => {
  const html = renderToStaticMarkup(
    <PlanPanel plans={CATALOG} productId="premium" />
  );
  expect(html).toContain('Seu plano atual');
});
```

Test files sit next to the file they test (`planPanel.tsx` / `planPanel.test.tsx`).

---

## Enforcement

Follow this document together with [`../code-standards.md`](../code-standards.md). Both are checked in code review; a deliberate exception is marked with `// code-standards: <rule> — <reason>` at the point of deviation.
