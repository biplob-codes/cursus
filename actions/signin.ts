"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthFormState } from "./action-state";
import { auth } from "@/lib/auth";
import { signInSchema } from "@/schema/signin";

export type SignInState = AuthFormState<{
  email: string;
  password: string;
}>;

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const raw = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = signInSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      values: raw,
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      values: raw,
      errors: {
        form:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      },
    };
  }

  redirect("/");
}
