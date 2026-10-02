// ui/sonner.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * App-wide toaster — Notion-like: bottom center, soft surface.
 */
export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      gap={8}
      visibleToasts={3}
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-auto",
        },
      }}
      {...props}
    />
  );
}

export type AppToastAction =
  | {
      label: string;
      href: string;
      onClick?: never;
    }
  | {
      label: string;
      onClick: () => void;
      href?: never;
    };

export type AppToastOptions = {
  /** Left-side icon — omit when not needed */
  icon?: ReactNode;
  /** Right-side action — link or button; omit when not needed */
  action?: AppToastAction;
  duration?: number;
};

const toastShellClass = cn(
  "flex w-full max-w-[min(440px,calc(100vw-2rem))] items-center gap-3",
  "rounded-lg border border-border/70 bg-card px-4 py-3",
  "text-sm text-foreground shadow-lg shadow-black/10",
  "dark:border-white/10 dark:bg-[#2f2f2f] dark:shadow-black/50",
);

/**
 * Notion-style toast: [icon?] message [action?]
 *
 * @example
 * toast("Saved")
 * toast("Link copied", { icon: <LinkIcon /> })
 * toast("Only you can open it", {
 *   icon: <AlertTriangle className="text-amber-500" />,
 *   action: { label: "Give access", onClick: () => openShare() },
 * })
 * toast("View note", { action: { label: "Open", href: "/notes/1" } })
 */
export function toast(message: string, options?: AppToastOptions) {
  const { icon, action, duration } = options ?? {};

  return sonnerToast.custom(
    (id) => (
      <div className={toastShellClass} role="status">
        {icon ? (
          <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        ) : null}

        <p className="min-w-0 flex-1  leading-snug text-foreground">
          {message}
        </p>

        {action ? (
          action.href ? (
            <Link
              href={action.href}
              onClick={() => sonnerToast.dismiss(id)}
              className="shrink-0 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                }

                sonnerToast.dismiss(id);
              }}
              className="shrink-0 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              {action.label}
            </button>
          )
        ) : null}
      </div>
    ),
    { duration },
  );
}
