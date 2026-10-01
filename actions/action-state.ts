export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export const initialActionState: ActionState = { status: "idle" };

/** Form actions that replay field values on validation error. */
export type AuthFormState<T extends Record<string, string>> = {
  values: T;
  errors: Partial<Record<keyof T | "form", string>>;
};
