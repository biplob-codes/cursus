import { cn } from "@/lib/utils";

export function TaskDescription({
  html,
  muted,
}: {
  html: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-sm leading-relaxed",
        muted ? "text-muted-foreground/80" : "text-muted-foreground",
        // TipTap output
        "[&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        "[&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:my-0.5",
        "[&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground",
        "[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em]",
        "[&_strong]:font-semibold [&_strong]:text-foreground/90",
        muted &&
          "[&_h2]:text-muted-foreground [&_h3]:text-muted-foreground [&_strong]:text-muted-foreground",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
