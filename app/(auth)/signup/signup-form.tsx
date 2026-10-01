"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type SignUpState } from "@/actions/signup";
import { AuthField } from "@/components/auth-field";
import { GitHubButton } from "@/components/github-button";

const initialState: SignUpState = {
  values: { name: "", email: "", password: "" },
  errors: {},
};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form action={formAction} className="w-full max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-primary underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>

      {state.errors.form ? (
        <div className="mt-5 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.errors.form}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3.5">
        <AuthField
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={state.values.name}
          error={state.errors.name}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.errors.email}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          defaultValue={state.values.password}
          error={state.errors.password}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <GitHubButton />
    </form>
  );
}
