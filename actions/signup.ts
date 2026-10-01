"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthFormState } from "./action-state";
import { auth } from "@/lib/auth";
import { signUpSchema } from "@/schema/signup";

export type SignUpState = AuthFormState<{
  name: string;
  email: string;
  password: string;
}>;

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      values: raw,
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
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
