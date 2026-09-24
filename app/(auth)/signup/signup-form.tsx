"use client";

import { signUpAction, SignUpState } from "@/actions/signup";
import { useActionState } from "react";

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
    <form action={formAction} className="w-full max-w-[400px]">
      <h1 className="text-[1.6rem] font-semibold text-[#37352F] tracking-[-0.01em]">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-[#787774]">
        Start with your name, email, and a password.
      </p>

      {state.errors.form && (
        <div className="mt-5 rounded-[3px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.errors.form}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
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
        className="mt-6 w-full rounded-[3px] bg-[#37352F] py-[9px] text-sm font-medium text-white transition-colors hover:bg-[#2F2E2B] disabled:cursor-not-allowed disabled:opacity-60"
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
        className="mb-1.5 block text-[13px] font-medium text-[#37352F]"
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
        className="w-full rounded-[3px] border border-[#E9E9E7] bg-white px-3 py-2 text-sm text-[#37352F] outline-none transition-shadow placeholder:text-[#9B9A97] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/25"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
