"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createCourse } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import { ClassInput, classInputSchema } from "@/schema/course";
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

type SemesterOption = { id: string; label: string };

const PANEL_MS = 300;

export function CreateCourseForm({
  semesters,
}: {
  semesters: SemesterOption[];
}) {
  const { setContentFlush } = useAppChrome();

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [state, formAction, isPending] = useActionState(
    createCourse,
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

  function tryParseDraft(d: ClassDraft): ClassInput | null {
    const parsed = classInputSchema.safeParse({
      day: d.day,
      roomNo: d.roomNo || undefined,
      startsAt: d.startsAt,
      endsAt: d.endsAt || undefined,
    });
    return parsed.success ? parsed.data : null;
  }

  function commitDraftIfValid(): boolean {
    const parsed = tryParseDraft(draft);
    if (!parsed) return false;

    if (editingIndex !== null) {
      setClasses((prev) =>
        prev.map((item, i) => (i === editingIndex ? parsed : item)),
      );
    } else {
      setClasses((prev) => [...prev, parsed]);
    }
    return true;
  }

  function openPanelForNew() {
    if (panelOpen && editingIndex === null) {
      commitDraftIfValid();
      setDraft(emptyClassDraft);
      setClassErrors({});
      return;
    }
    setEditingIndex(null);
    setDraft(emptyClassDraft);
    setClassErrors({});
    setPanelOpen(true);
  }

  function openPanelForEdit(index: number) {
    const c = classes[index];
    setEditingIndex(index);
    setDraft({
      day: c.day,
      roomNo: c.roomNo ?? "",
      startsAt: c.startsAt,
      endsAt: c.endsAt ?? "",
    });
    setClassErrors({});
    setPanelOpen(true);
  }

  function closePanel() {
    commitDraftIfValid();
    setEditingIndex(null);
    setDraft(emptyClassDraft);
    setClassErrors({});
    setPanelOpen(false);
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
          <form action={formAction} className="space-y-8">
            <CourseTitleField
              value={title}
              onChange={setTitle}
              error={state.errors?.title?.[0]}
              autoFocus
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
              errors={state.errors}
              includeHiddenSemester
            />

            <CourseClassesSection
              classes={classes}
              draft={draft}
              showDraftPreview={panelOpen && editingIndex === null}
              onAddClick={openPanelForNew}
              onItemClick={openPanelForEdit}
              onRemoveClick={(index) =>
                setClasses((prev) => prev.filter((_, i) => i !== index))
              }
              editingIndex={editingIndex}
            />

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

      {/* Desktop panel */}
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

      {/* Mobile sheet */}
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
