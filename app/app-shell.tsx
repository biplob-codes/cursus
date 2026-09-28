"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import { AppChromeProvider, useAppChrome } from "./app-chrome-context";
import { cn } from "@/lib/utils";

function AppShellInner({ children }: { children: ReactNode }) {
  const { sidebarHidden, taskPanelOpen } = useAppChrome();

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* Left sidebar — always mounted so it can slide */}
      <div
        className={cn(
          "shrink-0 overflow-hidden transition-[width] duration-300 ease-out",
          sidebarHidden ? "w-0" : "w-60",
        )}
      >
        <div
          className={cn(
            "h-full w-60 transition-transform duration-300 ease-out",
            sidebarHidden ? "-translate-x-full" : "translate-x-0",
          )}
        >
          <Sidebar />
        </div>
      </div>

      <main
        className={cn(
          "app-scroll flex-1 overflow-y-auto bg-background transition-[padding] duration-300 ease-out",
          taskPanelOpen
            ? "px-0 py-0"
            : sidebarHidden
              ? "px-8 py-10"
              : "px-24 py-16",
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
