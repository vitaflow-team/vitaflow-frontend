---
name: vitaflow-frontend-conventions
description: Apply vitaflow-frontend's Next.js App Router conventions (Server Components by default, route/feature structure, Server Actions, caching, images/fonts, env vars, component size, Vitest patterns) whenever writing or reviewing frontend code in vitaflow-frontend. Builds on vitaflow-code-standards, which still applies.
---

# Vitaflow Frontend Conventions

Rules specific to `vitaflow-frontend` (Next.js 16 App Router, React, TypeScript, Auth.js, ZSA, Zod, Tailwind + shadcn/ui, Vitest), building on `vitaflow-code-standards` (English-only code, function length, nesting, parameter count, one type per file), which still applies. For starting a new PRD (worktree, branch, registration), use `vitaflow-git-workflow`.

New code follows this document; existing code is brought in line opportunistically, not through mass rewrites.

## 1. Server Components by default

Add `'use client'` only when a file uses state/effect hooks (`useState`, `useEffect`, `useReducer`, a `useRef` timer), browser APIs, or event handlers — pushed down to the smallest interactive leaf, not the whole page or section. A component that's client-only because a **child** is interactive is a smell: split it so the parent stays server. Context providers are the standing exception, since they must wrap their children.

## 2. App Router, organized by feature

Routes live under `src/app/`, grouped by feature (`app/restrict/settings`, `app/signin`); a route folder holds its `page.tsx`/`layout.tsx` and the components used only by that route. Route groups like `(public)` separate areas without changing the URL. Code shared across routes goes in underscore-prefixed folders (never routable): `_components/<feature>/` (and `_components/ui/` for shadcn/ui primitives), `_actions/<domain>/` (Server Actions), `_lib/` (pure logic, server-only helpers), `_hooks/`, `_types/` (one type per file), `_schema/` (Zod), `_constants/`.

## 3. `page.tsx` only orchestrates

Reads `searchParams`/`params` (promises in Next 16 — always `await` them, validate any value before use), checks the session, fetches data on the server, handles the failure state, composes components. No business logic, formatting, or large JSX — that moves to `_lib` helpers and `_components`.

## 4. Fetch on the server; secrets stay on the server

Read data through `apiClient` (`src/_lib/apiClient.ts`) in Server Components/Actions only — it attaches the user's bearer token and the `x-application-secret` header. Never call the backend from the browser, and never pass a token, secret, or other sensitive identifier to a Client Component as a prop — pass only the serializable subset it actually needs.

## 5. Cache per request, deliberately

`no-store` for user-specific or real-time data (the `apiClient` default). `force-cache` / `next: { revalidate: N }` for data shared by all users that changes rarely (the plan catalog). `next: { tags: [...] }` plus `revalidateTag(...)` for data that must refresh right after a mutation. Never cache a response that carries user data across users.

## 6. Server Actions for forms and mutations, not API endpoints

ZSA (`createServerAction().input(schema).handler(...)`, `'use server'`) in `src/_actions/<domain>/` — never a `route.ts` just to receive a form post. Every action checks the session first, validates input with a Zod schema, calls the backend through `apiClient`, and converts failure to a `ZSAError` — never the raw error's own `.message` (it may carry backend internals). Map a specific, expected failure to safe copy through `safeActionError`/`ErrorMapping` (`src/_lib/safeActionError.ts`), matched on `AppError.statusCode`/`code`; anything unmapped falls back to `SAFE_ACTION_FALLBACK`. The Auth.js handlers (`app/api/auth/`) are the only Route Handlers the app needs — nothing else should add one.

## 7. Images and fonts

Always `next/image` (`<Image />`), never a raw `<img>`: explicit `width`/`height` (or `fill` with a sized parent), a meaningful `alt` (empty only for decorative images), `sizes` for responsive images, `priority` only above the fold. Remote hosts (e.g. Google avatars) go in `images.remotePatterns` in `next.config.ts`. Fonts load via `next/font/google`, declared once in the root layout as CSS variables — don't load a font inside a leaf component.

## 8. TypeScript strict, validated environment variables

Strict mode everywhere; no `any` without a `// code-standards:` justification. Env vars are read through the validated `env` export (`src/_lib/env.ts`, built on `parseServerEnv` in `src/_lib/serverEnv.ts`) — never `process.env` directly in new code. A secret has **no** `NEXT_PUBLIC_` prefix and is read only in server code; that prefix inlines a value into the browser bundle, so use it only for values safe to be public.

## 9. Components: functional, ≤ 50 lines, explicit props

Function declarations with hooks, no class components. Declare a named props interface and pass each prop explicitly — never spread `{...props}` into an element or component you own. The shadcn/ui primitives in `src/_components/ui/` are vendored, forward `...props` to Radix, and may exceed 50 lines — leave their shape alone and don't copy the spread pattern into feature components.

## 10. `useMemo` for genuinely costly work only

Pre-compute an expensive derivation (large filter/sort/aggregation) or keep a context value referentially stable. Not a default for a cheap expression — prefer a tested `_lib` function and memoize its call only when profiling or list size justifies it.

## 11. Unit tests, Vitest in a `node` environment (no jsdom)

Every component and the logic behind it has a test. Render components with `renderToStaticMarkup` and assert on markup (text, roles, `aria-*`, classes); mock `@/auth`, `apiClient`, and `next/navigation` with `vi.mock`. Pure logic lives in `_lib` (formatters, reducers, mappers) and is tested directly, keeping hooks thin. Test Server Actions for: no session, success, and backend failure (generic message). Behavior needing a real DOM (focus, pointer, timers, resizing) is verified in the browser, with its pure part still unit tested. Test files sit next to what they test.

## Enforcement

Follow this skill together with `vitaflow-code-standards`. Both are checked in code review; a deliberate exception is marked `// code-standards: <rule> — <reason>` at the point of deviation.
