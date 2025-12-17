# Vitaflow Frontend

Bem-vindo ao repositório frontend do **Vitaflow**, uma aplicação moderna construída com **Next.js 16** e focada em performance e segurança.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Autenticação**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Server Actions**: [ZSA](https://zsa.dev/) (Type-safe Server Actions)
- **Validação**: [Zod](https://zod.dev/)

## 🏃 Sobre a Aplicação

O **Vitaflow** conecta alunos a profissionais de saúde (Personal Trainers e Nutricionistas). A plataforma oferece funcionalidades específicas para cada perfil:

### Para Alunos

- **Gratuito**: Visualização de treinos/dietas, registro de medidas básicas e notificações.
- **Premium**: Gráficos detalhados (antropometria, performance), integração com smartwatches (Google Fit, Apple Health), chat ilimitado com profissionais e relatórios em PDF.

### Para Personal Trainers

- **Profissional**: Cadastro ilimitado de alunos, prescrição de treinos personalizados, agenda de gestão e relatórios de evolução.
- **Premium**: Tudo do anterior + Gestão Financeira (contas a receber, emissão de recibos, integração PIX), gráficos de receita e criação de pacotes de planos.

### Para Nutricionistas

- **Profissional**: Cadastro de pacientes, prescrição de cardápios, acompanhamento de medidas (dobras cutâneas) e agenda.
- **Premium**: Tudo do anterior + Gestão Financeira completa, lembretes automáticos para pacientes, criação de grupos de desafios e gráficos comparativos.

## 🛡️ Segurança

Este projeto segue práticas rigorosas de segurança:

1.  **Rate Limiting**: Proteção contra força bruta em rotas de login/signup via Middleware (`src/middleware.ts`) usando Redis.
2.  **Validação de Input**: Todos os dados (formulários, uploads) são validados no servidor com Zod.
3.  **Security Headers**: Configurados em `next.config.ts` (X-Frame-Options, CSP, etc.).
4.  **Server Actions**: Uso exclusivo de `use server` para isolar lógica de negócio e chaves de API.

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos

- Node.js 20+
- Yarn ou NPM

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz baseado no exemplo abaixo:

```env
# URL do Backend (API)
BACKEND_URL=https://api.seurendereco.com

# NextAuth
AUTH_SECRET="sua-chave-secreta-gerada-com-openssl"

# (Opcional) Google Auth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# (Opcional) Rate Limiting (Vercel KV / Upstash)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### 3. Rodando o Projeto

```bash
# Instalar dependências
yarn install

# Rodar servidor de desenvolvimento
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 📂 Estrutura do Projeto

```
src/
├── _actions/      # Server Actions (Lógica de negócio)
├── _components/   # Componentes React (UI e Layouts)
├── _constants/    # Constantes globais (Rotas, Configs)
├── _lib/          # Utilitários (API Client, Error Handling)
├── _schema/       # Schemas de validação Zod
├── app/           # App Router (Páginas e Rotas)
└── middleware.ts  # Proteção de rotas e Rate Limiting
```

## 📝 Convenções

- **Arquivos**: camelCase (ex: `userMenu.tsx`, `apiClient.ts`).
- **Commits**: Conventional Commits (ex: `feat: add new login page`).

---

Desenvolvido pela equipe Vitaflow.
