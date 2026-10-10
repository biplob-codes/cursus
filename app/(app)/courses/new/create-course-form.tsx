"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createCourse } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import {
  ClassInput,
  classInputSchema,
  DAY_OF_WEEK_LABELS,
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
import { ClassComposerPanel, type ClassDraft } from "./class-composer-panel";

type SemesterOption = {
  id: string;
  label: string;
};

const PANEL_MS = 300;

const emptyClassDraft: ClassDraft = {
  day: "MONDAY",
  roomNo: "",
  startsAt: "",
  endsAt: "",
};

const fieldInput = cn(
  "w-full bg-transparent text-base text-foreground outline-none",
  "placeholder:text-muted-foreground/45",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--background)]",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",
  "[appearance:textfield]",
  "[&::-webkit-outer-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:appearance-none",
);

const labelClass = "w-[120px] shrink-0 text-sm text-muted-foreground";

function formatClassPreview(draft: ClassDraft): string {
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
  const [draft, setDraft] = useState<ClassDraft>(emptyClassDraft);
  const [classErrors, setClassErrors] = useState<
    Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>
  >({});

  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialActionState,
  );

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

  function tryParseDraft(d: ClassDraft): ClassInput | null {
    const parsed = classInputSchema.safeParse({
      day: d.day,
      roomNo: d.roomNo || undefined,
      startsAt: d.startsAt,
      endsAt: d.endsAt || undefined,
    });
    return parsed.success ? parsed.data : null;
  }

  function commitDraftIfValid() {
    const parsed = tryParseDraft(draft);
    if (!parsed) return;
    setClasses((prev) => [...prev, parsed]);
  }

  function startFreshDraft() {
    setDraft(emptyClassDraft);
    setClassErrors({});
  }

  function openPanel() {
    if (panelOpen) {
      // already open → commit current and start a new one
      commitDraftIfValid();
      startFreshDraft();
      return;
    }
    startFreshDraft();
    setPanelOpen(true);
  }

  function closePanel() {
    commitDraftIfValid();
    startFreshDraft();
    setPanelOpen(false);
  }

  // Live preview row when composing a new class
  const showDraftPreview = panelOpen && draft;

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
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      {/* Main form column */}
      <div
        className={cn(
          "min-w-0 flex-1 overflow-y-auto transition-[width] duration-300 ease-out",
          panelEntered ? "md:w-1/2 md:px-10 md:py-12" : "w-full",
          "px-4 py-6 sm:px-6",
        )}
      >
        <div
          className={cn(
            "space-y-8 transition-[max-width] duration-300 ease-out",
            panelEntered ? "md:max-w-none" : "mx-auto max-w-2xl",
          )}
        >
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

            {/* Property rows */}
            <div className="space-y-4">
              {/* Semester */}
              <div className="flex items-center gap-3">
                <span className={labelClass}>Semester</span>
                <Select
                  value={semesterId}
                  onValueChange={(v) => setSemesterId(v as string)}
                  items={semesters.map((s) => ({
                    value: s.id,
                    label: s.label,
                  }))}
                >
                  <SelectTrigger
                    className={cn(
                      "h-auto w-auto min-w-[140px] gap-1 border-0 bg-transparent px-0 py-1 text-base shadow-none",
                      "hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent",
                      "data-[popup-open]:bg-transparent",
                    )}
                  >
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[180px] py-1">
                    {semesters.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                        className="py-1.5 pl-2 pr-8 text-sm"
                      >
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
                        {c.roomNo ? ` · ${c.roomNo}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setClasses((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
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

              {/* Live draft preview (same pattern as plans) */}
              {showDraftPreview && (
                <div className="flex items-center gap-2 rounded px-2 py-1.5 bg-muted/40">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {formatClassPreview(draft) || (
                      <span className="text-muted-foreground">New class</span>
                    )}
                  </p>
                </div>
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
      </div>

      {/* Desktop right panel — full height, solid, same as plans */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-out md:block",
          panelEntered ? "w-1/2" : "w-0",
        )}
      >
        <div
          className={cn(
            "h-full w-[50vw] max-w-full transition-transform duration-300 ease-out",
            panelEntered ? "translate-x-0" : "translate-x-full",
          )}
        >
          {panelMounted && (
            <ClassComposerPanel
              draft={draft}
              errors={classErrors}
              onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
              onClose={closePanel}
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
            "absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl transition-transform duration-300 ease-out",
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
              variant="sheet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
