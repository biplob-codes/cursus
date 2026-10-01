import { cn } from "@/lib/utils";

const proseClass =
  "prose prose-sm dark:prose-invert max-w-none text-foreground " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_p]:leading-relaxed";

type NoteBodyProps = {
  html: string | null | undefined;
  className?: string;
  emptyLabel?: string;
};

export function NoteBody({
  html,
  className,
  emptyLabel = "No content yet.",
}: NoteBodyProps) {
  if (!html) {
    return (
      <p className={cn("text-sm text-muted-foreground/50", className)}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div
      className={cn(proseClass, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
