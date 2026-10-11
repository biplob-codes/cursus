import { DAY_OF_WEEK_LABELS } from "@/schema/course";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { cn } from "@/lib/utils";

type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

type RoutineClass = {
  id: string;
  day: DayOfWeek;
  startsAt: string;
  roomNo: string | null;
  course: {
    title: string;
    courseCode: string;
  };
};

type ClassRoutineProps = {
  semester: {
    name: keyof typeof SEMESTER_NAME_LABELS;
    year: number;
  };
  classes: RoutineClass[];
};

const DAYS: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function formatTime(startsAt: string): string {
  const [hStr, mStr] = startsAt.split(":");
  const hour24 = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10) || 0;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function ClassRoutine({ semester, classes }: ClassRoutineProps) {
  const byDay = DAYS.map((day) => ({
    day,
    label: DAY_OF_WEEK_LABELS[day],
    items: classes
      .filter((c) => c.day === day)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
  }));

  const hasAny = classes.length > 0;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">
        {SEMESTER_NAME_LABELS[semester.name]} {semester.year} class routine
      </h2>

      {!hasAny ? (
        <p className="text-sm text-muted-foreground">
          No classes scheduled for this semester yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="min-w-[640px]">
            {byDay.map(({ day, label, items }, index) => (
              <div
                key={day}
                className={cn(
                  "grid grid-cols-[100px_1fr] gap-0",
                  index !== byDay.length - 1 && "border-b border-border",
                )}
              >
                {/* Day label */}
                <div className="flex items-start border-r border-border bg-muted/30 px-3 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                </div>

                {/* Classes for the day */}
                <div className="flex flex-wrap gap-2 px-3 py-2.5">
                  {items.length === 0 ? (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex min-w-[140px] flex-col gap-0.5 rounded-md border border-border bg-background px-2.5 py-1.5"
                      >
                        <span className="truncate text-xs font-medium text-foreground">
                          {item.course.title}
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground">
                          {formatTime(item.startsAt)}
                          {item.roomNo ? ` · ${item.roomNo}` : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
