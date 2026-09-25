"use client";

import { signUpAction, SignUpState } from "@/actions/signup";
import { useActionState } from "react";
import Link from "next/link";

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
    <form action={formAction} className="w-full max-w-[360px]">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-primary hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>

      {state.errors.form && (
        <div className="mt-5 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.errors.form}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3.5">
        <Field
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={state.values.name}
          error={state.errors.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.errors.email}
        />
        <Field
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
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
