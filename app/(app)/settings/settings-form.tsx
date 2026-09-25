"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client"; // adjust path if needed
import { useRouter } from "next/navigation";

export function SettingsForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const setThemePreference = (value: "light" | "dark") => {
    const isDark = value === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", value);
    setTheme(value);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/signin");
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  };

  if (!mounted) {
    return null; // avoid hydration mismatch
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your appearance and account.
        </p>
      </div>

      {/* Appearance Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Appearance</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose how Cursus looks for you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => setThemePreference("light")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
              "hover:bg-accent/50",
              theme === "light"
                ? "border-primary bg-accent/30"
                : "border-border",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background border border-border">
              <Sun className="h-5 w-5 text-foreground" strokeWidth={1.8} />
            </div>
            <span className="text-sm font-medium text-foreground">Light</span>
          </button>

          <button
            type="button"
            onClick={() => setThemePreference("dark")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
              "hover:bg-accent/50",
              theme === "dark"
                ? "border-primary bg-accent/30"
                : "border-border",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background border border-border">
              <Moon className="h-5 w-5 text-foreground" strokeWidth={1.8} />
            </div>
            <span className="text-sm font-medium text-foreground">Dark</span>
          </button>
        </div>
      </section>

      {/* Account Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Account</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Sign out of your account on this device.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors",
            "text-foreground hover:bg-accent hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          {isLoggingOut ? "Signing out…" : "Log out"}
        </button>
      </section>
    </div>
  );
}
