---
name: vitaflow-frontend-conventions
description: Apply vitaflow-frontend's Next.js App Router conventions (Server Components by default, route/feature structure, Server Actions, caching, images/fonts, env vars, component size, Vitest patterns) whenever writing or reviewing frontend code in vitaflow-frontend. Builds on vitaflow-code-standards, which still applies.
---

# Vitaflow Frontend Conventions

Rules specific to `vitaflow-frontend` (Next.js 16 App Router, React, TypeScript, Auth.js, ZSA, Zod, Tailwind + shadcn/ui, Vitest). They build on the language-agnostic rules in the `vitaflow-code-standards` skill (English-only code, function length, nesting, parameter count, one type per file), which still apply. For starting work on a new PRD (worktree, branch, registration), use the `vitaflow-git-workflow` skill.

## Procedure

1. Read `frontend-next.md` in this repo's root in full before writing or reviewing frontend code — it carries the complete rule set with bad/good examples and the marked **Refinement** notes (where the codebase's actual convention is stated explicitly because it's been inconsistent), which this skill does not duplicate.
2. Apply its 11 rules:
   - Server Components by default; add `'use client'` only for state/effects/browser APIs/event handlers, pushed down to the smallest interactive leaf.
   - Routes under `src/app/`, grouped by feature; code shared across routes goes in the matching underscore-prefixed folder (`_components`, `_actions`, `_lib`, `_hooks`, `_types`, `_schema`, `_constants`).
   - `page.tsx` only orchestrates (session, data fetch, failure state, composition) — no business logic, formatting, or large JSX.
   - Fetch only through `apiClient` (`src/_lib/apiClient.ts`) in Server Components/Actions; never call the backend from the browser or pass secrets/tokens to a Client Component.
   - Choose `fetch` caching deliberately per request: `no-store` for user-specific data (the `apiClient` default), `force-cache`/`revalidate` for shared rarely-changing data, `tags` + `revalidateTag` for data that must refresh after a mutation.
   - Forms/mutations are ZSA Server Actions in `src/_actions/<domain>/`, not `route.ts` endpoints — exception: Stripe webhook and Auth.js handlers.
   - `next/image` always (never raw `<img>`), with explicit `width`/`height`, meaningful `alt`, `sizes`, and `priority` only above the fold; fonts via `next/font/google`, declared once in the root layout.
   - TypeScript strict mode everywhere; env vars read through one validated helper, never `process.env` directly in new code; no `NEXT_PUBLIC_` prefix on a secret.
   - Components are functional, at most 50 lines, with an explicit named props interface — no `{...props}` spread into an owned component (shadcn/ui primitives in `src/_components/ui/` are the stated exception).
   - `useMemo` only for genuinely costly derivations or referential stability, not by default; prefer a tested `_lib` function.
   - Every component has a unit test (Vitest, `node` environment, no jsdom): `renderToStaticMarkup` for components, direct tests for `_lib` pure functions, mocked `@/auth`/`apiClient` for Server Actions; DOM-dependent behavior (focus, pointer, timers) is verified in the browser. Test files sit next to the file they test.
3. A deliberate exception is marked with `// code-standards: <rule> — <reason>` at the point of deviation, same mechanism as `vitaflow-code-standards`.

Done when the written/reviewed frontend code follows every rule in `frontend-next.md` (and `code-standards.md`), or every deviation carries its marker comment.
