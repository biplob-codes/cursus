# Cursus

A personal productivity app for juggling university work and a self-directed learning roadmap — daily plans you actually execute, and notes you can share.

Built because starting university means two parallel tracks: the syllabus, and everything else you want to learn (ML, side projects, the long list). Cursus exists to keep those days organized without turning into another bloated productivity suite.

It starts small. Features land when they're needed, not when a roadmap says so. If something here is useful to you too, use it.

**Live:** [cursus.biplobcodes.com](https://cursus.biplobcodes.com)

## Features

### Daily plans

Create a plan for a day, add tasks with priority and status, then work through them. Progress is tracked as you check things off.

An activity graph shows how consistently you've been completing plans over time — a quiet scoreboard for the last stretch of days, not a streak guilt machine.

### Notes

Write notes with a clean editor, tag them, and keep them private by default. When you want to share one, flip it public and copy a short link. Friends open the shared view; you keep control over visibility.

## Why it exists

University materials on one side. A personal learning path on the other. Both need daily structure, and neither benefits from a tool that tries to do everything.

Cursus is the thin layer in between: plan the day, execute it, look back at the pattern, and park notes somewhere shareable when that helps. More will show up only when the gap is real.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (React 19, TypeScript) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| UI primitives | [Base UI](https://base-ui.com/) |
| Auth | [better-auth](https://www.better-auth.com/) (email/password + GitHub) |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io/) (`@prisma/adapter-pg`) |
| Validation | [Zod](https://zod.dev/) |
| Editor | [Tiptap](https://tiptap.dev/) |
| Dates | `date-fns`, `react-day-picker` |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
```

Copy the env template and fill in values:

```bash
cp env.example .env
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

Then:

```bash
pnpm db:generate   # generate Prisma client
pnpm db:migrate    # run migrations
pnpm dev           # start the app
```

Other scripts:

```bash
pnpm db:studio          # Prisma Studio
pnpm lint               # ESLint
pnpm build              # production build
pnpm db:migrate:deploy  # apply migrations in production
```

## Project structure

```text
app/
  (app)/          # authenticated app (plans, notes, profile, home)
  (auth)/         # sign-in / sign-up
  share/          # public shared note pages
actions/          # server actions
components/       # shared UI pieces
schema/           # Zod schemas
ui/               # design-system primitives (button, sonner, …)
prisma/           # schema & migrations
```

## Roadmap

No fixed timeline. Things get built when they earn their place:

- Stronger plan workflows (edit, history, recurring patterns)
- Whatever else turns out to be worth the complexity

If you rely on Cursus and hit a gap, open an issue.

## License

[MIT](./LICENSE) — use it, fork it, break it, improve it.
