type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
  defaultValue: string;
  error?: string;
};

export function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  error,
}: AuthFieldProps) {
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
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
