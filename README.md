# Vitaflow Frontend

Welcome to the **Vitaflow** frontend repository, a modern application built with **Next.js 16** focused on performance and security.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Server Actions**: [ZSA](https://zsa.dev/) (Type-safe Server Actions)
- **Validation**: [Zod](https://zod.dev/)

## 🏃 About the Application

**Vitaflow** connects students with health professionals (Personal Trainers and Nutritionists). The platform offers specific features for each profile:

### For Students

- **Free**: View workouts/diets, record basic measurements, notifications.
- **Premium**: Detailed charts (anthropometry, performance), smartwatch integration (Google Fit, Apple Health), unlimited chat with professionals, and PDF reports.

### For Personal Trainers

- **Professional**: Unlimited student registration, prescribe personalized workouts, management agenda, and evolution reports.
- **Premium**: All previous + Financial Management (receivables, receipt issuance, PIX integration), revenue charts, and creation of plan packages.

### For Nutritionists

- **Professional**: Register patients, prescribe menus/meal plans, track measurements (skinfolds), and agenda.
- **Premium**: All previous + Complete Financial Management, automatic reminders for patients, creation of challenge groups, and comparative charts.

## 🛡️ Security

This project follows strict security practices:

1.  **Rate Limiting**: Brute-force protection on login/signup routes via Middleware (`src/middleware.ts`) using Redis.
2.  **Input Validation**: All data (forms, uploads) is validated server-side using Zod.
3.  **Security Headers**: Configured in `next.config.ts` (X-Frame-Options, CSP, etc.).
4.  **Server Actions**: Exclusive use of `use server` to isolate business logic and API keys.

## 🛠️ Installation and Setup

### 1. Prerequisites

- Node.js 20+
- Yarn or NPM

### 2. Environment Variables

Create a `.env` file in the root directory based on the example below:

```env
# Backend URL (API)
BACKEND_URL=https://api.youraddress.com

# NextAuth
AUTH_SECRET="your-secret-key-generated-with-openssl"

# (Optional) Google Auth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# (Optional) Rate Limiting (Vercel KV / Upstash)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### 3. Running the Project

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Access [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```
src/
├── _actions/      # Server Actions (Business Logic)
├── _components/   # React Components (UI and Layouts)
├── _constants/    # Global Constants (Routes, Configs)
├── _lib/          # Utilities (API Client, Error Handling)
├── _schema/       # Zod Validation Schemas
├── app/           # App Router (Pages and Routes)
└── middleware.ts  # Route Protection and Rate Limiting
```

## 📝 Conventions

- **Files**: camelCase (e.g., `userMenu.tsx`, `apiClient.ts`).
- **Commits**: Conventional Commits (e.g., `feat: add new login page`).

---

Developed by the Vitaflow team.
