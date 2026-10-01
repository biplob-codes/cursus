"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, LogOut } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

export function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

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
    } catch {
      setIsLoggingOut(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Account</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your profile information.
          </p>
        </div>

        {isPending || !user ? (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-accent/20 px-4 py-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-accent/20 px-4 py-4">
            <UserAvatar name={user.name} image={user.image} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Appearance</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose how Cursus looks for you.
          </p>
        </div>

        <div className="grid max-w-sm grid-cols-2 gap-3">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
              <Moon className="h-5 w-5 text-foreground" strokeWidth={1.8} />
            </div>
            <span className="text-sm font-medium text-foreground">Dark</span>
          </button>
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div>
          <h2 className="text-sm font-medium text-foreground">Sign out</h2>
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
            "text-muted-foreground hover:bg-accent hover:text-foreground",
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
