<div align="center">
  <img src="./public/vitaflow.svg" alt="Vitaflow Logo" width="200" />
</div>

<h1 align="center">Vitaflow Frontend</h1>

<p align="center">
  Aplicação web do Vitaflow, construída com Next.js 16 — a interface usada por
  alunos/pacientes, nutricionistas, educadores físicos e academias.
</p>

<p align="center">
  🇧🇷 Português | <a href="./README.en.md">🇺🇸 English</a>
</p>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## Sobre o projeto

O **Vitaflow** conecta **alunos/pacientes** a **profissionais de saúde** — personal
trainers (educadores físicos) e nutricionistas — e também atende **academias**, que
empregam educadores físicos e gerenciam seus próprios alunos.

Este repositório é a aplicação web (consumida por alunos, profissionais e donos de
academia) que fala com a API em
[`vitaflow-backend`](https://github.com/vitaflow-team/vitaflow-backend) através de
um cliente HTTP tipado e de Server Actions.

### O que a plataforma oferece

- **Para alunos/pacientes**: acompanhamento de treinos e planos alimentares
  prescritos, diário alimentar, evolução (peso/medidas/fotos), busca e conexão com
  profissionais, agenda, mensagens e notificações. Recursos avançados (gráficos
  detalhados, relatórios, chat ilimitado) fazem parte do plano Premium.
- **Para educadores físicos**: cadastro e ficha de alunos (particulares ou de uma
  academia), prescrição de treinos (com geração assistida por IA), avaliações
  físicas por modelos customizáveis, agenda com horários fixos e avulsos.
- **Para nutricionistas**: cadastro de pacientes, anamnese e avaliação por modelos
  customizáveis (com IMC automático), criação e publicação de planos alimentares
  versionados, visão do diário alimentar do paciente.
- **Para academias**: painel com indicadores, gestão de educadores empregados
  (convites), alunos da academia, catálogo de planos de acesso, check-in, turmas
  recorrentes e engajamento.
- **Área interna (backoffice)**: diretório de contas, ativação de equipe, sessões
  "ver como" (view as) e trilha de auditoria.

## Tecnologias

- **[Next.js 16](https://nextjs.org/)** (App Router + Turbopack) — framework React
  com renderização no servidor
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
  (Radix UI)** — estilização e componentes acessíveis
- **[Auth.js (NextAuth v5)](https://authjs.dev/)** — autenticação e sessão
- **[ZSA](https://zsa.dev/) + zsa-react** — Server Actions tipadas de ponta a ponta
- **[Zod 4](https://zod.dev/)** — validação de esquemas
- **[React Hook Form](https://react-hook-form.com/)** — formulários
- **[Recharts](https://recharts.org/)** — gráficos (evolução, engajamento)
- **[@tanstack/react-table](https://tanstack.com/table)** — tabelas de dados
- **[Stripe.js](https://stripe.com/docs/js) + React Stripe Elements** — checkout e
  gestão de assinatura
- **[Upstash Ratelimit](https://upstash.com/) + Vercel KV** (opcional) — limitação
  de requisições no middleware (proteção contra força bruta)
- **[Vitest](https://vitest.dev/)** — testes unitários e de componentes
- **ESLint, Prettier, Husky, lint-staged, Commitlint** — padronização de código e
  commits (Conventional Commits)
- **Yarn** — gerenciador de pacotes

### Arquitetura em poucas palavras

- **Server Components por padrão**: carregam dados no servidor; interatividade vive
  em Client Components (`'use client'`) explícitos.
- **Server Actions (ZSA)**: toda escrita passa por uma Server Action tipada, nunca
  por uma rota de API própria do Next.js.
- **`apiClient`**: único ponto de chamada ao backend, injeta o token de sessão e o
  segredo compartilhado (`x-application-secret`) automaticamente.
- **`middleware.ts`**: protege rotas por tipo de conta e aplica rate limiting nas
  rotas de autenticação.
- **250+ arquivos de teste** (Vitest) cobrindo lógica pura, componentes e Server
  Actions.

## Instalação

### Pré-requisitos

- **Node.js** 20 ou superior
- **Yarn**
- Uma instância do [`vitaflow-backend`](https://github.com/vitaflow-team/vitaflow-backend)
  em execução (local ou implantada) — necessária para `BACKEND_URL`

### 1. Clonar e instalar dependências

```bash
cd vitaflow-frontend
yarn install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` (ou `.env`) na raiz do projeto:

| Variável                                    | Obrigatória       | Descrição                                                                                                                                                                                                   |
| ------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BACKEND_URL`                               | ✅                | URL base da API (`http://localhost:3333` em desenvolvimento local)                                                                                                                                          |
| `APP_SECRET_KEY`                            | ✅                | Segredo enviado ao backend no header `x-application-secret` — deve ser **idêntico** ao `APPLICATION_SECRET` do backend                                                                                      |
| `AUTH_URL` ou `NEXTAUTH_URL`                | ✅ (uma das duas) | URL base da própria aplicação, usada pelo Auth.js                                                                                                                                                           |
| `AUTH_SECRET` ou `NEXTAUTH_SECRET`          | ✅ (uma das duas) | Segredo de assinatura de sessão do Auth.js (gere com `openssl rand -base64 32`)                                                                                                                             |
| `STRIPE_API_KEY`                            | ✅                | Chave secreta do Stripe (mesma conta do backend)                                                                                                                                                            |
| `STRIPE_WEBHOOK_SECRET`                     | ✅                | Segredo do webhook do Stripe, para validar eventos recebidos                                                                                                                                                |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | opcional          | Login com Google — defina ambas para habilitar, ou deixe ambas em branco                                                                                                                                    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`        | opcional          | Chave pública do Stripe; `@stripe/stripe-js`/`@stripe/react-stripe-js` já estão nas dependências, mas o checkout atual é feito via redirecionamento do lado do servidor, não via Stripe Elements no cliente |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN`     | opcional          | Vercel KV / Upstash Redis para rate limiting no middleware; sem essas variáveis, o rate limiting é ignorado silenciosamente                                                                                 |

> As variáveis do servidor são validadas na inicialização (`src/_lib/serverEnv.ts`);
> uma variável obrigatória ausente derruba o processo com uma mensagem listando
> exatamente o que falta.

### 3. Rodar em desenvolvimento

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) (servidor Turbopack).

## Build e produção

```bash
yarn build   # next build --turbopack
yarn start   # next start — serve na porta 3000 (PORT=3000 na imagem Docker)
```

### Docker

```bash
docker compose up
```

Constrói a imagem via `Dockerfile` (Node 20 alpine, multi-stage) e expõe a porta
`3000`.

## Testes e qualidade

```bash
yarn test           # testes unitários/componentes (Vitest)
yarn lint            # ESLint
yarn lint:fix         # ESLint com correção automática
yarn format           # Prettier --write
yarn format:check     # Prettier --check
```

## Estrutura do projeto

```
src/
├── _actions/       # Server Actions (ZSA) — toda a lógica de escrita
├── _components/     # Componentes React, organizados por domínio
├── _constants/       # Rotas, textos e configurações globais
├── _hooks/            # Hooks React compartilhados
├── _lib/               # apiClient, autorização, formatação, utilitários
├── _schema/             # Esquemas de validação Zod
├── _types/               # Tipos TypeScript compartilhados
├── app/                   # Rotas do App Router (páginas, layouts, metadata)
├── auth.ts                # Configuração do Auth.js
└── middleware.ts           # Proteção de rotas e rate limiting
```

## Segurança

- **Rate limiting** nas rotas de autenticação via middleware, usando Vercel
  KV/Upstash quando configurado.
- **Validação do lado do servidor** com Zod em toda mutação (nunca confia apenas na
  validação do formulário no cliente).
- **Cabeçalhos de segurança** configurados em `next.config.ts`.
- **Server Actions** mantêm segredos e lógica de negócio fora do bundle enviado ao
  navegador.

## Convenções

- Arquivos em `camelCase` (ex.: `userMenu.tsx`, `apiClient.ts`).
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/),
  sempre em minúsculas no assunto, reforçado por `commitlint` via Husky.
- Branches de feature seguem `feature/<slug>`.
- O desenvolvimento é guiado por PRDs/TechSpecs mantidos fora do repositório, em
  `.compozy/tasks/<feature>/`.

---

<p align="center">
  Desenvolvido pela equipe Vitaflow
</p>
