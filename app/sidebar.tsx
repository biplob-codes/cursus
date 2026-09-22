"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FilePlus2, Settings, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Create a plan", href: "/plans/new", icon: FilePlus2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;
  const themeLabel = isDark ? "Light" : "Dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-accent/50">
      <div className="px-3 py-3 flex items-center gap-2 text-lg">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-white  font-semibold">
          C
        </div>
        <span className="flex-1 text-left">Cursus</span>
      </div>

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
                  "flex items-center gap-2 rounded-md px-2 py-1.5  transition-colors",
                  "hover:bg-accent hover:text-foreground",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-2 py-5 space-y-0.5">
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
            "hover:bg-accent hover:text-foreground",
            "text-muted-foreground",
          )}
        >
          <ThemeIcon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          <span>{mounted ? themeLabel : ""}</span>
        </button>

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5  transition-colors",
            "hover:bg-accent hover:text-foreground",
            pathname === "/settings"
              ? "bg-accent text-foreground"
              : "text-muted-foreground",
          )}
        >
          <Settings className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
