<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development Guildlines

For TypeScript code style and best practices: @docs/typescript-guidelines.md

# nextjs-wha-app-starter

## Framework & toolchain quirks

- **Next.js 16** — bundled docs at `node_modules/next/dist/docs/`. `next.config.ts` sets `cacheComponents: true` (new in 16).
- **Tailwind v4** — PostCSS plugin is `@tailwindcss/postcss`, not `tailwindcss`. Config is done via CSS, not `tailwind.config.*`.
- **ESLint v9** flat config in `eslint.config.mjs` using `eslint/config`.
- **Prisma v7** — config file is `prisma.config.ts` (not `prisma/schema.prisma`). Uses `@prisma/adapter-mariadb` driver adapter. Generated client output: `generated/prisma/` (gitignored). Run `npm run build` which auto-runs `prisma generate`, or `npx prisma generate` manually.
- **Better Auth 1.6.11** — pinned exact version. Server setup in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`. API route: `src/app/api/auth/[...all]/route.ts`.
- **shadcn/ui** — style: `radix-luma`, base color: `mist`, icon library: `remixicon`. Components live in `src/components/ui/`.
- **Zod v4** (not v3) — API differences possible.
- **React 19** — `@types/react` and `@types/react-dom` pinned via `overrides` in `package.json`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build (auto-runs `prisma generate`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Architecture

- **Route groups**: `(auth)` — login/signup without navbar. `(front)` — pages with navbar.
- **State**: Zustand with `persist` middleware (`localStorage` key: `skill-cart`).
- **Auth**: Better Auth with email/password, stored via Prisma in `user`/`session`/`account`/`verification` tables.
- **Database**: MariaDB on port 3309 in the Docker setup (`docs/install_mariadb_with_docker.txt`). Connection string in `.env`.
- **Fonts**: Prompt (Thai), Roboto, Lora via `next/font/google`.
- **Docker**: Multi-stage build with `node:24-alpine`. Run `npm run build` before `docker build` — build step runs `prisma generate`.

## No test infrastructure

No test files, test config, or CI workflows exist. Do not attempt to run tests.
