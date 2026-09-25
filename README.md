# Cursus

A personal productivity tool — built to manage daily routines while juggling
university and a self-directed learning roadmap. It starts small and grows
as new problems show up; new features get added when they're actually
needed, not upfront.

## Current features

- **Daily plans** — create a plan for the day and view it. That's it for now.

More is coming (see Roadmap below).

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/), with `class-variance-authority` for variants and `tw-animate-css` for animation utilities
- **UI primitives:** [Base UI](https://base-ui.com/)
- **Auth:** [better-auth](https://www.better-auth.com/) — email + password, plus GitHub as the only social sign-in for now
- **Database:** PostgreSQL via [Prisma 7](https://www.prisma.io/), using the `@prisma/adapter-pg` driver adapter on top of `pg`
- **Validation:** [Zod](https://zod.dev/)
- **Dates:** `date-fns` and `react-day-picker` for the routine/date picking UI
- **Package manager:** pnpm

## Getting started

```bash
pnpm install
```

Set up your environment variables (database connection, better-auth secret,
GitHub OAuth client ID/secret for social sign-in), then:

```bash
pnpm db:generate   # generate the Prisma client
pnpm db:migrate     # run migrations
pnpm dev
```

Other useful scripts:

```bash
pnpm db:studio   # browse the database with Prisma Studio
pnpm lint        # run eslint
pnpm build       # production build
```

## Roadmap

No fixed timeline — features get added as they become useful:

- Upgrading the daily-plan feature (recurring routines, editing, history)
- Document/file organization
- Whatever else turns out to be worth building

## Issues

Found a bug or have a feature request? Open an issue in this repo.
