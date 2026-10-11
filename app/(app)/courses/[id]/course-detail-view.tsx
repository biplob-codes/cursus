"use client";

import { useActionState, useEffect, useState } from "react";
import { updateCourse, createClass, updateClass } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import { classInputSchema, DAY_OF_WEEK_LABELS } from "@/schema/course";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useAppChrome } from "@/components/app-chrome-context";
import {
  ClassComposerPanel,
  emptyClassDraft,
  type ClassDraft,
} from "@/components/class-composer-panel";
import {
  fieldInput,
  labelClass,
  formatClassPreview,
  formatTimeLabel,
} from "@/components/course-form-shared";

type ClassItem = {
  id: string;
  day: string;
  roomNo: string | null;
  startsAt: string;
  endsAt: string | null;
};

type CourseData = {
  id: string;
  title: string;
  courseCode: string;
  credit: number;
  gradePoint: number | null;
  teacher: string | null;
  semesterId: string;
  classes: ClassItem[];
};

type SemesterOption = {
  id: string;
  label: string;
};

const PANEL_MS = 300;

export function CourseDetailView({
  course,
  semesters,
}: {
  course: CourseData;
  semesters: SemesterOption[];
}) {
  const { setContentFlush } = useAppChrome();

  const [title, setTitle] = useState(course.title);
  const [courseCode, setCourseCode] = useState(course.courseCode);
  const [credit, setCredit] = useState(String(course.credit));
  const [gradePoint, setGradePoint] = useState(
    course.gradePoint !== null ? String(course.gradePoint) : "",
  );
  const [teacher, setTeacher] = useState(course.teacher ?? "");
  const [semesterId, setSemesterId] = useState(course.semesterId);

  const [updateState, updateAction, isUpdating] = useActionState(
    updateCourse,
    initialActionState,
  );

  const [draft, setDraft] = useState<ClassDraft>(emptyClassDraft);
  const [classErrors, setClassErrors] = useState<
    Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>
  >({});
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const [classState, classAction, isClassPending] = useActionState(
    async (prev: typeof initialActionState, formData: FormData) => {
      if (formData.get("id")) {
        return updateClass(prev, formData);
      }
      return createClass(prev, formData);
    },
    initialActionState,
  );

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);

  useEffect(() => {
    if (panelOpen) {
      setContentFlush(true);
      setPanelMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setPanelEntered(false);
    const t = setTimeout(() => {
      setPanelMounted(false);
      setContentFlush(false);
    }, PANEL_MS);
    return () => clearTimeout(t);
  }, [panelOpen, setContentFlush]);

  useEffect(() => {
    if (classState.status === "success") {
      setPanelOpen(false);
      setDraft(emptyClassDraft);
      setClassErrors({});
      setEditingClassId(null);
    }
  }, [classState]);

  function openPanelForNew() {
    setEditingClassId(null);
    setDraft(emptyClassDraft);
    setClassErrors({});
    setPanelOpen(true);
  }

  function openPanelForEdit(c: ClassItem) {
    setEditingClassId(c.id);
    setDraft({
      day: c.day as ClassDraft["day"],
      roomNo: c.roomNo ?? "",
      startsAt: c.startsAt,
      endsAt: c.endsAt ?? "",
    });
    setClassErrors({});
    setPanelOpen(true);
  }

  function trySubmitDraft() {
    if (!draft.startsAt.trim()) {
      setDraft(emptyClassDraft);
      setClassErrors({});
      setEditingClassId(null);
      return;
    }

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
      return;
    }

    const formData = new FormData();
    formData.set("courseId", course.id);
    formData.set("day", parsed.data.day);
    formData.set("startsAt", parsed.data.startsAt);
    if (parsed.data.endsAt) formData.set("endsAt", parsed.data.endsAt);
    if (parsed.data.roomNo) formData.set("roomNo", parsed.data.roomNo);

    if (editingClassId) {
      formData.set("id", editingClassId);
    }

    classAction(formData);
  }

  function closePanel() {
    trySubmitDraft();
    setPanelOpen(false);
  }

  const showDraftPreview = panelOpen && draft;

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
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
          <form action={updateAction} className="space-y-8">
            <input type="hidden" name="id" value={course.id} />
            <input type="hidden" name="semesterId" value={semesterId} />

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
                className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
              />
              {updateState.errors?.title?.[0] && (
                <p className="text-xs text-destructive">
                  {updateState.errors.title[0]}
                </p>
              )}
            </div>

            {/* Property rows */}
            <div className="space-y-4">
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
              </div>
              {updateState.errors?.semesterId?.[0] && (
                <p className="pl-[132px] text-xs text-destructive">
                  {updateState.errors.semesterId[0]}
                </p>
              )}

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
              {updateState.errors?.courseCode?.[0] && (
                <p className="pl-[132px] text-xs text-destructive">
                  {updateState.errors.courseCode[0]}
                </p>
              )}

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
                  onBlur={() => {
                    const n = parseFloat(credit);
                    if (!Number.isNaN(n)) setCredit(n.toFixed(1));
                  }}
                  placeholder="3.0"
                  autoComplete="off"
                  className={cn(fieldInput, "max-w-[120px] tabular-nums")}
                />
              </div>
              {updateState.errors?.credit?.[0] && (
                <p className="pl-[132px] text-xs text-destructive">
                  {updateState.errors.credit[0]}
                </p>
              )}

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
              {updateState.errors?.gradePoint?.[0] && (
                <p className="pl-[132px] text-xs text-destructive">
                  {updateState.errors.gradePoint[0]}
                </p>
              )}
            </div>

            {/* Classes */}
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">Classes</h2>

              {course.classes.length > 0 && (
                <ul className="space-y-0.5">
                  {course.classes.map((c) => (
                    <li
                      key={c.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                      onClick={() => openPanelForEdit(c)}
                    >
                      <span className="min-w-0 flex-1 font-medium text-foreground">
                        {DAY_OF_WEEK_LABELS[
                          c.day as keyof typeof DAY_OF_WEEK_LABELS
                        ] ?? c.day}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatTimeLabel(c.startsAt)}
                        {c.roomNo ? ` · ${c.roomNo}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {showDraftPreview && (
                <div className="flex items-center gap-2 rounded bg-muted/40 px-2 py-1.5">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {formatClassPreview(draft) || (
                      <span className="text-muted-foreground">New class</span>
                    )}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={openPanelForNew}
                disabled={isClassPending}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add class
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={
                  isUpdating ||
                  !title.trim() ||
                  !courseCode.trim() ||
                  !credit ||
                  !semesterId
                }
                className="w-full sm:w-auto"
              >
                {isUpdating ? "Saving…" : "Save changes"}
              </Button>
              {updateState.status === "error" &&
                updateState.message &&
                !updateState.errors && (
                  <p className="text-xs text-destructive">
                    {updateState.message}
                  </p>
                )}
              {updateState.status === "success" && (
                <p className="text-xs text-muted-foreground">
                  {updateState.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Desktop right panel */}
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
