"use client";

type CourseTitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
  name?: string;
};

export function CourseTitleField({
  value,
  onChange,
  error,
  autoFocus = false,
  name = "title",
}: CourseTitleFieldProps) {
  return (
    <div className="space-y-1">
      <textarea
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const el = e.target;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        ref={(el) => {
          if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }
        }}
        placeholder="Untitled course"
        rows={1}
        autoFocus={autoFocus}
        className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
