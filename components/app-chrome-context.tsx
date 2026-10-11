"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type AppChromeContextValue = {
  /** When true, the left workspace sidebar is fully hidden (desktop). */
  sidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
  /** Whether the right-hand task editor panel is open. */
  taskPanelOpen: boolean;
  setTaskPanelOpen: (open: boolean) => void;
  /** Open the task panel and hide the left sidebar. */
  openTaskPanel: () => void;
  /** Close the task panel and restore the left sidebar. */
  closeTaskPanel: () => void;
  /**
   * When true, main content padding is removed so a right panel
   * can sit edge-to-edge. Does NOT hide the left sidebar.
   */
  contentFlush: boolean;
  setContentFlush: (flush: boolean) => void;
  /** Mobile drawer open state */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [taskPanelOpen, setTaskPanelOpen] = useState(false);
  const [contentFlush, setContentFlush] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Soft navigations keep this provider mounted.
  // Reset chrome whenever the route changes.
  useEffect(() => {
    setTaskPanelOpen(false);
    setSidebarHidden(false);
    setContentFlush(false);
    setMobileOpen(false);
  }, [pathname]);

  const openTaskPanel = useCallback(() => {
    setTaskPanelOpen(true);
    setSidebarHidden(true);
  }, []);

  const closeTaskPanel = useCallback(() => {
    setTaskPanelOpen(false);
    setSidebarHidden(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      sidebarHidden,
      setSidebarHidden,
      taskPanelOpen,
      setTaskPanelOpen,
      openTaskPanel,
      closeTaskPanel,
      contentFlush,
      setContentFlush,
      mobileOpen,
      setMobileOpen,
      toggleMobile,
      closeMobile,
    }),
    [
      sidebarHidden,
      taskPanelOpen,
      openTaskPanel,
      closeTaskPanel,
      contentFlush,
      mobileOpen,
      toggleMobile,
      closeMobile,
    ],
  );

  return (
    <AppChromeContext.Provider value={value}>
      {children}
    </AppChromeContext.Provider>
  );
}

export function useAppChrome() {
  const ctx = useContext(AppChromeContext);
  if (!ctx) {
    throw new Error("useAppChrome must be used within AppChromeProvider");
  }
  return ctx;
}
