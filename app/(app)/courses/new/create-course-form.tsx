"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createCourse } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import {
  ClassInput,
  classInputSchema,
  DAY_OF_WEEK_LABELS,
  dayOfWeekEnum,
} from "@/schema/course";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

type SemesterOption = {
  id: string;
  label: string;
};

const PANEL_MS = 300;
const PANEL_WIDTH = 400;

const emptyClassDraft = {
  day: "MONDAY" as ClassInput["day"],
  roomNo: "",
  startsAt: "",
  endsAt: "",
};

/** Borderless field — larger text, no chrome */
const fieldInput = cn(
  "w-full bg-transparent text-base text-foreground outline-none",
  "placeholder:text-muted-foreground/45",
  // Kill autofill yellow / gray background
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--background)]",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",
  // Hide number spinners
  "[appearance:textfield]",
  "[&::-webkit-outer-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:appearance-none",
);

const labelClass = "w-[120px] shrink-0 text-sm text-muted-foreground";

export function CreateCourseForm({
  semesters,
}: {
  semesters: SemesterOption[];
}) {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credit, setCredit] = useState("3.0");
  const [gradePoint, setGradePoint] = useState("");
  const [teacher, setTeacher] = useState("");
  const [semesterId, setSemesterId] = useState(semesters[0]?.id ?? "");

  const [classes, setClasses] = useState<ClassInput[]>([]);
  const [draft, setDraft] = useState(emptyClassDraft);
  const [classErrors, setClassErrors] = useState<
    Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>
  >({});

  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialActionState,
  );

  // Local panel — does NOT touch app chrome / left sidebar
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);

  useEffect(() => {
    if (panelOpen) {
      setPanelMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setPanelEntered(false);
    const t = setTimeout(() => setPanelMounted(false), PANEL_MS);
    return () => clearTimeout(t);
  }, [panelOpen]);

  function commitDraftIfValid(): boolean {
    const parsed = classInputSchema.safeParse({
      day: draft.day,
      roomNo: draft.roomNo || undefined,
      startsAt: draft.startsAt,
      endsAt: draft.endsAt || undefined,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setClassErrors({
        day: flat.day?.[0],
        startsAt: flat.startsAt?.[0],
        endsAt: flat.endsAt?.[0],
        roomNo: flat.roomNo?.[0],
      });
      return false;
    }

    setClasses((prev) => [...prev, parsed.data]);
    setDraft(emptyClassDraft);
    setClassErrors({});
    return true;
  }

  function openPanel() {
    setDraft(emptyClassDraft);
    setClassErrors({});
    setPanelOpen(true);
  }

  function closePanel() {
    if (draft.startsAt.trim()) {
      commitDraftIfValid();
    } else {
      setDraft(emptyClassDraft);
      setClassErrors({});
    }
    setPanelOpen(false);
  }

  function handleAddClassSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (commitDraftIfValid()) {
      setPanelOpen(false);
    }
  }

  if (semesters.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Create course
        </h1>
        <p className="text-sm text-muted-foreground">
          You need a semester before you can add courses.{" "}
          <Link
            href="/semesters"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create a semester
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full w-full">
      {/* Main form */}
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-1">
        <form action={formAction} className="space-y-8">
          {/* Title */}
          <div className="space-y-1">
            <textarea
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
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
              autoFocus
              className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
            />
            {state.errors?.title?.[0] && (
              <p className="text-xs text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          {/* Property rows with labels */}
          <div className="space-y-4">
            {/* Semester */}
            <div className="flex items-center gap-3">
              <span className={labelClass}>Semester</span>
              <Select
                value={semesterId}
                onValueChange={(v) => setSemesterId(v as string)}
              >
                <SelectTrigger
                  className={cn(
                    "h-auto w-auto gap-1 border-0 bg-transparent px-0 py-1 text-base shadow-none",
                    "hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent",
                    "data-[popup-open]:bg-transparent",
                  )}
                >
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="semesterId" value={semesterId} />
            </div>
            {state.errors?.semesterId?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {state.errors.semesterId[0]}
              </p>
            )}

            {/* Course code */}
            <div className="flex items-center gap-3">
              <label htmlFor="courseCode" className={labelClass}>
                Course code
              </label>
              <input
                id="courseCode"
                name="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CSE 2201"
                autoComplete="off"
                className={fieldInput}
              />
            </div>
            {state.errors?.courseCode?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {state.errors.courseCode[0]}
              </p>
            )}

            {/* Credit */}
            <div className="flex items-center gap-3">
              <label htmlFor="credit" className={labelClass}>
                Credit
              </label>
              <input
                id="credit"
                name="credit"
                type="number"
                step="0.5"
                min="0"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="3.0"
                autoComplete="off"
                className={cn(fieldInput, "max-w-[120px] tabular-nums")}
              />
            </div>
            {state.errors?.credit?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {state.errors.credit[0]}
              </p>
            )}

            {/* Teacher */}
            <div className="flex items-center gap-3">
              <label htmlFor="teacher" className={labelClass}>
                Teacher
              </label>
              <input
                id="teacher"
                name="teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Dr. Rahman"
                autoComplete="off"
                className={fieldInput}
              />
            </div>

            {/* Grade point */}
            <div className="flex items-center gap-3">
              <label htmlFor="gradePoint" className={labelClass}>
                Grade point
              </label>
              <input
                id="gradePoint"
                name="gradePoint"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gradePoint}
                onChange={(e) => setGradePoint(e.target.value)}
                placeholder="e.g. 3.75"
                autoComplete="off"
                className={cn(fieldInput, "max-w-[120px] tabular-nums")}
              />
            </div>
            {state.errors?.gradePoint?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {state.errors.gradePoint[0]}
              </p>
            )}
          </div>

          {/* Classes */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Classes</h2>

            {classes.length > 0 && (
              <ul className="space-y-0.5">
                {classes.map((c, index) => (
                  <li
                    key={`${c.day}-${c.startsAt}-${index}`}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                  >
                    <span className="min-w-0 flex-1 font-medium text-foreground">
                      {DAY_OF_WEEK_LABELS[c.day]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {c.startsAt}
                      {c.endsAt ? ` – ${c.endsAt}` : ""}
                      {c.roomNo ? ` · ${c.roomNo}` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setClasses((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Remove class"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={openPanel}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add class
            </button>
          </div>

          <input
            type="hidden"
            name="classesJson"
            value={JSON.stringify(classes)}
          />

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              disabled={
                isPending ||
                !title.trim() ||
                !courseCode.trim() ||
                !credit ||
                !semesterId
              }
              className="w-full sm:w-auto"
            >
              {isPending ? "Creating…" : "Create course"}
            </Button>
            {state.status === "error" && state.message && !state.errors && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}
          </div>
        </form>
      </div>

      {/* Desktop right panel — local, does not collapse left sidebar */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden border-l border-border transition-[width] duration-300 ease-out md:block",
          panelEntered ? "" : "border-transparent",
        )}
        style={{ width: panelEntered ? PANEL_WIDTH : 0 }}
      >
        <div
          className={cn(
            "flex h-full flex-col bg-muted/40 transition-transform duration-300 ease-out",
            panelEntered ? "translate-x-0" : "translate-x-full",
          )}
          style={{ width: PANEL_WIDTH }}
        >
          {panelMounted && (
            <ClassComposerPanel
              draft={draft}
              errors={classErrors}
              onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
              onClose={closePanel}
              onSubmit={handleAddClassSubmit}
              variant="side"
            />
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          panelMounted ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            panelEntered ? "opacity-100" : "opacity-0",
          )}
          onClick={closePanel}
          aria-hidden
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-muted/40 shadow-xl transition-transform duration-300 ease-out",
            panelEntered ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>
          {panelMounted && (
            <ClassComposerPanel
              draft={draft}
              errors={classErrors}
              onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
              onClose={closePanel}
              onSubmit={handleAddClassSubmit}
              variant="sheet"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ClassComposerPanel({
  draft,
  errors,
  onChange,
  onClose,
  onSubmit,
  variant = "side",
}: {
  draft: typeof emptyClassDraft;
  errors: Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>;
  onChange: (patch: Partial<typeof emptyClassDraft>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  variant?: "side" | "sheet";
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col">
      <div
        className={cn(
          "flex items-center justify-between",
          variant === "side" ? "px-5 py-4" : "px-4 py-2",
        )}
      >
        <h3 className="text-sm font-semibold text-foreground">Add class</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-5 overflow-y-auto",
          variant === "side" ? "px-5 pb-8" : "px-4 pb-6",
        )}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Day</label>
          <Select
            value={draft.day}
            onValueChange={(v) => onChange({ day: v as ClassInput["day"] })}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekEnum.options.map((value) => (
                <SelectItem key={value} value={value}>
                  {DAY_OF_WEEK_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.day && (
            <p className="text-xs text-destructive">{errors.day}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Starts at
          </label>
          <input
            type="time"
            value={draft.startsAt}
            onChange={(e) => onChange({ startsAt: e.target.value })}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.startsAt && (
            <p className="text-xs text-destructive">{errors.startsAt}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Ends at</label>
          <input
            type="time"
            value={draft.endsAt}
            onChange={(e) => onChange({ endsAt: e.target.value })}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.endsAt && (
            <p className="text-xs text-destructive">{errors.endsAt}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Room</label>
          <input
            value={draft.roomNo}
            onChange={(e) => onChange({ roomNo: e.target.value })}
            placeholder="e.g. Room 301"
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex shrink-0 gap-2 border-t border-border",
          variant === "side" ? "px-5 py-4" : "px-4 py-3",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-background"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!draft.startsAt}>
          Add class
        </Button>
      </div>
    </form>
  );
}
