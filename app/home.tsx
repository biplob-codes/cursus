import Link from "next/link";

import { Button } from "@/ui/button";
import {
  ArrowRight,
  CheckSquare,
  FileText,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "./github-icon";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <SiteHeader />
      <Hero />
      <ProductPreview />
      <Features />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------- Header --------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white dark:bg-indigo-500">
            C
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Cursus
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/biplob-codes/cursus"
            target="_blank"
            rel="noreferrer"
            className="mr-1 hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 sm:flex"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </Link>
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------- Hero ----------------------------------- */

function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center sm:pt-28">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        A personal productivity tool, built in the open
      </p>
      <h1 className="mt-3 text-[2.5rem] font-semibold leading-[1.15] tracking-tight sm:text-6xl sm:leading-[1.1]">
        One place for everything
        <br />
        you're keeping track of.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg">
        Cursus started as a way to manage daily routines while juggling
        university and a self-taught roadmap. New tools get added as new
        problems show up. If it's useful to you too, use it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/signup">
          <Button
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <span className="inline-flex items-center gap-1.5">
              Sign up
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </Link>
        <Link href="/signin">
          <Button
            size="lg"
            variant="outline"
            className="border-neutral-200 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Sign in
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------ Product preview ------------------------------ */

function ProductPreview() {
  const routine = [
    { label: "Morning workout", done: true },
    { label: "Review yesterday's PRs", done: true },
    { label: "Read 20 pages", done: false },
    { label: "Plan tomorrow's routine", done: false },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm dark:border-neutral-800">
        {/* fake window chrome */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <div className="grid grid-cols-[180px_1fr]">
          {/* sidebar */}
          <div className="hidden border-r border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:block">
            <p className="px-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Workspace
            </p>
            <div className="mt-2 space-y-0.5">
              {["Today's routine", "Documents", "Notes"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-md px-2 py-1.5 text-sm ${
                    i === 0
                      ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* content */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold">Today's routine</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Thursday, September 24
            </p>
            <ul className="mt-5 space-y-2.5">
              {routine.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  <CheckSquare
                    className={`h-4 w-4 shrink-0 ${
                      item.done
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-300 dark:text-neutral-700"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      item.done
                        ? "text-neutral-400 line-through dark:text-neutral-600"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Features ---------------------------------- */

function Features() {
  const features = [
    {
      icon: ListChecks,
      title: "Routines",
      description:
        "Set up what you do every day and check it off as you go. Cursus keeps score so you don't have to.",
    },
    {
      icon: FileText,
      title: "Documents",
      description:
        "Keep the PDFs and files you actually use in one organized place instead of scattered across folders.",
    },
    {
      icon: Sparkles,
      title: "Whatever's next",
      description:
        "New features get added as new problems show up — this list will keep growing.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title}>
            <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- Closing CTA -------------------------------- */

function ClosingCta() {
  return (
    <section className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Found it useful? Sign up and use it.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          Run into a bug or want a feature added? Let me know.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <span className="inline-flex items-center gap-1.5">
                Sign up
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer --------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-8 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>© {new Date().getFullYear()} Cursus</span>
        <Link
          href="/signin"
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Sign in
        </Link>
      </div>
    </footer>
  );
}
