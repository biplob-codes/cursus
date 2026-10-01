"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { GithubIcon } from "./github-icon";

export function GitHubButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGitHubSignIn() {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGitHubSignIn}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
    >
      <GithubIcon size={16} className="shrink-0" />
      {isLoading ? "Redirecting…" : "Continue with GitHub"}
    </button>
  );
}
