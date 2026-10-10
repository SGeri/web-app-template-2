# Prevost Tracking Platform

Next.js App Router project for the Prevost tracking platform. Stack so far:

- **Next.js 16** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (`base-nova`, Base UI)
- **Prisma ORM 7** + **PostgreSQL 18** (Docker Compose)
- **better-auth** (email/password, Prisma adapter)
- **ESLint 9** (flat config) + **Prettier 3**

Package manager: **pnpm**.

## Prerequisites

- Node.js 20+
- pnpm (`packageManager` is pinned in `package.json`)
- Docker (for local Postgres)

## Setup

```bash
pnpm install
```

Create a `.env` in the project root with at least:

```bash
DATABASE_URL="postgresql://prevost:prevost@localhost:5432/prevost_tracking"
```

Start Postgres, generate the Prisma client, and apply migrations:

```bash
pnpm db:up
pnpm prisma:generate
pnpm prisma:migrate
```

Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` / `pnpm start` | Production build & serve |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm db:up` / `pnpm db:down` | Start/stop Postgres via Docker Compose |
| `pnpm prisma:generate` | Generate Prisma Client → `src/generated/prisma` |
| `pnpm prisma:migrate` | Run `prisma migrate dev` |
| `pnpm prisma:studio` | Prisma Studio |
| `pnpm auth:generate` | Sync better-auth models into `prisma/schema.prisma` |

## Project layout

```text
src/
  app/                 # App Router pages & API routes
  app/api/auth/        # better-auth catch-all handler
  components/ui/       # shadcn/ui components
  hooks/               # Shared hooks (e.g. use-mobile)
  lib/
    auth.ts            # better-auth server config
    auth-client.ts     # better-auth client
    prisma.ts          # Prisma Client singleton (pg adapter)
    utils.ts           # `cn` helper
prisma/
  schema.prisma
  migrations/
docker-compose.yml     # local Postgres 18
prisma7.config.ts      # Prisma 7 config (datasource URL from env)
eslint.config.mjs
prettier.config.mjs
components.json        # shadcn config
```

## Stack notes

### Database (Prisma + Postgres)

- Prisma 7 config lives in `prisma7.config.ts` (loads `DATABASE_URL` via `dotenv`).
- Client is generated to `src/generated/prisma` and used through `src/lib/prisma.ts` with `@prisma/adapter-pg`.
- Local DB defaults (from `docker-compose.yml`): user/password `prevost`, database `prevost_tracking`, port `5432`.

### Auth (better-auth)

- Server: `src/lib/auth.ts` (Prisma adapter, email/password, `nextCookies`).
- Client: `src/lib/auth-client.ts`.
- API route: `src/app/api/auth/[...all]/route.ts`.
- Auth tables (`user`, `session`, `account`, `verification`) are in the Prisma schema / migrations.

### UI (shadcn + Tailwind v4)

- Style preset: `base-nova` (see `components.json`).
- Theme tokens and Tailwind entry: `src/app/globals.css`.
- Full shadcn component set under `src/components/ui/`.

### Lint & format

- **ESLint**: Next `core-web-vitals` + TypeScript, plus `typescript-eslint` strict and a small custom rule set. Formatting rules are disabled via `eslint-config-prettier`. shadcn UI paths are relaxed so regenerated components don’t fail CI-style checks.
- **Prettier**: `prettier.config.mjs` with `prettier-plugin-tailwindcss` (stylesheet: `src/app/globals.css`; class helpers: `cn`, `cva`).
- **EditorConfig**: `.editorconfig` aligns indent/EOL with Prettier.

```bash
pnpm lint
pnpm format:check
```

## What’s in place (git history)

1. Initial Next.js app (`create-next-app`)
2. Prisma 7 + Docker Postgres + base packages
3. better-auth wiring + auth schema migration
4. shadcn/ui component install
5. ESLint policy + Prettier setup (staged / in progress)

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [Prisma docs](https://www.prisma.io/docs)
- [better-auth docs](https://www.better-auth.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
