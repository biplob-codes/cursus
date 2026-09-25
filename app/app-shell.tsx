"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import { AppChromeProvider, useAppChrome } from "./app-chrome-context";
import { cn } from "@/lib/utils";

function AppShellInner({ children }: { children: ReactNode }) {
  const { sidebarHidden } = useAppChrome();

  return (
    <div className="flex min-h-screen bg-background">
      {!sidebarHidden && <Sidebar />}
      <main
        className={cn(
          "flex-1 bg-background transition-[padding] duration-200",
          sidebarHidden ? "px-8 py-10" : "px-24 py-16",
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppChromeProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppChromeProvider>
  );
}
