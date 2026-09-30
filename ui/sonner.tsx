// ui/sonner.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * App-wide toaster — Notion-like: bottom center, soft surface, tight padding.
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
          toast: cn(
            "group flex w-full max-w-[380px] items-center gap-2.5",
            "rounded-lg border border-border/80 bg-background px-3.5 py-2.5",
            "text-sm text-foreground shadow-lg shadow-black/5",
            "dark:border-border dark:bg-card dark:shadow-black/40",
          ),
        },
      }}
      {...props}
    />
  );
}

export type AppToastOptions = {
  /** Left-side icon (optional) */
  icon?: ReactNode;
  /** Right-side link (optional) */
  link?: {
    label: string;
    href: string;
  };
  duration?: number;
};

/**
 * Notion-style toast: [icon?] message [link?]
 */
export function toast(message: string, options?: AppToastOptions) {
  const { icon, link, duration } = options ?? {};

  return sonnerToast.custom(
    (id) => (
      <div
        className={cn(
          "flex w-full max-w-[380px] items-center gap-2.5",
          "rounded-lg border border-border/80 bg-background px-3.5 py-2.5",
          "text-sm text-foreground shadow-lg shadow-black/5",
          "dark:border-border dark:bg-card dark:shadow-black/40",
        )}
      >
        {icon ? (
          <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        ) : null}

        <p className="min-w-0 flex-1 text-sm leading-snug text-foreground">
          {message}
        </p>

        {link ? (
          <Link
            href={link.href}
            onClick={() => sonnerToast.dismiss(id)}
            className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ) : null}
      </div>
    ),
    { duration },
  );
}
