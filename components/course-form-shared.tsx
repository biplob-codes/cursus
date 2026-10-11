import { cn } from "@/lib/utils";
import { DAY_OF_WEEK_LABELS } from "@/schema/course";
import type { ClassDraft } from "@/components/class-composer-panel";

export const fieldInput = cn(
  "w-full bg-transparent text-base text-foreground outline-none",
  "placeholder:text-muted-foreground/45",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--background)]",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",
  "[appearance:textfield]",
  "[&::-webkit-outer-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:appearance-none",
);

export const labelClass = "w-[120px] shrink-0 text-sm text-muted-foreground";

export function formatClassPreview(draft: ClassDraft): string {
  const day = DAY_OF_WEEK_LABELS[draft.day] ?? draft.day;

  let time = "";
  if (draft.startsAt) {
    const [hStr, mStr] = draft.startsAt.split(":");
    const hour24 = parseInt(hStr, 10);
    const minute = parseInt(mStr, 10) || 0;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    time = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  }

  const parts = [day];
  if (time) parts.push(time);
  if (draft.roomNo.trim()) parts.push(draft.roomNo.trim());
  return parts.join(" · ");
}

export function formatTimeLabel(startsAt: string): string {
  if (!startsAt) return startsAt;
  const [hStr, mStr] = startsAt.split(":");
  const hour24 = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10) || 0;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}
