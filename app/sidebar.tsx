"use client";

import { DailyPlansIcon } from "@/icons/daily-plans";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Daily plans", href: "/plans", icon: DailyPlansIcon },
];

function UserAvatar({
  name,
  image,
}: {
  name: string;
  image: string | null | undefined;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-5 w-5 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
      {initial}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-accent/50">
      <Link href={"/"}>
        <div className="flex items-center gap-2 px-3 py-3 text-lg">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 font-semibold text-white">
            C
          </div>
          <span className="flex-1 text-left">Cursus</span>
        </div>
      </Link>

      <nav className="flex-1 px-2">
        <div className="mt-2 mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
          Workspace
        </div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                  "hover:bg-accent hover:text-foreground",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-2 py-3">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
            "hover:bg-accent hover:text-foreground",
            pathname === "/profile"
              ? "bg-accent text-foreground"
              : "text-muted-foreground",
          )}
        >
          {isPending || !user ? (
            <>
              <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-muted" />
              <span className="text-sm">Loading…</span>
            </>
          ) : (
            <>
              <UserAvatar name={user.name} image={user.image} />
              <span className="truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
