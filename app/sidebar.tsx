"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [{ label: "Create a plan", href: "/plans/new", icon: FilePlus2 }];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-background">
      <div className="px-3 py-3">
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium hover:bg-accent">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground text-background text-[11px] font-semibold">C</div>
          <span className="flex-1 text-left">Cursus</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
        </button>
      </div>

      <nav className="flex-1 px-2">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">Workspace</div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  "hover:bg-accent hover:text-foreground",
                  isActive ? "bg-accent text-foreground" : "text-muted-foreground"
                )}>
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8}/>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border px-2 py-2">
        <Link href="/settings"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
            "hover:bg-accent hover:text-foreground",
            pathname === "/settings" ? "bg-accent text-foreground" : "text-muted-foreground"
          )}>
          <Settings className="h-4 w-4 shrink-0" strokeWidth={1.8}/>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
