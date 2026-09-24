"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signUpSchema } from "@/schema/signup";

export type SignUpState = {
  values: {
    name: string;
    email: string;
    password: string;
  };
  errors: Partial<Record<"name" | "email" | "password" | "form", string>>;
};

export async function signUpAction(
  prevState: SignUpState,
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
    console.log(parsed);

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
