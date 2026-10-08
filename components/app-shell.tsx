"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
import { AppChromeProvider, useAppChrome } from "./app-chrome-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

function AppShellInner({ children }: { children: ReactNode }) {
  const {
    sidebarHidden,
    taskPanelOpen,
    mobileOpen,
    toggleMobile,
    closeMobile,
  } = useAppChrome();

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-out md:block",
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

      {/* Mobile sidebar (drawer) */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeMobile}
          aria-hidden
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-60 max-w-[85vw] transform bg-background shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-3 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleMobile}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">Cursus</span>
        </header>

        <main
          className={cn(
            "app-scroll flex-1 overflow-y-auto bg-background transition-[padding] duration-300 ease-out",
            taskPanelOpen
              ? "px-0 py-0"
              : "px-4 py-6 sm:px-6 md:px-10 md:py-10 lg:px-16 lg:py-12",
          )}
        >
          {children}
        </main>
      </div>
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
