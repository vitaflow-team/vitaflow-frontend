<div align="center">
  <img src="./public/vitaflow.svg" alt="Vitaflow Logo" width="200" />
</div>

<h1 align="center">Vitaflow Frontend</h1>

<p align="center">
  Vitaflow's web application, built with Next.js 16 — the interface used by
  students/patients, nutritionists, physical educators and gyms.
</p>

<p align="center">
  <a href="./README.md">🇧🇷 Português</a> | 🇺🇸 English
</p>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## About the project

**Vitaflow** connects **students/patients** with **health professionals** —
personal trainers (physical educators) and nutritionists — and also serves
**gyms (academias)**, which employ physical educators and manage their own
students.

This repository is the web application (used by students, professionals and gym
owners) that talks to the API in
[`vitaflow-backend`](https://github.com/vitaflow-team/vitaflow-backend) through a
typed HTTP client and Server Actions.

### What the platform offers

- **For students/patients**: tracking prescribed workouts and meal plans, a food
  diary, progress tracking (weight/measurements/photos), professional search and
  connection, scheduling, messages and notifications. Advanced features (detailed
  charts, reports, unlimited chat) are part of the Premium plan.
- **For physical educators**: registering and managing students (private or from a
  gym), prescribing workouts (with AI-assisted generation), physical assessments
  via customizable templates, a schedule with fixed and one-off time slots.
- **For nutritionists**: registering patients, anamnese and assessment via
  customizable templates (with automatic BMI), creating and publishing versioned
  meal plans, viewing the patient's own food diary.
- **For gyms**: a dashboard with key metrics, managing employed educators
  (invitations), the gym's own student roster, an access-plan catalog, check-in,
  recurring classes and an engagement view.
- **Internal area (backoffice)**: an account directory, staff activation, audited
  "view as" sessions, and an audit log.

## Technologies

- **[Next.js 16](https://nextjs.org/)** (App Router + Turbopack) — React framework
  with server-side rendering
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
  (Radix UI)** — styling and accessible components
- **[Auth.js (NextAuth v5)](https://authjs.dev/)** — authentication and session
- **[ZSA](https://zsa.dev/) + zsa-react** — end-to-end type-safe Server Actions
- **[Zod 4](https://zod.dev/)** — schema validation
- **[React Hook Form](https://react-hook-form.com/)** — forms
- **[Recharts](https://recharts.org/)** — charts (progress, engagement)
- **[@tanstack/react-table](https://tanstack.com/table)** — data tables
- **[Stripe.js](https://stripe.com/docs/js) + React Stripe Elements** — checkout
  and subscription management
- **[Upstash Ratelimit](https://upstash.com/) + Vercel KV** (optional) —
  middleware rate limiting (brute-force protection)
- **[Vitest](https://vitest.dev/)** — unit and component testing
- **ESLint, Prettier, Husky, lint-staged, Commitlint** — code and commit
  standardization (Conventional Commits)
- **Yarn** — package manager

### Architecture at a glance

- **Server Components by default**: data loads on the server; interactivity lives
  in explicit Client Components (`'use client'`).
- **Server Actions (ZSA)**: every write goes through a typed Server Action, never
  a Next.js API route of its own.
- **`apiClient`**: the single call-site to the backend, automatically injecting
  the session token and the shared secret (`x-application-secret`).
- **`middleware.ts`**: guards routes by account type and applies rate limiting on
  authentication routes.
- **250+ test files** (Vitest) covering pure logic, components and Server Actions.

## Installation

### Prerequisites

- **Node.js** 20 or higher
- **Yarn**
- A running instance of
  [`vitaflow-backend`](https://github.com/vitaflow-team/vitaflow-backend) (local or
  deployed) — needed for `BACKEND_URL`

### 1. Clone and install dependencies

```bash
cd vitaflow-frontend
yarn install
```

### 2. Configure environment variables

Create a `.env.local` (or `.env`) file at the project root:

| Variable                                    | Required        | Description                                                                                                                                                                                |
| ------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BACKEND_URL`                               | ✅              | The API's base URL (`http://localhost:3333` in local development)                                                                                                                          |
| `APP_SECRET_KEY`                            | ✅              | Secret sent to the backend in the `x-application-secret` header — must be **identical** to the backend's `APPLICATION_SECRET`                                                              |
| `AUTH_URL` or `NEXTAUTH_URL`                | ✅ (either one) | The app's own base URL, used by Auth.js                                                                                                                                                    |
| `AUTH_SECRET` or `NEXTAUTH_SECRET`          | ✅ (either one) | Auth.js session-signing secret (generate with `openssl rand -base64 32`)                                                                                                                   |
| `STRIPE_API_KEY`                            | ✅              | Stripe secret key (same account as the backend)                                                                                                                                            |
| `STRIPE_WEBHOOK_SECRET`                     | ✅              | Stripe webhook secret, used to validate incoming events                                                                                                                                    |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional        | Google sign-in — set both to enable, or leave both blank                                                                                                                                   |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`        | optional        | Stripe publishable key; `@stripe/stripe-js`/`@stripe/react-stripe-js` are already a dependency, but checkout currently redirects server-side rather than using client-side Stripe Elements |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN`     | optional        | Vercel KV / Upstash Redis for middleware rate limiting; without these, rate limiting is silently skipped                                                                                   |

> Server-side variables are validated at startup (`src/_lib/serverEnv.ts`); a
> missing required variable crashes the process with a message naming exactly
> what's missing.

### 3. Run in development

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) (Turbopack dev server).

## Build & production

```bash
yarn build   # next build --turbopack
yarn start   # next start — serves on port 3000 (PORT=3000 in the Docker image)
```

### Docker

```bash
docker compose up
```

Builds the image via `Dockerfile` (Node 20 alpine, multi-stage) and exposes port
`3000`.

## Testing & quality

```bash
yarn test           # unit/component tests (Vitest)
yarn lint            # ESLint
yarn lint:fix         # ESLint with auto-fix
yarn format           # Prettier --write
yarn format:check     # Prettier --check
```

## Project structure

```
src/
├── _actions/       # Server Actions (ZSA) — every write path
├── _components/     # React components, organized by domain
├── _constants/       # Routes, copy and global configuration
├── _hooks/            # Shared React hooks
├── _lib/               # apiClient, authorization, formatting, utilities
├── _schema/             # Zod validation schemas
├── _types/               # Shared TypeScript types
├── app/                   # App Router routes (pages, layouts, metadata)
├── auth.ts                # Auth.js configuration
└── middleware.ts           # Route protection and rate limiting
```

## Security

- **Rate limiting** on authentication routes via middleware, using Vercel
  KV/Upstash when configured.
- **Server-side validation** with Zod on every mutation (never trusts client-side
  form validation alone).
- **Security headers** configured in `next.config.ts`.
- **Server Actions** keep secrets and business logic out of the bundle shipped to
  the browser.

## Conventions

- Files in `camelCase` (e.g. `userMenu.tsx`, `apiClient.ts`).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/),
  always lower-case in the subject, enforced by `commitlint` via Husky.
- Feature branches follow `feature/<slug>`.
- Development is driven by PRDs/TechSpecs kept outside this repository, under
  `.compozy/tasks/<feature>/`.

---

<p align="center">
  Built by the Vitaflow team
</p>
