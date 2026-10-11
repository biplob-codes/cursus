"use client";

import { useActionState, useEffect, useState } from "react";
import { updateCourse, createClass, updateClass } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import { classInputSchema } from "@/schema/course";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { useAppChrome } from "@/components/app-chrome-context";
import {
  ClassComposerPanel,
  emptyClassDraft,
  type ClassDraft,
} from "@/components/class-composer-panel";
import { CourseTitleField } from "@/components/course-title-field";
import { CoursePropertyFields } from "@/components/course-property-fields";
import { CourseClassesSection } from "@/components/course-classes-section";

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

  const [classes, setClasses] = useState<ClassItem[]>(course.classes);
  const [draft, setDraft] = useState<ClassDraft>(emptyClassDraft);
  const [classErrors, setClassErrors] = useState<
    Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>
  >({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [updateState, updateAction, isUpdating] = useActionState(
    updateCourse,
    initialActionState,
  );

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

  // Keep local classes in sync when server data changes (after revalidation)
  useEffect(() => {
    setClasses(course.classes);
  }, [course.classes]);

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
      if (editingIndex !== null) {
        // Optimistic update of the edited class
        setClasses((prev) =>
          prev.map((item, i) =>
            i === editingIndex
              ? {
                  ...item,
                  day: draft.day,
                  startsAt: draft.startsAt,
                  endsAt: draft.endsAt || null,
                  roomNo: draft.roomNo || null,
                }
              : item,
          ),
        );
      }

      setPanelOpen(false);
      setDraft(emptyClassDraft);
      setClassErrors({});
      setEditingIndex(null);
    }
  }, [classState]);

  function openPanelForNew() {
    setEditingIndex(null);
    setDraft(emptyClassDraft);
    setClassErrors({});
    setPanelOpen(true);
  }

  function openPanelForEdit(index: number) {
    const c = classes[index];
    setEditingIndex(index);
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
      setEditingIndex(null);
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

    if (editingIndex !== null) {
      formData.set("id", classes[editingIndex].id);
    }

    classAction(formData);
  }

  function closePanel() {
    trySubmitDraft();
    setPanelOpen(false);
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
          <form action={updateAction} className="space-y-8">
            <input type="hidden" name="id" value={course.id} />
            <input type="hidden" name="semesterId" value={semesterId} />

            <CourseTitleField
              value={title}
              onChange={setTitle}
              error={updateState.errors?.title?.[0]}
            />

            <CoursePropertyFields
              semesterId={semesterId}
              onSemesterChange={setSemesterId}
              semesters={semesters}
              courseCode={courseCode}
              onCourseCodeChange={setCourseCode}
              credit={credit}
              onCreditChange={setCredit}
              teacher={teacher}
              onTeacherChange={setTeacher}
              gradePoint={gradePoint}
              onGradePointChange={setGradePoint}
              errors={updateState.errors}
            />

            <CourseClassesSection
              classes={classes}
              draft={draft}
              showDraftPreview={panelOpen && editingIndex === null}
              onAddClick={openPanelForNew}
              onItemClick={openPanelForEdit}
              disabled={isClassPending}
              editingIndex={editingIndex}
            />

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
