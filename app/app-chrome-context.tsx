"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppChromeContextValue = {
  /** When true, the left workspace sidebar is fully hidden. */
  sidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
  /** Whether the right-hand task editor panel is open. */
  taskPanelOpen: boolean;
  setTaskPanelOpen: (open: boolean) => void;
  /** Open the task panel and hide the left sidebar. */
  openTaskPanel: () => void;
  /** Close the task panel and restore the left sidebar. */
  closeTaskPanel: () => void;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({ children }: { children: ReactNode }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [taskPanelOpen, setTaskPanelOpen] = useState(false);

  const openTaskPanel = useCallback(() => {
    setTaskPanelOpen(true);
    setSidebarHidden(true);
  }, []);

  const closeTaskPanel = useCallback(() => {
    setTaskPanelOpen(false);
    setSidebarHidden(false);
  }, []);

  const value = useMemo(
    () => ({
      sidebarHidden,
      setSidebarHidden,
      taskPanelOpen,
      setTaskPanelOpen,
      openTaskPanel,
      closeTaskPanel,
    }),
    [sidebarHidden, taskPanelOpen, openTaskPanel, closeTaskPanel],
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
